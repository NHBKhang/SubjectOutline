import { memo, useContext, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { gStyles } from "../../core/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API, { authApi, endpoints } from "../../configs/API";
import { doneButton, TextInput, H1, Dropdown } from "../../components";
import CourseModal from "../../components/modals/CourseModal";
import { isNullOrEmpty, outlineTranslator, stringValidator } from "../../core/utils";
import Context from "../../configs/Context";

const Compiler = ({ navigation }) => {
    const [user,] = useContext(Context);
    const [outline, setOutline] = useState({
        "title": '',
        "year": '',
        "course": '',
        "rule": ''
    });
    const [outlineError, setOutlineError] = useState({
        "title": '',
        "year": '',
        "course": '',
        "rule": ''
    });
    const [courses, setCourses] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);

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
                setCourses([]);
                console.error(ex);
            }
        }

        loadCourses();
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

            outline['instructor'] = user.id;

            let token = await AsyncStorage.getItem("access-token");
            await authApi(token).post(
                `${endpoints["subject-outlines"]}`,
                outline, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            await Alert.alert("Thêm", "Thêm đề cương mới thành công");
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

    return (
        <View style={gStyles.container}>
            <H1>BIÊN SOẠN ĐỀ CƯƠNG MỚI</H1>
            <TextInput
                label="Nhập tên đề cương"
                value={outline.title}
                onChangeText={t => updateOutline("title", t)}
                error={isNullOrEmpty(outline.title)}
                errorText={outlineError.title} />
            <TextInput
                label="Niên khóa"
                value={outline.year}
                onChangeText={t => updateOutline("year", t)}
                keyboardType="numeric"
                maxLength={4}
                error={isNullOrEmpty(outline.year)}
                errorText={outlineError.year} />
            <View style={[gStyles.row]}>
                {/* <View style={{ width: '85%' }}> */}
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
                </View> */}
            </View>
            <TextInput
                label="Quy định môn học"
                value={outline.rule}
                onChangeText={t => updateOutline("rule", t)}
                error={isNullOrEmpty(outline.rule)}
                errorText={outlineError.rule} />
        </View>
    )
}

export default memo(Compiler);