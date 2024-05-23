import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Avatar from "../Avatar";
import { gStyles } from "../../core/global";
import { Text } from "react-native-paper";

type Props = {
    user?: any,
    isSender?: boolean,
    content?: string,
    createdDate?: string
};

const MessageContentCard = ({ user, isSender, content, createdDate }: Props) => {
    return (
        <View style={gStyles.w100}>
            <View style={isSender && styles.right}>
                <View style={styles.content}>
                    {isSender && <ContentBox content={content} isSender={isSender} />}
                    <Avatar src={user.avatar} size={25} />
                    {!isSender && <ContentBox content={content} isSender={isSender} />}
                </View>
            </View>
        </View>
    )
}

const ContentBox = ({ content, isSender }) => (
    <View style={[styles.contentContainer, isSender && styles.senderContainer]}>
        <Text style={styles.contentText}>{content}</Text>
    </View>
)

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    right: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    contentContainer: {
        marginHorizontal: 10,
        padding: 12,
        backgroundColor: 'gray',
        borderRadius: 10
    },
    senderContainer: {
        backgroundColor: 'blue'
    },
    contentText: {
        color: 'whitesmoke',
        fontSize: 16
    }
});

export default memo(MessageContentCard);