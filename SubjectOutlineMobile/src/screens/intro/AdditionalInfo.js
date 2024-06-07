import { memo, useContext, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { gStyles } from "../../core/global";
import { getCurrentDate, numberValidator, stringValidator, toMyDate, toServerDate } from "../../core/utils";
import Context from "../../configs/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import {
    PaperLogo, 
    ActivityIndicator, 
    H1, 
    Button, 
    TextInput
} from "../../components";

const AdditionalInfo = ({ navigation }) => {
    const [user, dispatch] = useContext(Context);
    const [birthday, setBirthday] = useState({ value: user.birthday, error: null });
    const [phone, setPhone] = useState({ value: user.phone, error: null });
    const [loading, setLoading] = useState(false);

    const onPressContinue = async () => {
        const birthdayError = stringValidator(birthday.value, 'Ngày sinh');
        const phoneError = numberValidator(phone.value, 'Số điện thoại');


        if (birthdayError || phoneError) {
            setBirthday({ ...birthday, error: birthdayError });
            setPhone({ ...phone, error: phoneError });
        }
        else {
            setLoading(true);

            const form = new FormData();
            form.append('birthday', toServerDate(birthday.value));
            form.append('phone', phone.value);
            if (user.is_staff) form.append('last_login', getCurrentDate());

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

                if (user.is_staff)
                    navigation.navigate("InstructorInfo", { "userId": user.id });
                else
                    navigation.navigate("StudentInfo");
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Lỗi hệ thống!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView>
            <View style={[gStyles.container, gStyles.mx]}>
                <PaperLogo />
                <H1>Nhập thông tin bổ sung</H1>

                <TextInput
                    label="Ngày sinh"
                    returnKeyType="next"
                    value={birthday.value}
                    onChangeText={text => setBirthday({ value: text, error: null })}
                    error={!!birthday.error}
                    errorText={birthday.error}
                    autoCapitalize="none"
                    type="date" />

                <TextInput
                    label="Số điện thoại"
                    returnKeyType="done"
                    value={phone.value}
                    onChangeText={text => setPhone({ value: text, error: null })}
                    error={!!phone.error}
                    errorText={phone.error}
                    keyboardType="numeric" />

                <Button
                    style={{ marginTop: 50 }} mode="contained"
                    onPress={() => navigation.navigate('Dashboard')}>
                    Trở về
                </Button>
                {loading ? <ActivityIndicator /> :
                    <Button mode="outlined" onPress={onPressContinue}>
                        Tiếp tục
                    </Button>}
            </View>
        </ScrollView>
    )
}

export default memo(AdditionalInfo);