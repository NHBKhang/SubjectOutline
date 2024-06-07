import { memo, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { gStyles } from "../../core/global";
import API, { authApi, endpoints } from "../../configs/API";
import { numberValidator } from "../../core/utils";
import { degree } from "../../core/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    PaperLogo,
    TextInput, 
    Dropdown, 
    H1, 
    ActivityIndicator, 
    Button
} from "../../components";

const InstructorInfo = ({ navigation, route }) => {
    const userId = route.params?.userId;
    const [loading, setLoading] = useState(false);
    const [showDropDown, setShowDropDown] = useState({
        faculty: false,
        degree: false
    });
    const [faculties, setFaculties] = useState(null);
    const [instructor, setInstructor] = useState({
        faculty: { value: 0, error: null },
        work_room: { value: null, error: null },
        degree: { value: null, error: null },
        is_existed: false
    })

    useEffect(() => {
        const loadFaculties = async () => {
            try {
                let res = await API.get(endpoints.faculties);
                setFaculties(res.data);
            } catch (ex) {
                console.error(ex);
                setFaculties([]);
            }
        }

        const loadInstructor = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(endpoints.instructor(userId));

                updateInstructor('faculty', res.data.faculty, null);
                updateInstructor('work_room', res.data.work_room, null);
                updateInstructor('degree', res.data.degree, null);
                setInstructor(c => ({ ...c, 'is_existed': true }));
            } catch (ex) {
                console.error(ex);
            }
        }

        loadFaculties();
        loadInstructor();
    }, [userId]);

    const onPressDone = async () => {
        const facultyError = numberValidator(instructor.faculty.value, 'Khoa', true);
        const workRoomError = numberValidator(instructor.work_room.value, 'Phòng làm việc');
        const degreeError = numberValidator(instructor.degree.value, 'Chứng chỉ', true);

        if (facultyError || workRoomError) {
            updateInstructor('faculty', instructor.faculty.value, facultyError);
            updateInstructor('work_room', instructor.work_room.value, workRoomError);
            updateInstructor('degree', instructor.degree.value, degreeError);
        }
        else {
            setLoading(true);

            const form = new FormData();
            form.append('faculty', instructor.faculty.value);
            form.append('work_room', instructor.work_room.value);
            form.append('degree', instructor.degree.value);
            try {
                let token = await AsyncStorage.getItem("access-token");

                if (instructor.is_existed)
                    await authApi(token).patch(endpoints.instructor(userId), form, {
                        headers: { "Content-Type": 'multipart/form-data' }
                    });
                else
                    await authApi(token).post(endpoints.instructor(userId), form, {
                        headers: { "Content-Type": 'multipart/form-data' }
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

    const updateInstructor = (key, value, error) => {
        setInstructor(current => ({
            ...current, [key]: { value, error }
        }));
    };

    return (
        <ScrollView>
            <View style={[gStyles.container, gStyles.mx]}>
                <PaperLogo />
                <H1>Nhập thông tin giảng viên</H1>

                <Dropdown
                    label='Khoa'
                    mode='outlined'
                    visible={showDropDown.faculty}
                    showDropDown={() => setShowDropDown(current => ({
                        ...current, 'faculty': true
                    }))}
                    onDismiss={() => setShowDropDown(current => ({
                        ...current, 'faculty': false
                    }))}
                    value={instructor.faculty.value?.toString()}
                    setValue={v => updateInstructor("faculty", v, null)}
                    list={faculties ? faculties.map(f => ({
                        label: `${f.name}`,
                        value: `${f.id}`
                    })) : []} />

                <TextInput
                    label="Phòng làm việc"
                    returnKeyType="next"
                    value={instructor.work_room.value?.toString()}
                    onChangeText={text => updateInstructor("work_room", text, null)}
                    error={!!instructor.work_room.error}
                    errorText={instructor.work_room.error}
                    keyboardType="numeric" />

                <Dropdown
                    label='Chứng chỉ'
                    mode='outlined'
                    visible={showDropDown.degree}
                    showDropDown={() => setShowDropDown(current => ({
                        ...current, 'degree': true
                    }))}
                    onDismiss={() => setShowDropDown(current => ({
                        ...current, 'degree': false
                    }))}
                    value={instructor.degree.value}
                    setValue={v => updateInstructor("degree", v, null)}
                    list={degree ? degree.map(d => ({
                        label: `${d.name}`,
                        value: `${d.value}`
                    })) : []} />

                <View style={[{ marginTop: 50 }, gStyles.w100]}>
                    {loading ? <ActivityIndicator /> :
                        <Button mode="outlined" onPress={onPressDone}>
                            Xong
                        </Button>}</View>
            </View>
        </ScrollView>
    )
}

export default memo(InstructorInfo);