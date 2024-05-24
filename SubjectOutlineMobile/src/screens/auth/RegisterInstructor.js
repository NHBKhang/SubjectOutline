import {
    avatarValidator,
    emailValidator,
    isNullOrEmpty,
    passwordValidator,
    stringValidator,
    usernameValidator,
} from '../../core/utils';
import React, { memo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import ImagePicker from '../../components/ImagePicker';
import API, { endpoints } from '../../configs/API';
import { ActivityIndicator } from 'react-native-paper';

const RegisterInstructor = ({ navigation }) => {
    const [username, setUsername] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [avatar, setAvatar] = useState({ value: null, error: '' });
    const [lastName, setLastName] = useState({ value: '', error: '' });
    const [firstName, setFirstName] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false);

    const onSignUpPressed = async () => {
        const usernameError = usernameValidator(username.value);
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        const avatarError = avatarValidator(avatar.value?.uri ?? null);
        const lastNameError = stringValidator(lastName.value, 'Họ');
        const firstNameError = stringValidator(firstName.value, 'Tên');

        if (isNullOrEmpty(password.value) || isNullOrEmpty(username.value) ||
            isNullOrEmpty(email.value) || isNullOrEmpty(avatar.value?.uri ?? null) ||
            isNullOrEmpty(lastName.value) || isNullOrEmpty(firstName.value)) {
            password.value = null;
            setUsername({ ...username, error: usernameError });
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            setAvatar({ ...avatar, error: avatarError });
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
            form.append("password", password.value.trim());
            form.append("avatar", {
                uri: avatar.value.uri,
                name: avatar.value.fileName,
                type: avatar.value.mimeType
            });
            form.append("is_active", false);
            form.append("is_staff", true);

            try {
                let check = await API.post(endpoints['user-check'], {
                    username: username.value
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (check.data.exists) {
                    setUsername({ value: username.value, error: check.data.message })
                }
                else {
                    let res = await API.post(endpoints.users, form, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.info(res.data);

                    navigation.navigate('Login');
                    Alert.alert("Done", "Yêu cầu đăng ký tài khoản đã được gửi thành công");
                }
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
                returnKeyType="next"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address" />

            <TextInput
                label="Mật khẩu"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry />

            <ImagePicker
                label='Chọn ảnh đại diện...'
                errorText={avatar.error}
                value={avatar.value}
                onValueChange={value => setAvatar({ value: value, error: '' })} />

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

export default memo(RegisterInstructor);