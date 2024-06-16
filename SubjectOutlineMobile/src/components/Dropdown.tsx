import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import DropDown from "react-native-paper-dropdown";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";

type Props = React.ComponentProps<typeof DropDown> & {
    containerStyle?: DefaultStyle
};

const Dropdown = ({ containerStyle, ...props }: Props) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <DropDown {...props} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 15,
        zIndex: 1000
    }
});

export default memo(Dropdown);