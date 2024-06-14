import { Alert, View } from "react-native";
import { gStyles } from "../../core/global";
import { memo, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Divider,
    Dropdown,
    H1, H2,
    TextInput,
    backButton, doneButton
} from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/AntDesign';
import { materialType } from "../../core/data";
import { Text } from "react-native-paper";

const OutcomeDetails = ({ route, navigation }) => {
    const { outlineId } = route.params;
    const [materials, setMaterials] = useState(null);
    const [callback, setCallback] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const loadMaterials = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(
                    `${endpoints.materials}?outlineId=${outlineId}`);
                setMaterials(res.data);
                setCount(res.data.length);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được");
                navigation.goBack();
            }
        }

        loadMaterials();
        setCallback(false);
    }, [outlineId, callback]);

    return (
        <View style={gStyles.container}>
            <ScrollView style={gStyles.w100}>
                <H1>Chuẩn đầu ra môn học</H1>
                {materials === null ? <ActivityIndicator /> : <View style={gStyles.w100}>
                    {materials.map((m, index) => <View key={index}>
                        <Material
                            instance={m}
                            navigation={navigation}
                            state={{ count, setCount }}
                            callback={() => setCallback(!callback)} />
                    </View>)}
                    <View key={0}>
                        <Material
                            instance={{ outline: outlineId }}
                            navigation={navigation}
                            state={{ count, setCount }}
                            callback={() => setCallback(!callback)} />
                    </View>
                </View>}
            </ScrollView>
        </View>
    )
}

const Material = ({ instance, state, callback, navigation }) => {
    const [material, setMaterial] = useState(instance);
    const { count, setCount } = state;
    const updateMaterial = (field, value) => {
        setMaterial(current => ({ ...current, [field]: value }))
    };

    const deleteMaterial = async () => {
        if (material.id) {
            try {

            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Xóa thất bại");
            }
        } else {
            updateMaterial('no', null);
            updateMaterial('content', null);
        }
        setCount(count - 1);
    }

    return (
        <>{material.no ?
            <View style={[gStyles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                <View style={{ width: '90%' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("MaterialCard", {
                        material: material,
                        callback: callback
                    })}>
                        <Divider color={'lightgray'} />
                        <View style={[gStyles.row, { justifyContent: 'space-between' }]}>
                            <H2>{material.no ? `${material.no}. ` : null}
                                {material.content}</H2>
                        </View>
                        <Divider color={'lightgray'} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ marginStart: 10 }} onPress={deleteMaterial}>
                    <Icon name="closecircle" size={25} color={'red'} />
                </TouchableOpacity>
            </View> : <View style={{ width: '90%' }}>
                <Divider color={'lightgray'} />
                <TouchableOpacity style={{ marginStart: 10 }} onPress={() => {
                    let num = count + 1;
                    setCount(num);
                    updateMaterial('no', `${num}`);
                    updateMaterial('content', 'Mới');
                }}>
                    <Icon name="pluscircle" size={25} color={'blue'} />
                </TouchableOpacity>
                <Divider color={'lightgray'} />
            </View>}
        </>
    )
}

export const MaterialCard = ({ route, navigation }) => {
    const { callback } = route.params;
    const [material, setMaterial] = useState(route.params?.material ?? null);
    const [showDropDown, setShowDropDown] = useState(false);
    const updateMaterial = (field, value) => {
        setMaterial(current => ({ ...current, [field]: value }))
    };

    const patchMaterial = async () => {
        try {
            let token = await AsyncStorage.getItem("access-token"), res = null;
            if (material.id) {
                res = await authApi(token).patch(endpoints.material(material.id),
                    material, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } else {
                res = await authApi(token).post(endpoints.materials,
                    material, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            setMaterial(res.data);
            callback();
            Alert.alert("Done", "Cập nhật thành công!");
        } catch (ex) {
            Alert.alert("Error", "Lỗi hệ thống!");
            console.error(ex);
        }
    };

    navigation.setOptions({
        headerRight: () => doneButton(() => patchMaterial()),
        headerLeft: backButton
    });

    return (
        <View style={gStyles.container}>
            <ScrollView style={gStyles.w100}>
                <Text>Mã: {material?.id}</Text>
                <TextInput
                    label="NO"
                    value={material.no?.toString()}
                    onChangeText={t => updateMaterial('no', t)}
                    returnKeyType="next" />
                <TextInput
                    label="Nội dung"
                    value={material.content}
                    onChangeText={t => updateMaterial('content', t)}
                    returnKeyType="done"
                    multiline />
                <Dropdown
                    label='Loại'
                    mode='outlined'
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => setShowDropDown(false)}
                    value={material.type?.toString()}
                    setValue={v => updateMaterial("type", v)}
                    list={materialType} />
            </ScrollView>
        </View>
    )
}

export default memo(OutcomeDetails);