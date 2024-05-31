import { Alert, ScrollView, View } from "react-native"
import { gStyles } from "../../core/global"
import { memo, useEffect, useState } from "react"
import { H1, H2 } from "../../components/Header";
import { ActivityIndicator, Text } from "react-native-paper";
import API, { authApi, endpoints } from "../../configs/API";
import TextInput from "../../components/TextInput";
import Dropdown from "../../components/Dropdown";
import { evaluationType } from "../../core/data";
import Divider from "../../components/Divider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { backButton, doneButton } from "../../components/HeaderButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dropdownValue, toServerDate } from "../../core/utils";
import Icon from 'react-native-vector-icons/AntDesign';

const EvaluationDetails = ({ navigation, route }) => {
    const outlineId = route.params?.outlineId;
    const [evaluations, setEvaluations] = useState([]);
    const [callback, setCallback] = useState(false);
    const [totalWeight, setTotalWeight] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const loadEvaluations = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(
                    `${endpoints.evaluations}?outlineId=${outlineId}`);
                let data = res.data;
                setEvaluations(data);
                setTotalWeight(data.reduce((accumulator, current) => {
                    return accumulator + current.weight;
                }, 0));
                setCount(data.length);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được đánh giá môn học");
                navigation.goBack();
            }
        }

        loadEvaluations();
        setCallback(false);
    }, [outlineId, callback]);

    navigation.setOptions({
        headerLeft: () => backButton(() => {
            if (totalWeight != 1) {
                Alert.alert("CC");
            }
        })
    });

    const weightStyle = totalWeight == 1 ? gStyles.textPrimary : gStyles.textError;

    return (
        <View style={gStyles.container}>
            <ScrollView style={gStyles.w100}>
                <H1>Đánh giá môn học</H1>
                {evaluations === null ?
                    <View style={[gStyles.container, { justifyContent: 'center' }]}>
                        <ActivityIndicator />
                    </View> : <>
                        {evaluations.map((e, index) => (
                            <View key={index}>
                                <Evaluation
                                    instance={e}
                                    navigation={navigation}
                                    callback={() => setCallback(true)} />
                            </View>
                        ))}
                        <Evaluation
                            instance={{ outline: outlineId }}
                            navigation={navigation}
                            callback={() => setCallback(true)} />
                        <View style={{ width: '90%' }}>
                            <Divider color={'lightgray'} />
                            <View style={[gStyles.row, { justifyContent: 'space-between' }]}>
                                <H2 style={weightStyle}>Tổng tỉ lệ:</H2>
                                <H2 style={weightStyle}>{totalWeight}</H2>
                            </View>
                            <Divider color={'lightgray'} />
                        </View>
                    </>}
            </ScrollView>
        </View>
    )
}

const Evaluation = ({ instance, callback, navigation }) => {
    const [evaluation, setEvaluation] = useState(instance);
    const updateEvaluation = (field, value) => {
        setEvaluation(current => ({ ...current, [field]: value }))
    }

    const deleteEvaluation = async () => {
        if (evaluation.id) {
            try {
                let token = await AsyncStorage.getItem("access-token");
                // await authApi(token).delete(endpoints.evaluation(evaluation));
                Alert.alert("Done", "Xóa thành công");
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Xóa thất bại");
            }
        } else {
            updateEvaluation('method', null);
        }
    }

    return (
        <>
            {evaluation.method ?
                <View style={[gStyles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={{ width: '90%' }}>
                        <TouchableOpacity onPress={() => navigation.navigate("EvaluationCard", {
                            evaluation: evaluation,
                            callback: callback
                        })}>
                            <Divider color={'lightgray'} />
                            <View style={[gStyles.row, { justifyContent: 'space-between' }]}>
                                <H2>{evaluation.id ? `${evaluation.id}. ` : null}
                                    {evaluation.method}</H2>
                                <H2>{evaluation.weight}</H2>
                            </View>
                            <Divider color={'lightgray'} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ marginStart: 10 }} onPress={deleteEvaluation}>
                        <Icon name="closecircle" size={25} color={'red'} />
                    </TouchableOpacity>
                </View> : <View style={{ width: '90%' }}>
                    <Divider color={'lightgray'} />
                    <TouchableOpacity style={{ marginStart: 10 }} onPress={() =>
                        updateEvaluation('method', 'Đánh giá mới')
                    }>
                        <Icon name="pluscircle" size={25} color={'blue'} />
                    </TouchableOpacity>
                    <Divider color={'lightgray'} />
                </View>}
        </>
    )
}

