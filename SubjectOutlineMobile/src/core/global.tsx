import { StyleSheet } from "react-native";
import { theme } from "./theme";


export const gStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 20,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    col: {
        flexDirection: "column",
        flexWrap: 'wrap'
    },
    textCenter: {
        textAlign: 'center'
    },
    textEnd: {
        textAlign: 'right'
    },
    textStart: {
        textAlign: 'left'
    },
    textJustify: {
        textAlign: 'justify'
    },
    p0: {
        padding: 0
    },
    m0: {
        margin: 0
    },
    mx: {
        marginHorizontal: 50
    },
    me1: {
        marginEnd: 20
    },
    ms1: {
        marginStart: 20
    },
    w100: {
        width: '100%'
    },
    scroll: {
        backgroundColor: 'white',
        width: '100%'
    },
    chat: {
        margin: 10
    },
    textPrimary: {
        color: theme.colors.primary
    },
    textError: {
        color: theme.colors.error
    }
})