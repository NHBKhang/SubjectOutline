import AsyncStorage from "@react-native-async-storage/async-storage";
import { memo, useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { H1 } from "../../components/Header";
import { doneButton } from "../../components/HeaderButton";
import TextInput from "../../components/TextInput";
import API, { authApi, endpoints } from "../../configs/API";
import { gStyles } from "../../core/global";
import CourseModal from "../../components/modals/CourseModal";
import Dropdown from "../../components/Dropdown";

const MyWorkDetails = ({ route, navigation }) => {
    const outlineId = route.params?.outlineId;
    const [outline, setOutline] = useState(null);
    const [courses, setCourses] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);

    const updateOutline = (field, value) => {
        setOutline(current => {
            return { ...current, [field]: value }
        })
    };

    navigation.setOptions({
        headerRight: () => doneButton(() => patchOutline(outlineId))
    });

    useEffect(() => {
        const loadOutline = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(
                    `${endpoints["outline-details"](outlineId)}?raw=true`);
                setOutline(res.data);
                console.log(res.data);
            } catch (ex) {
                setOutline([]);
                console.error(ex);
            }
        };
        const loadCourses = async () => {
            try {
                let res = await API.get(endpoints.courses);
                setCourses(res.data.results);
            } catch (ex) {
                setCourses([]);
                console.error(ex);
            }
        }

        loadOutline();
        loadCourses();
    }, [outlineId]);

    const patchOutline = async (outlineId) => {
        try {
            let token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).patch(
                `${endpoints["outline-details"](outlineId)}`,
                outline, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setOutline(res.data);

            Alert.alert("Cập nhật", "Cập nhật đề cương thành công");
        } catch (ex) {
            Alert.alert("Lỗi", "Lỗi hệ thống! Không thể cập nhật đề cương");
            console.log(ex);
        }
    };

    return (
        <View style={gStyles.container}>
            {outline === null ?
                <View style={[gStyles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator />
                </View> : <ScrollView>
                    <H1>Cập nhật đề cương</H1>
                    <Text>Mã đề cương: {outline.id}</Text>
                    <TextInput
                        label="Nhập tên đề cương"
                        value={outline.title}
                        onChangeText={t => updateOutline("title", t)}
                        multiline={true}
                        numberOfLines={2} />
                    <TextInput
                        label="Niên khóa"
                        value={outline.year.toString()}
                        onChangeText={t => updateOutline("year", Number(t))}
                        keyboardType="numeric"
                        maxLength={4} />
                    {/* <View style={[gStyles.row]}>
                        <View style={{ width: '85%' }}> */}
                    <Dropdown
                        label='Môn học'
                        mode='outlined'
                        visible={showDropDown}
                        showDropDown={() => setShowDropDown(true)}
                        onDismiss={() => setShowDropDown(false)}
                        value={outline.course.toString()}
                        setValue={v => updateOutline("course", v)}
                        list={courses ? courses.map(c => ({
                            label: `${c.name}`,
                            value: `${c.id}`
                        })) : []} />
                    {/* </View>
                        <View style={{ width: '12%', marginStart: '3%', marginTop: 24 }}>
                            <CourseModal />
                        </View>
                    </View> */}
                    <TextInput
                        label="Quy định môn học"
                        multiline={true}
                        value={outline.rule}
                        onChangeText={t => updateOutline("rule", t)} />
                </ScrollView>}
        </View>
    )
}

export default memo(MyWorkDetails);