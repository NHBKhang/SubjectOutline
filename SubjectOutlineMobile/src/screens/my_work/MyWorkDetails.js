import AsyncStorage from "@react-native-async-storage/async-storage";
import { memo, useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { H1, H2 } from "../../components/Header";
import { doneButton } from "../../components/HeaderButton";
import TextInput from "../../components/TextInput";
import API, { authApi, endpoints } from "../../configs/API";
import { gStyles } from "../../core/global";
import CourseModal from "../../components/modals/CourseModal";
import Dropdown from "../../components/Dropdown";
import { isNullOrEmpty, outlineTranslator, stringValidator } from "../../core/utils";
import { DetailsButton } from "../../components/Button";

const MyWorkDetails = ({ route, navigation }) => {
    const outlineId = route.params?.outlineId;
    const [outline, setOutline] = useState(null);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [showDropDown, setShowDropDown] = useState(false);

    const updateOutline = (field, value) => {
        setOutline(current => {
            return { ...current, [field]: value }
        })
        setError(current => {
            return { ...current, [field]: null }
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
                console.log(res.data)
            } catch (ex) {
                setOutline([]);
                console.error(ex);
            }
        };
        const loadCourses = async () => {
            try {
                let res = await API.get(endpoints.courses);

                let data = await res.data.results.map(c => ({
                    label: `${c.name}`,
                    value: `${c.id}`
                }));
                setCourses(data);
            } catch (ex) {
                console.error(ex);
            }
        }

        loadOutline();
        loadCourses();
    }, [outlineId]);

    const patchOutline = async (outlineId) => {
        try {
            console.log(outline);
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

            Alert.alert("Cập nhật", "Cập nhật đề cương thành công",
                [
                    {
                        text: 'Thoát',
                        style: 'cancel'
                    },
                    { cancelable: false }
                ]);
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
                        numberOfLines={2}
                        error={!!error?.title}
                        errorText={error?.title} />
                    <TextInput
                        label="Niên khóa"
                        value={outline.year?.toString()}
                        onChangeText={t => updateOutline("year", Number(t))}
                        keyboardType="numeric"
                        maxLength={4}
                        error={!!error?.year}
                        errorText={error?.year} />
                    {/* <View style={[gStyles.row]}>
                        <View style={{ width: '85%' }}> */}
                    <Dropdown
                        label='Môn học'
                        mode='outlined'
                        visible={showDropDown}
                        showDropDown={() => setShowDropDown(true)}
                        onDismiss={() => setShowDropDown(false)}
                        value={outline.course?.toString()}
                        setValue={v => updateOutline("course", v)}
                        list={courses} />
                    {/* </View>
                        <View style={{ width: '12%', marginStart: '3%', marginTop: 24 }}>
                            <CourseModal />
                        </View>
                    </View> */}

                    <DetailsButton label="Môn học điều kiện"
                        onPress={() => navigation.navigate("RequirementDetails", {
                            courses: courses,
                            outlineId: outline.id
                        })} />
                    <DetailsButton label="Mục tiêu"
                        onPress={() => navigation.navigate("RequirementDetails", {
                            outlineId: outline.id
                        })} />
                    <DetailsButton label="Chuẩn đầu ra"
                        onPress={() => navigation.navigate("RequirementDetails", {
                            outlineId: outline.id
                        })} />
                    <DetailsButton label="Học liệu"
                        onPress={() => navigation.navigate("RequirementDetails", {
                            outlineId: outline.id
                        })} />
                    <DetailsButton label="Đánh giá môn học"
                        onPress={() => navigation.navigate("EvaluationDetails", {
                            outlineId: outline.id
                        })} />
                    <DetailsButton label="Kế hoạch giảng dạy"
                        onPress={() => navigation.navigate("RequirementDetails", {
                            outlineId: outline.id
                        })} />

                    <TextInput
                        label="Quy định môn học"
                        multiline={true}
                        numberOfLines={12}
                        value={outline.rule}
                        onChangeText={t => updateOutline("rule", t)}
                        error={!!error?.rule}
                        errorText={error?.rule} />
                </ScrollView>}
        </View>
    )
}

export default memo(MyWorkDetails);