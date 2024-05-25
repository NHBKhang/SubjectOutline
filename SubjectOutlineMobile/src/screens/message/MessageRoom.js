import { memo, useContext, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import API, { endpoints } from "../../configs/API";
import Avatar from "../../components/Avatar";
import { ActivityIndicator, Text } from "react-native-paper";
import { gStyles } from "../../core/global";
import InputField from "../../components/InputField";
import Context from "../../configs/Context";
import { addMessage, getMessages } from "../../configs/Firebase";
import { timeDifference } from "../../core/utils";
import { format, isSameDay } from "date-fns";
import MessageContentCard from "../../components/cards/MessageContentCard";

const MessageRoom = ({ route }) => {
    const toUserId = route.params?.userId;
    const [toUser, setToUser] = useState(null);
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState(null);
    const [user,] = useContext(Context);

    useEffect(() => {
        const loadUser = async () => {
            try {
                let res = await API.get(endpoints.user(toUserId));
                setToUser(res.data);
            } catch (ex) {
                console.error(ex);
            }
        }
        loadUser();

        const loadMessages = async () => {
            try {
                setMessages(await getMessages(user, toUserId));
            } catch (ex) {
                setMessages([]);
                console.error(ex);
            }
        }
        loadMessages();
    }, [toUserId]);

    const sendMessage = async (content) => {
        try {
            let res = await addMessage(user, content);

            console.log(res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert("Failed", "Gửi tin nhắn thất bại!");
        }
    }

    return (
        <>
            {toUser ? <>
                <View style={styles.userHeader}>
                    <View style={{ paddingEnd: 10 }}>
                        <Avatar src={toUser.avatar} size={55} /></View>
                    <Text style={styles.text}>{toUser.name}</Text>
                </View>

                <ScrollView style={{ width: '100%', position: 'absolute', bottom: 75 }}>
                    {messages ? <View style={gStyles.chat}>
                        {messages.map((m, index) => <View key={index}>
                            {(index === 0 || timeDifference(new Date(messages[index - 1].created_date), new Date(m.created_date)) > 30) &&
                                <Text style={styles.timeText}>
                                    {(index !== 0 && isSameDay(new Date(messages[index - 1].created_date), new Date(m.created_date)))
                                        ? format(new Date(m.created_date), 'HH:mm')
                                        : format(new Date(m.created_date), 'dd/MM/yyyy HH:mm')}
                                </Text>
                            }
                            <MessageContentCard
                                user={m.sender == user.id ? user : toUser}
                                isSender={m.sender == user.id}
                                content={m.content}
                                created_date={m.created_date} />
                        </View>)}
                    </View> : <ActivityIndicator />}
                </ScrollView>

                <InputField
                    placeholder="Nhập tin nhắn..."
                    value={content}
                    onChangeText={text => setContent(text)}
                    abs={true}
                    onPress={() => sendMessage(content)} />
            </> : <View style={[gStyles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator />
            </View>}
        </>
    )
}

const styles = StyleSheet.create({
    userHeader: {
        borderWidth: 0.5,
        borderColor: '#C1C0B9',
        padding: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    text: {
        fontSize: 18,
        fontWeight: '600'
    },
    timeText: {
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: '600',
        fontSize: 15
    },
});

export default memo(MessageRoom);