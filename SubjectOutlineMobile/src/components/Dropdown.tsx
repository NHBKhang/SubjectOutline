import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import DropDown from "react-native-paper-dropdown";

type Props = React.ComponentProps<typeof DropDown>;

const Dropdown = ({ ...props }: Props) => {
    return (
        <View style={styles.container}>
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