import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { H2, H3 } from '../Header';
import { gStyles } from '../../core/global';
import { Text } from 'react-native-paper';

type Props = {
    title?: string,
    source?: string,
    code?: string,
    instructor?: string,
};

const OutlineCard = ({ title, source, code, instructor }: Props) => {
    return (
        <View style={[gStyles.row, styles.card]}>
            <Image style={styles.img} source={{ uri: source }} width={80} height={80} />
            <View style={styles.txt}>
                <H2>{title}</H2>
                <Text>Niên khóa: {code}</Text>
                <Text style={styles.instructor}>{instructor}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    card: {
        borderColor: 'lightgray',
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
      borderRadius: 5,
      width: '20%'
    },
    txt: {
        paddingHorizontal: 10,
        width: '80%'
    },
    instructor: {
        textAlign: 'right',
        padding: 0,
        marginEnd: 10,
        color: '#330093',
    }
});

export default memo(OutlineCard);