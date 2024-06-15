
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import React, { memo, useContext, useEffect, useState } from 'react';
import { checkPassword, getAccessToken, passwordValidator, toMyDate, usernameValidator } from "../../core/utils";
import { theme } from '../../core/theme';
import { Checkbox } from 'react-native-paper';
import API, { authApi, endpoints } from '../../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Context from '../../configs/Context';
import { ScrollView } from 'react-native-gesture-handler';
import { gStyles } from '../../core/global';
import getENV from '../../configs/Config';
import { ActivityIndicator, Button, H1, Logo, TextInput } from '../../components';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [, dispatch] = useContext(Context);

    useEffect(() => {
        const loadUsername = async () => {
            let storedUsername = await AsyncStorage.getItem("username");
            setUsername({ value: storedUsername, error: '' });
            if (storedUsername) setChecked(true);
        }

        loadUsername();
    }, []);

    const onLoginPressed = async () => {
        const usernameError = usernameValidator(username.value);
        const passwordError = passwordValidator(password.value);

        if (usernameError || passwordError) {
            password.value = null;
            setUsername({ ...username, error: usernameError });
            setPassword({ ...password, error: passwordError });
            return;
        }
        setLoading(true);

        try {
            let storedUsername = await AsyncStorage.getItem("username");
            let refreshToken = await AsyncStorage.getItem("refresh-token");
            let token = await getAccessToken();
            let user = null;
            const { CLIENT_ID, CLIENT_SECRET } = getENV();

            if (storedUsername && storedUsername == username.value &&
                await checkPassword(password.value) && refreshToken) {
                if (token) {
                    user = await authApi(token).get(endpoints['current-user']);
                    user.data.birthday = toMyDate(user.data.birthday);
                }
                else {
                    const res = await API.post(endpoints.login, {
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                    });
                    const { access_token, refresh_token, expires_in } = res.data;
                    await AsyncStorage.setItem("token-expired", JSON.stringify(Date.now() + expires_in * 1000));
                    await AsyncStorage.setItem("refresh-token", refresh_token);
                    await AsyncStorage.setItem("access-token", access_token);
                    user = await authApi(res.data.access_token).get(endpoints['current-user']);
                    user.data.birthday = toMyDate(user.data.birthday);
                }
            }
            else {
                let res = await API.post(endpoints.login, {
                    "username": username.value,
                    "password": password.value,
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                    "grant_type": "password"
                });
                const { access_token, refresh_token, expires_in } = res.data;
                await AsyncStorage.setItem("token-expired", JSON.stringify(Date.now() + expires_in * 1000));
                await AsyncStorage.setItem("refresh-token", refresh_token);
                await AsyncStorage.setItem("access-token", access_token);
                user = await authApi(res.data.access_token).get(endpoints['current-user']);
                user.data.birthday = toMyDate(user.data.birthday);
            }
            
            if (user) {
                dispatch({
                    type: "login",
                    payload: user.data
                });
            }
            
            if (user.data.last_login)
                navigation.navigate('Main');
            else
                navigation.navigate("IntroStack");
        } catch (ex) {
            Alert.alert("Error", `${ex.message}!! Thử lại sau.`);
            console.error(ex);
            await AsyncStorage.removeItem("refresh-token");
        } finally {
            setLoading(false);

            if (checked) {
                await AsyncStorage.setItem("username", username.value);
                await AsyncStorage.setItem("password", password.value);
            }
            else {
                await AsyncStorage.removeItem("username");
                await AsyncStorage.removeItem("password");
            }
        }
    };

    return (
        <ScrollView>
            <View style={[gStyles.container, gStyles.mx]}>
                <Logo />
                <H1>Chào mừng trở lại</H1>

                <TextInput
                    label="Tên tài khoản"
                    returnKeyType="next"
                    value={username.value}
                    onChangeText={text => setUsername({ value: text, error: '' })}
                    error={!!username.error}
                    errorText={username.error}
                    autoCapitalize="none" />

                <TextInput
                    label="Mật khẩu"
                    returnKeyType="done"
                    value={password.value}
                    onChangeText={text => setPassword({ value: text, error: '' })}
                    error={!!password.error}
                    errorText={password.error}
                    secureTextEntry />

                <TouchableOpacity
                    style={[styles.remember, gStyles.row]}
                    onPress={() => setChecked(!checked)}>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => setChecked(!checked)} />
                    <Text>Ghi nhớ tôi</Text>
                </TouchableOpacity>

                <View style={styles.forgotPassword}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.label}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>

                {loading === true ? <ActivityIndicator /> : <>
                    <Button mode="contained" onPress={onLoginPressed}>
                        Đăng nhập
                    </Button>
                </>}

                <View style={styles.row}>
                    <Text style={styles.label}>Bạn chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 20,
        marginRight: 10
    },
    remember: {
        width: '100%',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    label: {
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default memo(Login);