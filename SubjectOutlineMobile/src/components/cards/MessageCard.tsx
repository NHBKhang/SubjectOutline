import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Avatar from "../Avatar";
import { Text } from "react-native-paper";
import { timeDifference } from "../../core/utils";
import { format, isSameDay } from "date-fns";
import { gStyles } from "../../core/global";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
    user?: any,
    content?: string,
    createdDate?: string,
    onPress?: () => void,
};

const MessageCard = ({ user, content, createdDate, onPress }: Props) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={[gStyles.row, gStyles.w100, { paddingVertical: 10 }]}>
                <Avatar style={styles.avatar} src={user.avatar} size={50} />
                <View style={[gStyles.row, { position: 'relative', width: '80%' }]}>
                    <View>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.content}>{content}</Text>
                    </View>
                    <View style={{ position: 'absolute', right: 5, bottom: 0 }}>
                        {timeDifference(new Date(createdDate), new Date()) > 30 &&
                            <Text style={styles.time}>
                                {(isSameDay(new Date(createdDate), new Date()))
                                    ? format(new Date(createdDate), 'HH:mm')
                                    : format(new Date(createdDate), 'dd/MM/yy')}
                            </Text>}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'whitesmoke',
        borderWidth: 1,
    },
    avatar: {
        paddingHorizontal: 10,
    },
    name: {
        fontWeight: '600',
        fontSize: 18,
        padding: 2
    },
    content: {
        overflow: 'hidden'
    },
    time: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default memo(MessageCard);