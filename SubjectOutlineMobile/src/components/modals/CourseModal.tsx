import { memo, useEffect, useState } from "react"
import { Alert, Button, Modal, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { gStyles } from "../../core/global";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import { H2 } from "../Header";
import TextInput from "../TextInput";
import ImagePicker from "../ImagePicker";
import Dropdown from "../Dropdown";
import { ActivityIndicator } from "react-native-paper";
import API, { endpoints } from "../../configs/API";
import { types } from "../../core/data";

const CourseModel = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [dropDown, setDropDown] = useState({
        "credit": false,
        "faculty": false,
        "type": false
    });
    const updateDropDown = (key, value) => {
        setDropDown(current => {
            return { ...current, [key]: value }
        })
    };
    const [loading, setLoading] = useState(false);
    const [creditHours, setCreditHours] = useState([]);
    const [faculties, setFaculties] = useState([])
    const [course, setCourse] = useState({
        "name": "",
        "en_name": "",
        "code": "",
        "description": "",
        "credit_hour": 0,
        "faculty": 0,
        "type": 0,
        "image": {
            "uri": null,
            "name": null,
            "type": null
        }
    });
    const updateCourse = (key, value) => {
        setCourse(current => {
            return { ...current, [key]: value }
        })
    };

    const addCourse = async () => {
        setLoading(true)
        try {
            console.log(course);
            Alert.alert("Thành công", "Thêm môn học mới thành công");
            // setModalVisible(false);
        } catch (ex) {
            Alert.alert("Lỗi", "Thêm môn học mới thất bại");
            console.log(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadCreditHours = async () => {
            try {
                let res = await API.get(endpoints["credit-hours"]);
                await setCreditHours(res.data);
            } catch (ex) {
                console.log(ex);
            }
        }
        const loadFaculties = async () => {
            try {
                let res = await API.get(endpoints.faculties);
                setFaculties(res.data);
            } catch (ex) {
                console.log(ex);
            }
        }

        loadCreditHours();
        loadFaculties();
        console.log(course)
    }, []);

    return (
        <SafeAreaView>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => setModalVisible(true)}>
                <Icon name="plus" size={20} />
            </TouchableOpacity>
            <Modal
                style={{ width: '100%' }}
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={styles.container}>
                    <View style={[gStyles.w100, { backgroundColor: 'white', padding: 20 }]}>
                        <View style={{ alignItems: 'center' }}>
                            <H2 style={{ marginBottom: 10, fontSize: 24 }}>Thêm môn học mới</H2>
                        </View>
                        <ScrollView style={gStyles.scroll}>
                            <View style={{ alignItems: 'center' }}>
                                <TextInput
                                    label="Tên (Tiếng Việt)"
                                    value={course.name}
                                    onChangeText={t => updateCourse("name", t)} />
                                <TextInput
                                    label="Tên (Tiếng Anh)"
                                    value={course.en_name}
                                    onChangeText={t => updateCourse("en_name", t)} />
                                <TextInput
                                    label="Mã môn"
                                    value={course.code}
                                    onChangeText={t => updateCourse("code", t)} />
                                <TextInput
                                    label="Mô tả"
                                    multiline={true}
                                    numberOfLines={5}
                                    value={course.description}
                                    onChangeText={t => updateCourse("description", t)} />
                                <Dropdown
                                    label='Số tín chỉ'
                                    mode='outlined'
                                    visible={dropDown.credit}
                                    showDropDown={() => updateDropDown("credit", true)}
                                    onDismiss={() => updateDropDown("credit", false)}
                                    value={course.credit_hour.toString()}
                                    setValue={v => updateCourse("credit_hour", Number(v))}
                                    list={creditHours.map(c => ({
                                        label: `${c.total}`,
                                        value: `${c.id}`
                                    }))} />
                                <Dropdown
                                    label='Khoa'
                                    mode='outlined'
                                    visible={dropDown.faculty}
                                    showDropDown={() => updateDropDown("faculty", true)}
                                    onDismiss={() => updateDropDown("faculty", false)}
                                    value={course.faculty.toString()}
                                    setValue={v => updateCourse("faculty", Number(v))}
                                    list={faculties.map(c => ({
                                        label: `${c.name}`,
                                        value: `${c.id}`
                                    }))} />
                                <Dropdown
                                    label='Loa'
                                    mode='outlined'
                                    visible={dropDown.type}
                                    showDropDown={() => updateDropDown("type", true)}
                                    onDismiss={() => updateDropDown("type", false)}
                                    value={course.type.toString()}
                                    setValue={v => updateCourse("type", Number(v))}
                                    list={types.map(c => ({
                                        label: `${c.name}`,
                                        value: `${c.id}`
                                    }))} />
                                <ImagePicker

                                    label='Chọn ảnh ...'
                                    errorText=""
                                    value={course.image}
                                    onValueChange={v => { }} />
                            </View>
                        </ScrollView>

                        <View style={[gStyles.row, { justifyContent: 'center', marginBottom: 25 }]}>
                            <View style={styles.bottomBtn}>
                                {loading ? <ActivityIndicator /> :
                                    <Button title="Thêm" onPress={addCourse} />}
                            </View>
                            <View style={styles.bottomBtn}>
                                <Button title="Đóng" onPress={() => setModalVisible(false)} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 25
    },
    btn: {
        borderColor: 'gray',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        borderRadius: 2
    },
    bottomBtn: {
        marginHorizontal: 10,
    }
});

export default memo(CourseModel);