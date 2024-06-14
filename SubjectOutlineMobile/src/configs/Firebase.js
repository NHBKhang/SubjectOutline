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
    'messages-by-user': (username) => `/messages/${username}.json`,
    'messages-by-users': (username, receiverUsername) => `/messages/${username}/${receiverUsername}.json`,
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
        if (error.response?.data?.error?.message === 'EMAIL_NOT_FOUND') {
            try {
                let response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API}`, {
                    email: email,
                    password: password,
                    returnSecureToken: true
                });

                return response.data.idToken;
            } catch (error) {
                throw(error);
            }
        } else {
            throw(error);
        }
    }
};

export const getAllMessages = async (user) => {
    try {
        let idToken = await signInWithEmailAndPassword(user.email, "123456");
        let res = await FirebaseAuth(idToken).get(
            endpoints["messages-by-user"](user.username));

        const array = [];
        await (async () => {
            for (const [receiver, messages] of Object.entries(res.data)) {
                const messageKeys = Object.keys(messages);
                const userData = await API.get(restEndpoints["user-by-username"](receiver));
                if (messageKeys.length > 0) {
                    const lastMessage = messages[messageKeys[0]];
                    const toUser = userData.data;
                    array.push({
                        user: {
                            id: toUser.id,
                            avatar: toUser.avatar,
                            name: toUser.name,
                            username: toUser.username
                        },
                        content: lastMessage.content,
                        timestamp: lastMessage.timestamp,
                        sender: lastMessage.sender,
                    });
                }
            }
        })();
        array.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return array;
    } catch (error) {
        throw (error);
    }
};

export const getMessages = async (user, receiverUser) => {
    try {
        let idToken = await signInWithEmailAndPassword(user.email, "123456");
        let res = await FirebaseAuth(idToken).get(endpoints["messages-by-users"](user.username, receiverUser.username));
        console.log(endpoints["messages-by-users"](user.username, receiverUser.username));
        const array = [...Object.values(res.data)];
        array.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return array;
    } catch (error) {
        throw error;
    }
};

export const addMessage = async (user, receiverUser, content) => {
    try {
        let idToken = await signInWithEmailAndPassword(user.email, "123456");
        const data = {
            sender: user.id,
            content: content,
            timestamp: Date.now()
        };

        await FirebaseAuth(idToken).post(
            endpoints["messages-by-users"](user.username, receiverUser.username), data);
        let res = await FirebaseAuth(idToken).post(
            endpoints["messages-by-users"](receiverUser.username, user.username), data);

        return res;
    } catch (error) {
        throw error;
    }
};