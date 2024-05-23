import {
    emailValidator,
    isNullOrEmpty,
    stringValidator,
    usernameValidator,
} from '../../core/utils';
import React, { memo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import API, { endpoints } from '../../configs/API';
import { ActivityIndicator } from 'react-native-paper';

const RegisterStudent = ({ navigation }) => {
    const [username, setUsername] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [lastName, setLastName] = useState({ value: '', error: '' });
    const [firstName, setFirstName] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false);

    const onSignUpPressed = async () => {
        const usernameError = usernameValidator(username.value);
        const emailError = emailValidator(email.value);
        const lastNameError = stringValidator(lastName.value, 'Họ');
        const firstNameError = stringValidator(firstName.value, 'Tên');

        if (isNullOrEmpty(username.value) || isNullOrEmpty(email.value) ||
            isNullOrEmpty(lastName.value) || isNullOrEmpty(firstName.value)) {
            setUsername({ ...username, error: usernameError });
            setEmail({ ...email, error: emailError });
            setLastName({ ...lastName, error: lastNameError });
            setFirstName({ ...firstName, error: firstNameError });
        }
        else {
            setLoading(true);

            const form = new FormData();
            form.append("username", username.value.trim());
            form.append("last_name", lastName.value.trim());
            form.append("first_name", firstName.value.trim());
            form.append("email", email.value.trim());

            try {
                let res = await API.post(endpoints['user-requests'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.info(res.data);

                navigation.navigate('Login');
                Alert.alert("Done", "Yêu cầu đăng ký tài khoản đã được gửi thành công");
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Đăng ký tài khoản thất bại");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <TextInput
                label="Tên tài khoản"
                returnKeyType="next"
                value={username.value}
                onChangeText={text => setUsername({ value: text, error: '' })}
                error={!!username.error}
                errorText={username.error} />

            <TextInput
                label="Họ"
                returnKeyType="next"
                value={lastName.value}
                onChangeText={text => setLastName({ value: text, error: '' })}
                error={!!lastName.error}
                errorText={lastName.error} />

            <TextInput
                label="Tên"
                returnKeyType="next"
                value={firstName.value}
                onChangeText={text => setFirstName({ value: text, error: '' })}
                error={!!firstName.error}
                errorText={firstName.error} />

            <TextInput
                label="Email"
                returnKeyType="done"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address" />

            {loading ? <ActivityIndicator style={styles.button} /> :
                <Button mode="contained" onPress={onSignUpPressed} style={styles.button}>
                    Đăng ký
                </Button>}
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 24,
    }
});

export default memo(RegisterStudent);