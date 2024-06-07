import { StyleSheet, View } from "react-native";
import { ActivityIndicator as PaperIndicator } from "react-native-paper";
import React, { memo } from "react";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";

type Props = React.ComponentProps<typeof PaperIndicator> & {
    containerStyle: DefaultStyle;
};

const ActivityIndicator = ({ containerStyle, ...props }: Props) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <PaperIndicator {...props} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default memo(ActivityIndicator);