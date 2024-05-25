import axios from "axios";
import getENV from "./Config";
import API, { endpoints as restEndpoints } from "./API";

const FirebaseAuth = (idToken) => {
    const { FIREBASE_RTDB_URL } = getENV();

    return (axios.create({
        baseURL: FIREBASE_RTDB_URL,
        params: {
            auth: idToken,
            print: 'pretty'
        }
    }))
};

const endpoints = {
    'messages': `/messages/`,
    'messages-by-user': (userId) => `/messages/user${userId}.json`,
    'messages-by-users': (userId, toUserId) => `/messages/user${userId}/user${toUserId}.json`,
}

export const signInWithEmailAndPassword = async (email, password) => {
    const { FIREBASE_API } = getENV();

    try {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API}`,
            {
                email: email,
                password: password,
                returnSecureToken: true,
            }
        );

        return response.data.idToken;
    } catch (error) {
        throw error;
    }
};

export const getAllMessages = async (user) => {
    try {
        let idToken = await signInWithEmailAndPassword(user.email, "123456");
        let res = await FirebaseAuth(idToken).get(endpoints["messages-by-user"](user.id));

        const array = [];
        await (async () => {
            for (const [user, messages] of Object.entries(res.data)) {
                const messageKeys = Object.keys(messages);
                const userData = await API.get(restEndpoints.user(user.replace(/\D/g, '')));
                if (messageKeys.length > 0) {
                    const lastMessageKey = messageKeys[messageKeys.length - 1];
                    const lastMessage = messages[lastMessageKey];
                    const toUser = userData.data;
                    array.push({
                        user: {
                            id: toUser.id,
                            avatar: toUser.avatar,
                            name: toUser.name,
                        },
                        content: lastMessage.content,
                        created_date: lastMessage.created_date,
                        sender: lastMessage.sender,
                    });
                }
            }
        })();
        array.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

        return array;
    } catch (error) {
        throw (error);
    }
};

export const getMessages = async (user, toUserId) => {
    try {
        let idToken = await signInWithEmailAndPassword(user.email, "123456");
        let res1 = await FirebaseAuth(idToken).get(endpoints["messages-by-users"](user.id, toUserId));
        let res2 = await FirebaseAuth(idToken).get(endpoints["messages-by-users"](toUserId, user.id));

        const values1 = Object.values(res1.data);
        const values2 = Object.values(res2.data);
        const mergedArray = [...values1, ...values2];
        mergedArray.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

        return mergedArray;
    } catch (error) {
        throw error;
    }
};

export const addMessage = async (user, content) => {
    try {
        let idToken = await signInWithEmailAndPassword(user.email, "123456");
        const form = new FormData();
        form.append('content', content);

        await FirebaseAuth(idToken).post(endpoints["messages-by-user"](user.id),
            form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    } catch (error) {
        throw error;
    }
};