export const EvaluationCard = ({ route, navigation }) => {
    const { callback } = route.params;
    const [showDropDown, setShowDropDown] = useState(false);
    const [evaluation, setEvaluation] = useState(route.params?.evaluation ?? null);
    const [learningOutcomes, setLearningOutcomes] = useState([]);

    const updateDropDown = (field, value) => {
        setShowDropDown(current => {
            return { ...current, [field]: value }
        })
    };

    navigation.setOptions({
        headerRight: () => doneButton(() => patchEvaluation()),
        headerLeft: () => backButton(callback)
    });

    useEffect(() => {
        const loadLearningOutcomes = async () => {
            try {
                let res = await API.get(
                    `${endpoints["learning-outcomes"]}?outlineId=${evaluation.outline}`);
                setLearningOutcomes(res.data);
                console.log(res.data);
            } catch (ex) {
                console.error(ex);
            }
        }
        loadLearningOutcomes();
    }, [evaluation]);

    const patchEvaluation = async () => {
        try {
            let token = await AsyncStorage.getItem("access-token"), res = null;
            if (evaluation.id) {
                res = await authApi(token).patch(endpoints.evaluation(evaluation.id),
                    evaluation, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } else {
                res = await authApi(token).post(endpoints.evaluations, evaluation, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            setEvaluation(res.data);
            Alert.alert("Done", "Cập nhật thành công!");
        } catch (ex) {
            Alert.alert("Error", "Lỗi hệ thống!");
            console.error(ex);
        }
    };

    const updateEvaluation = (field, value) => {
        setEvaluation(current => {
            return { ...current, [field]: value }
        })
    };

    return (
        <View style={gStyles.container}>
            <Text>Mã đánh giá: {evaluation?.id}</Text>
            <Dropdown
                label="Thành phần đánh giá"
                mode="outlined"
                visible={showDropDown?.type}
                onDismiss={() => updateDropDown('type', false)}
                showDropDown={() => updateDropDown('type', true)}
                value={evaluation.type?.toString()}
                setValue={v => updateEvaluation('type', v)}
                list={evaluationType} />
            <TextInput
                label="Bài đánh giá"
                value={evaluation.method}
                onChangeText={t => updateEvaluation('method', t)}
                returnKeyType="next" />
            <TextInput
                label="Thời điểm"
                value={evaluation.time}
                onChangeText={t => updateEvaluation('time', toServerDate(t))}
                returnKeyType="next"
                type="date" />
            <Dropdown
                label="CĐR môn học"
                mode="outlined"
                visible={showDropDown?.clo}
                onDismiss={() => updateDropDown('clo', false)}
                showDropDown={() => updateDropDown('clo', true)}
                value={evaluation.learning_outcomes ? evaluation.learning_outcomes.toString() : ''}
                setValue={v => updateEvaluation('learning_outcomes', dropdownValue(v))}
                list={learningOutcomes?.map(l => ({
                    value: `${l.id}`,
                    label: l.code
                }))}
                multiSelect />
            <TextInput
                label="Tỉ lệ"
                returnKeyType="done"
                onChangeText={t => updateEvaluation('weight', t)}
                value={evaluation.weight?.toString()}
                keyboardType="numeric" />
        </View>
    )
}

export default memo(EvaluationDetails);