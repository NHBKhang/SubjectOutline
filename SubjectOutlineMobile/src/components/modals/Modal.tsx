import React, { memo } from 'react';
import { Modal as ReactModel, View, Text, Button, StyleSheet } from 'react-native';

type Props = React.ComponentProps<typeof ReactModel> & {
    content?: string
};

const Modal = ({ content, ...props }: Props) => {
    return (
        <ReactModel
            animationType="slide"
            transparent={true}
            {...props}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{content}</Text>
                    <Button title="Close" onPress={props.onRequestClose} />
                </View>
            </View>
        </ReactModel>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        fontSize: 17,
        textAlign: 'center',
    },
});

export default memo(Modal);
