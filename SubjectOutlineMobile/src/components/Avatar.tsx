import React, { memo } from "react"
import { StyleSheet, View } from "react-native";
import { Avatar as PaperAvatar } from "react-native-paper";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";

type Props = {
    src: string,
    size?: number,
    style?: DefaultStyle,
    avatarStyle?: DefaultStyle
}

const Avatar = ({ src, size, style, avatarStyle }: Props) => {
    return (
        <View style={[style, styles.container]}>
            <PaperAvatar.Image
                style={avatarStyle}
                source={{ uri: src }}
                size={size ?? 75} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 1
    }
});

export default memo(Avatar);