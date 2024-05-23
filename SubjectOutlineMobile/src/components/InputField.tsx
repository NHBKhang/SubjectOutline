import React, { memo } from "react"
import { StyleSheet, View } from "react-native";
import TextInput from "./TextInput";
import Button from "./Button";
import Icon from 'react-native-vector-icons/FontAwesome';
import { gStyles } from "../core/global";

type Props = React.ComponentProps<typeof TextInput> & {
    onPress?: () => void,
    abs?: boolean
};

const InputField = ({ onPress, abs = false, ...props }: Props) => {
    return (
        <View style={[gStyles.w100, gStyles.row, styles.sticky, abs && styles.abs]}>
            <TextInput
                containerStyle={styles.containerStyle}
                style={{ height: 45 }}
                {...props} />
            <Button
                onPress={onPress}
                style={{ width: 25, height: 45 }}>
                <Icon name="paper-plane" color={'#330093'} size={25} />
            </Button>
        </View>
    )
};

const styles = StyleSheet.create({
    sticky: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightgray",
        paddingStart: 10,
        height: 65,
        zIndex: 100
    },
    containerStyle: {
        width: '80%',
    },
    abs: {
        position: 'absolute',
        bottom: 0,
    }
});

export default memo(InputField);