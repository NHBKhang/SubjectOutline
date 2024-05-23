import { memo } from "react"
import { StyleSheet, View } from "react-native";
import { gStyles } from "../../core/global";
import Avatar from "../Avatar";
import { Text } from "react-native-paper";
import moment from "moment";

type Props = {
    avatar?: string,
    username?: string,
    content?: string,
    createdDate?: string
};

const CommentCard = ({ avatar, username, content, createdDate }: Props) => {
    return (
        <View style={[gStyles.row, styles.container]}>
            <View style={styles.avatar}><Avatar src={avatar} size={60} /></View>
            <View style={styles.text}>
                <Text style={styles.username}>{username}</Text>
                <Text style={[]}>{content}</Text>
                <Text style={styles.date}>{moment(createdDate).fromNow()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    avatar: {
        margin: 5,
        marginEnd: 12
    },
    text: {
        justifyContent: 'center',
        flexDirection: 'column'
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16
    },
    date: {
        color: 'blue'
    }
});

export default memo(CommentCard);