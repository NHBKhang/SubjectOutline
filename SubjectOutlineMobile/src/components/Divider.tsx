import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = ({ height, spacing, color }) => {
    const styles = StyleSheet.create({
        divider: {
            borderBottomWidth: height ?? 1,
            borderBottomColor: color?? '#e0e0e0',
            marginVertical: spacing ?? 10,
        },
    });

    return <View style={styles.divider} />;
};
export default memo(Divider);