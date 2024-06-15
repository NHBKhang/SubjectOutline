import React, { memo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateFromString, parseStringToDate } from '../core/utils';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes';

type Props = React.ComponentProps<typeof Input> & {
    errorText?: string,
    type?: string,
    containerStyle?: DefaultStyle,
    maximumDate?: Date
};

const TextInput = ({ errorText, type, containerStyle, maximumDate, ...props }: Props) => {
    const [date, setDate] = useState(parseStringToDate(props.value));
    const [show, setShow] = useState(false);

    const onChange = async (event, selectedDate) => {
        await setShow(Platform.OS === 'ios');
        await setDate(selectedDate);

        const dateStr = formatDateFromString(selectedDate);
        props.value = dateStr;
        props.onChangeText?.(dateStr);
    };

    const onChangeText = (text) => {
        let current = parseStringToDate(text);
        if (current) setDate(current);

        props.onChangeText?.(formatDateFromString(date));
    }

    return (
        <View style={[styles.container, containerStyle]}>
            <Input
                style={styles.input}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                {...props}
                value={type == 'date' ? formatDateFromString(date) : props.value}
                onChangeText={type == 'date' ?
                    onChangeText : props.onChangeText} />

            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

            {type == 'date' &&
                <View style={styles.abs}>
                    <TouchableOpacity
                        style={[styles.btn, styles.rel]}
                        onPress={() => setShow(!show)}>
                        <Icon
                            name='calendar'
                            size={25} color='gray' />
                        {show &&
                            <DateTimePicker
                                style={[styles.abs, styles.picker]}
                                value={date ?? new Date()}
                                onChange={onChange}
                                is24Hour={true}
                                display="default"
                                maximumDate={maximumDate}
                                onTouchCancel={() => setDate(null)}
                                mode={type} />}
                    </TouchableOpacity>
                </View>}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 12,
        position: 'relative'
    },
    input: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        zIndex: -1
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
    rel: {
        position: 'relative'
    },
    abs: {
        position: 'absolute',
        right: 0,
        zIndex: 100
    },
    btn: {
        top: '65%',
        right: 15
    },
    picker: {
        top: '120%'
    }
});

export default memo(TextInput);