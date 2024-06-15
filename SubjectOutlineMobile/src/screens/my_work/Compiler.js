import { memo, useContext, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { gStyles } from "../../core/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API, { authApi, endpoints } from "../../configs/API";
import { doneButton, TextInput, H1, Dropdown } from "../../components";
import CourseModal from "../../components/modals/CourseModal";
import { dropdownValue, isNullOrEmpty, outlineTranslator, stringValidator } from "../../core/utils";
import Context from "../../configs/Context";
import { ScrollView } from "react-native-gesture-handler";

const Compiler = ({ navigation }) => {
    const [user,] = useContext(Context);
    const [outline, setOutline] = useState({
        "title": '',
        "years": '',
        "course": '',
        "rule": ''
    });
    const [outlineError, setOutlineError] = useState({
        "title": '',
        "years": '',
        "course": '',
        "rule": ''
    });
    const [courses, setCourses] = useState([]);
    const [years, setYears] = useState([]);
    const [showDropDown, setShowDropDown] = useState(null);

    const updateOutline = (field, value) => {
        setOutline(current => {
            return { ...current, [field]: value }
        })
        setOutlineError(current => {
            return { ...current, [field]: '' }
        })
    };

    useEffect(() => {
        const loadCourses = async () => {
            try {
                let res = await API.get(endpoints.courses);
                setCourses(res.data.results);
            } catch (ex) {
                console.error(ex);
            }
        }
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

        loadCourses();
        loadYears();
    }, []);

    const addOutline = async () => {
        try {
            let isEmpty = false;
            for (let key in outline) {
                if (isNullOrEmpty(outline[key])) {
                    isEmpty = true;
                    setOutlineError(current => {
                        return {
                            ...current, [key]:
                                stringValidator(outline[key], outlineTranslator(key))
                        }
                    })
                }
            }
            if (isEmpty)
                throw Error("Empty");

            const form = new FormData();
            for (let key in outline)
                if (key !== 'requirement')
                    form.append(key, outline[key]);
            form.append('instructor', user.id);
            console.log(form);

            let token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).post(endpoints["subject-outlines"],
                form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.info(res.data);

            Alert.alert("Thêm", "Thêm đề cương mới thành công");
            navigation.goBack();
        } catch (ex) {
            if (ex.message === "Empty") {
                Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            }
            else {
                Alert.alert("Lỗi", "Lỗi hệ thống! Không thể thêm đề cương mới.");
                console.log(ex);
            }
        }
    }

    navigation.setOptions({
        headerRight: () => doneButton(addOutline)
    });

    const updateDropDown = (field, value) => {
        setShowDropDown(current => ({ ...current, [field]: value }))
    };

    return (
        <View style={gStyles.container}>
            <ScrollView>
                <H1>BIÊN SOẠN ĐỀ CƯƠNG MỚI</H1>
                <TextInput
                    label="Nhập tên đề cương"
                    value={outline.title}
                    onChangeText={t => updateOutline("title", t)}
                    error={isNullOrEmpty(outline.title)}
                    errorText={outlineError.title} />
                <Dropdown
                    label="Niên khóa"
                    mode='outlined'
                    visible={showDropDown?.year}
                    showDropDown={() => updateDropDown('year', true)}
                    onDismiss={() => updateDropDown('year', false)}
                    value={outline.years?.toString()}
                    setValue={v => updateOutline("years", Number(v))}
                    list={years} />
                <View style={[gStyles.row]}>
                    {/* <View style={{ width: '85%' }}> */}
                    <Dropdown
                        label='Môn học'
                        mode='outlined'
                        visible={showDropDown?.course}
                        showDropDown={() => updateDropDown('course', true)}
                        onDismiss={() => updateDropDown('course', false)}
                        value={outline.course?.toString()}
                        setValue={v => updateOutline("course", Number(v))}
                        list={courses ? courses.map(c => ({
                            label: `${c.name}`,
                            value: `${c.id}`
                        })) : []} />
                    {/* </View>
                <View style={{ width: '12%', marginStart: '3%', marginTop: 24 }}>
                    <CourseModal />
                </View> */}
                </View>
                <TextInput
                    label="Quy định môn học"
                    value={outline.rule}
                    onChangeText={t => updateOutline("rule", t)}
                    error={isNullOrEmpty(outline.rule)}
                    errorText={outlineError.rule}
                    multiline />
            </ScrollView>
        </View>
    )
}

export default memo(Compiler);