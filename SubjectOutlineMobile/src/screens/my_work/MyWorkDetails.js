import AsyncStorage from "@react-native-async-storage/async-storage";
import { memo, useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import API, { authApi, endpoints } from "../../configs/API";
import { gStyles } from "../../core/global";
import CourseModal from "../../components/modals/CourseModal";
import { dropdownValue } from "../../core/utils";
import {
    doneButton,
    TextInput,
    H1,
    Dropdown,
    DetailsButton
} from "../../components";

const MyWorkDetails = ({ route, navigation }) => {
    const outlineId = route.params?.outlineId;
    const [outline, setOutline] = useState(null);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [years, setYears] = useState([]);
    const [showDropDown, setShowDropDown] = useState(false);

    const updateOutline = (field, value) => {
        setOutline(current => {
            return { ...current, [field]: value }
        })
        setError(current => {
            return { ...current, [field]: null }
        })
    };

    useEffect(() => {
        const loadOutline = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(
                    `${endpoints["outline-details"](outlineId)}?raw=true`);
                setOutline(res.data);
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
        };
        const loadYears = async () => {
            try {
                let res = await API.get(endpoints.years);
                let data = await res.data.map(c => ({
                    label: `${c.year}`,
                    value: `${c.id}`
                }));
                setYears(data);
            } catch (ex) {
                console.error(ex);
            }
        };

        loadOutline();
        loadCourses();
        loadYears();
    }, [outlineId]);

    navigation.setOptions({
        headerRight: () => doneButton(() => patchOutline())
    });

    const patchOutline = async () => {
        try {
            console.info(outline.years)
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
            console.error(ex);
        }
    };

    const updateDropDown = (field, value) => {
        setShowDropDown(current => {
            return { ...current, [field]: value }
        })
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
                    <Dropdown
                        label="Niên khóa"
                        mode='outlined'
                        visible={showDropDown?.years}
                        showDropDown={() => updateDropDown('years', true)}
                        onDismiss={() => updateDropDown('years', false)}
                        value={outline.years?.toString()}
                        setValue={v => {
                            let arr = dropdownValue(v);
                            if (arr.length <= 2)
                                updateOutline("years", arr);
                        }}
                        list={years}
                        multiSelect />
                    {/* <View style={[gStyles.row]}>
                        <View style={{ width: '85%' }}> */}
                    <Dropdown
                        label='Môn học'
                        mode='outlined'
                        visible={showDropDown?.course}
                        showDropDown={() => updateDropDown('course', true)}
                        onDismiss={() => updateDropDown('course', false)}
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
                            requirementId: outline.requirement
                        })} />
                    <DetailsButton label="Mục tiêu"
                        onPress={() => navigation.navigate("ObjectiveDetails", {
                            outlineId: outline.id,
                            existed: outline.objectives && outline.objectives.length > 0
                        })} />
                    <DetailsButton label="Chuẩn đầu ra"
                        onPress={() => navigation.navigate("OutcomeDetails", {
                            outlineId: outline.id,
                            existed: outline.learning_outcomes && outline.learning_outcomes.length > 0
                        })} />
                    <DetailsButton label="Học liệu"
                        onPress={() => navigation.navigate("MaterialDetails", {
                            outlineId: outline.id,
                            existed: outline.materials && outline.materials.length > 0
                        })} />
                    <DetailsButton label="Đánh giá môn học"
                        onPress={() => navigation.navigate("EvaluationDetails", {
                            outlineId: outline.id,
                            existed: outline.evaluations && outline.evaluations.length > 0
                        })} />
                    <DetailsButton label="Kế hoạch giảng dạy"
                        onPress={() => navigation.navigate("ScheduleDetails", {
                            outlineId: outline.id,
                            existed: outline.schedule_weeks && outline.schedule_weeks.length > 0
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