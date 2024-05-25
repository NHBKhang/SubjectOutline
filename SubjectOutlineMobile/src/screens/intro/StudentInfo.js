import { Alert, ScrollView, View } from "react-native"
import { gStyles } from "../../core/global"
import { memo, useContext, useState } from "react"
import { ActivityIndicator } from "react-native-paper";
import Button from "../../components/Button";
import ImagePicker from "../../components/ImagePicker";
import { avatarValidator, confirmPasswordValidator, getCurrentDate, isNullOrEmpty, passwordValidator, toMyDate } from "../../core/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import TextInput from "../../components/TextInput";
import { PaperLogo } from "../../components/Logo";
import { H1 } from "../../components/Header";
import Context from "../../configs/Context";

const StudentInfo = ({ navigation }) => {
    const [, dispatch] = useContext(Context);
    const [avatar, setAvatar] = useState({ value: null, error: null });
    const [password, setPassword] = useState({ value: null, error: null });
    const [confirmPassword, setConfirmPassword] = useState({ value: null, error: null });
    const [loading, setLoading] = useState(false);

    const onPressDone = async () => {
        const avatarError = avatarValidator(avatar.value?.uri ?? null);
        const passwordError = passwordValidator(password.value);
        const confirmPasswordError = confirmPasswordValidator(password.value,
            confirmPassword.value);

        if (!isNullOrEmpty(avatarError) || !isNullOrEmpty(passwordError) ||
            !isNullOrEmpty(confirmPasswordError)) {
            setAvatar({ ...avatar, error: avatarError });
            setPassword({ ...password, error: passwordError });
            setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
        }
        else {
            setLoading(true);

            const form = new FormData();
            form.append('password', password.value);
            form.append('avatar', {
                uri: avatar.value.uri,
                name: avatar.value.fileName,
                type: avatar.value.mimeType
            });
            form.append('last_login', getCurrentDate());
            console.log(form._parts[1]);

            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).patch(endpoints["current-user"], form, {
                    headers: {
                        "Content-Type": 'multipart/form-data'
                    }
                })
                res.data.birthday = toMyDate(res.data.birthday);
                dispatch({
                    type: "login",
                    payload: res.data
                });

                navigation.navigate('Main');
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Lỗi hệ thống!");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <ScrollView>
            <View style={[gStyles.container, gStyles.mx]}>
                <PaperLogo />
                <H1>Nhập thông tin sinh viên</H1>

                <TextInput
                    label="Mật khẩu mới"
                    returnKeyType="next"
                    value={password.value}
                    onChangeText={text => setPassword({ value: text, error: null })}
                    error={!!password.error}
                    errorText={password.error}
                    secureTextEntry />

                <TextInput
                    label="Nhập lại mật khẩu"
                    returnKeyType="done"
                    value={confirmPassword.value}
                    onChangeText={text => setConfirmPassword({ value: text, error: '' })}
                    error={!!confirmPassword.error}
                    errorText={confirmPassword.error}
                    secureTextEntry />

                <ImagePicker
                    label='Chọn ảnh đại diện...'
                    errorText={avatar.error}
                    value={avatar.value}
                    onValueChange={value => setAvatar({ value: value, error: null })} />

                <View style={[{ marginTop: 50 }, gStyles.w100]}>
                    {loading ? <ActivityIndicator /> :
                        <Button mode="outlined" onPress={onPressDone}>
                            Xong
                        </Button>}</View>
            </View>
        </ScrollView>
    )
}

export default memo(StudentInfo);