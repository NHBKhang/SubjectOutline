import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../core/theme';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes';

type Props = {
    children: React.ReactNode;
    style?: DefaultStyle;
};

export const H1 = memo(({ children, style }: Props) => (
    <Text style={[styles.h1, style]}>{children}</Text>
));

export const H2 = memo(({ children, style }: Props) => (
    <Text style={[styles.h2, style]}>{children}</Text>
));

export const H3 = memo(({ children, style }: Props) => (
    <Text style={[styles.h3, style]}>{children}</Text>
));

const styles = StyleSheet.create({
    h1: {
        fontSize: 26,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 14,
        textAlign: 'center'
    },
    h2: {
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold'
    },
    h3: {
        fontSize: 16,
        color: '#2E8B57',
        fontWeight: 'bold',
    }
});