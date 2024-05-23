import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({ size = 128 }) => {
    const image = StyleSheet.create({
        image: {
            width: size,
            height: size
        }
    });

    return (
        <Image
            source={require('../../static/assets/logo.png')}
            style={[styles.image, image.image]} />
    )
};

export const PaperLogo = ({ size = 128 }) => {
    const image = StyleSheet.create({
        image: {
            width: size,
            height: size
        }
    });

    return (
        <Image
            source={require('../../static/assets/paper_logo.png')}
            style={[styles.image, image.image]} />
    )
};

const styles = StyleSheet.create({
    image: {
        marginBottom: 12,
        borderRadius: 10
    },
});

export default memo(Logo);