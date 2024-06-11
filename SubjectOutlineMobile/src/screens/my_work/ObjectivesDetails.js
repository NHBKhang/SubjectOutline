import { Alert, View } from "react-native";
import { gStyles } from "../../core/global";
import { memo, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Divider,
    H1, H2,
    TextInput,
    backButton, doneButton
} from "../../components";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import { Text } from "react-native-paper";

const ObjectiveDetails = ({ route, navigation }) => {
    const { outlineId } = route.params;
    const [objectives, setObjectives] = useState(null);
    const [callback, setCallback] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const loadObjectives = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(
                    `${endpoints.objectives}?outlineId=${outlineId}`);
                setObjectives(res.data);
                setCount(res.data.length);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được mục tiêu môn học");
                navigation.goBack();
            }
        }

        loadObjectives();
        setCallback(false);
    }, [outlineId, callback]);

    return (
        <View style={gStyles.container}>
            <H1>Mục tiêu môn học</H1>
            {objectives === null ? <ActivityIndicator /> : <View>
                {objectives.map((o, index) => (
                    <View key={index}>
                        <Objective
                            instance={o}
                            navigation={navigation}
                            state={{ count, setCount }}
                            callback={() => setCallback(!callback)} />
                    </View>))}
                <View key={0}>
                    <Objective
                        instance={{ outline: outlineId }}
                        navigation={navigation}
                        state={{ count, setCount }}
                        callback={() => setCallback(!callback)} />
                </View>
            </View>}
        </View>
    )
}

const Objective = ({ instance, navigation, callback, state }) => {
    const [objective, setObjective] = useState(instance);
    const { count, setCount } = state;
    const updateObjective = (field, value) => {
        setObjective(current => ({ ...current, [field]: value }))
    };

    const deleteObjective = async () => {
        if (objective.id) {
            try {

            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Xóa thất bại");
            }
        } else {
            updateObjective('code', null);
        }
        setCount(count - 1);
    }

    return (
        <>{objective.code ?
            <View style={[gStyles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                <View style={{ width: '90%' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("ObjectiveCard", {
                        objective: objective,
                        callback: callback
                    })}>
                        <Divider color={'lightgray'} />
                        <View style={[gStyles.row, { justifyContent: 'space-between' }]}>
                            <H2>{objective.id ? `${objective.id}. ` : null}
                                {objective.code}</H2>
                        </View>
                        <Divider color={'lightgray'} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ marginStart: 10 }} onPress={deleteObjective}>
                    <Icon name="closecircle" size={25} color={'red'} />
                </TouchableOpacity>
            </View> : <View style={{ width: '90%' }}>
                <Divider color={'lightgray'} />
                <TouchableOpacity style={{ marginStart: 10 }} onPress={() => {
                    let num = count + 1;
                    setCount(num);
                    updateObjective('code', `CO${num}`);
                }}>
                    <Icon name="pluscircle" size={25} color={'blue'} />
                </TouchableOpacity>
                <Divider color={'lightgray'} />
            </View>}
        </>
    )
}

export const ObjectiveCard = ({ route, navigation }) => {
    const { callback } = route.params;
    const [objective, setObjective] = useState(route.params?.objective ?? null);
    const updateObjective = (field, value) => {
        setObjective(current => ({ ...current, [field]: value }))
    };

    const patchObjective = async () => {
        try {
            let token = await AsyncStorage.getItem("access-token"), res = null;
            if (objective.id) {
                res = await authApi(token).patch(endpoints.objective(objective.id),
                    objective, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } else {
                res = await authApi(token).post(endpoints.objectives,
                    objective, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            setObjective(res.data);
            callback();
            Alert.alert("Done", "Cập nhật thành công!");
        } catch (ex) {
            Alert.alert("Error", "Lỗi hệ thống!");
            console.error(ex);
        }
    };

    navigation.setOptions({
        headerRight: () => doneButton(() => patchObjective()),
        headerLeft: backButton
    });

    return (
        <View style={gStyles.container}>
            <ScrollView style={gStyles.w100}>
                <Text>Mã mục tiêu: {objective?.id}</Text>
                <TextInput
                    label="Mã mục tiêu môn học"
                    value={objective.code}
                    onChangeText={t => updateObjective('code', t)}
                    returnKeyType="next" />
                <TextInput
                    label="Mô tả"
                    value={objective.description}
                    onChangeText={t => updateObjective('description', t)}
                    returnKeyType="next"
                    multiline />
                <TextInput
                    label="Chuẩn đầu ra"
                    value={objective.outcome}
                    onChangeText={t => updateObjective('outcome', t)}
                    returnKeyType="done"
                    multiline />
            </ScrollView>
        </View>
    )
}

export default memo(ObjectiveDetails);