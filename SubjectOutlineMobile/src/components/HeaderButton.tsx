import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { gStyles } from "../core/global";
import Icon from 'react-native-vector-icons/AntDesign';

export const backButton = (callback, goBack = true) => {
    const navigation = useNavigation();

    const onPress = () => {
        try {
            if (callback && typeof callback === 'function')
                callback();

            if (goBack)
                navigation.goBack();
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <TouchableOpacity
            style={[gStyles.ms1, { paddingStart: 5 }]}
            onPress={onPress}>
            <Icon name="arrowleft" color={"blue"} size={25} />
        </TouchableOpacity>
    )
};

export const addButton = (callback) => {
    const onPress = () => {
        try {
            if (callback && typeof callback === 'function')
                callback();
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <TouchableOpacity
            style={[gStyles.me1, { paddingEnd: 5 }]}
            onPress={onPress}>
            <Icon name="pluscircleo" color={"blue"} size={25} />
        </TouchableOpacity>
    )
}

export const editButton = (callback) => {
    const onPress = () => {
        try {
            if (callback && typeof callback === 'function')
                callback();
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <TouchableOpacity
            style={[gStyles.me1, { paddingEnd: 5 }]}
            onPress={onPress}>
            <Icon name="edit" color={"blue"} size={25} />
        </TouchableOpacity>
    )
}


export const doneButton = (callback) => {
    return (
        <TouchableOpacity
            style={[gStyles.me1, { paddingEnd: 5 }]}
            onPress={callback}>
            <Icon name="checkcircleo" color={"blue"} size={25} />
        </TouchableOpacity>
    )
}