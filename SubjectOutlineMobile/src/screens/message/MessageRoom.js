import { memo, useContext, useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import API, { endpoints } from "../../configs/API";
import { ActivityIndicator, Text } from "react-native-paper";
import { gStyles } from "../../core/global";
import { InputField, Avatar } from "../../components";
import Context from "../../configs/Context";
import { addMessage, getMessages } from "../../configs/Firebase";
import { timeDifference } from "../../core/utils";
import { format, isSameDay } from "date-fns";
import MessageContentCard from "../../components/cards/MessageContentCard";

const MessageRoom = ({ route }) => {
    const receiverUser = route.params?.user;
    const scrollViewRef = useRef(null);
    const [toUser, setToUser] = useState(null);
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState(null);
    const [user,] = useContext(Context);

    useEffect(() => {
        const loadUser = async () => {
            try {
                let res = await API.get(endpoints.user(receiverUser.id));
                setToUser(res.data);
            } catch (ex) {
                console.error(ex);
            }
        }
        loadUser();

        const loadMessages = async () => {
            try {
                setMessages(await getMessages(user, receiverUser));
            } catch (ex) {
                setMessages([]);
                console.error(ex);
            }
        }
        loadMessages();

        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    }, [receiverUser]);

    const sendMessage = async (content) => {
        try {
            let res = await addMessage(user, receiverUser, content);

            if (res.data) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        sender: user.id,
                        content: content,
                        timestamp: Date.now()
                    }
                ]);
            }
            setContent('');
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

                <ScrollView style={{ bottom: 65, marginTop: 65 }}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}>
                    {messages ? <View style={gStyles.chat}>
                        {messages.map((m, index) => <View key={index}>
                            {(index === 0 || timeDifference(new Date(messages[index - 1].timestamp), new Date(m.timestamp)) > 30) &&
                                <Text style={styles.timeText}>
                                    {(index !== 0 && isSameDay(new Date(messages[index - 1].timestamp), new Date(m.timestamp)))
                                        ? format(new Date(m.timestamp), 'HH:mm')
                                        : format(new Date(m.timestamp), 'dd/MM/yyyy HH:mm')}
                                </Text>
                            }
                            <MessageContentCard
                                user={m.sender == user.id ? user : toUser}
                                isSender={m.sender == user.id}
                                content={m.content}
                                created_date={m.timestamp} />
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
        backgroundColor: 'white',
        zIndex: 1000
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
    textScroll: {

    }
});

export default memo(MessageRoom);