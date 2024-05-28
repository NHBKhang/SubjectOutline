import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../core/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { H2 } from './Header';
import Icon from 'react-native-vector-icons/AntDesign';
import { gStyles } from '../core/global';

type Props = React.ComponentProps<typeof PaperButton>;

const Button = ({ mode, style, children, ...props }: Props) => (
    <PaperButton
        style={[
            styles.button,
            mode === 'outlined' && { backgroundColor: theme.colors.surface },
            style
        ]}
        labelStyle={styles.text}
        mode={mode}
        {...props}>{children}
    </PaperButton>
);


type DeataildProps = React.ComponentProps<typeof TouchableOpacity> & {
    label?: string
}

export const DetailsButton = memo(({ label, ...props }: DeataildProps) => (
    <TouchableOpacity {...props}
        style={styles.details}>
        <View style={[gStyles.row, { backgroundColor: 'lightblue', alignItems: 'center' }]}>
            <View style={{ width: '90%' }}>
                <H2 style={styles.label}>{label}</H2>
            </View>
            <View style={styles.icon}>
                <Icon name='right' size={25} color={'whitesmoke'} />
            </View>
        </View>
    </TouchableOpacity>
))


const styles = StyleSheet.create({
    button: {
        width: '100%',
        marginVertical: 10,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 26,
    },
    details: {
        marginVertical: 5,
        position: 'relative',
    },
    label: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 2,
        width: '100%'
    },
    icon: {
        position: 'absolute',
        width: '10%',
        right: 0
    }
});

export default memo(Button);