import { Alert, ScrollView, StyleSheet, View } from "react-native"
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

const EvaluationDetails = ({ navigation, route }) => {
    const outlineId = route.params?.outlineId;
    const [evaluations, setEvaluations] = useState([]);
    const [callback, setCallback] = useState(false);

    useEffect(() => {
        const loadEvaluations = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(
                    `${endpoints.evaluations}?outlineId=${outlineId}`);
                setEvaluations(res.data);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được đánh giá môn học");
                navigation.goBack();
            }
        };

        loadEvaluations();
        setCallback(false);
    }, [outlineId, callback]);

    return (
        <View style={gStyles.container}>
            <ScrollView style={gStyles.w100}>
                <H1>Đánh giá môn học</H1>
                {evaluations === null ?
                    <View style={[gStyles.container, { justifyContent: 'center' }]}>
                        <ActivityIndicator />
                    </View> : <>
                        {evaluations.map((e) => (
                            <Evaluation
                                evaluation={e}
                                navigation={navigation}
                                callback={setCallback} />
                            // <EvaluationCard
                            //     evaluation={e} index={index}
                            //     callback={updateEvaluation}
                            //     learningOutcomes={learningOutcomes} />
                        ))}
                    </>}
            </ScrollView>
        </View>
    )
}

const Evaluation = ({ evaluation, callback, navigation }) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate("EvaluationCard", {
            evaluation: evaluation,
            callback: callback
        })}>
            <View>
                <Divider color={'lightgray'} />
                <View style={[gStyles.row, gStyles.w100, {justifyContent: 'space-between'}]}>
                    <H2>{evaluation.id}. {evaluation.method}</H2>
                    <H2>{evaluation.weight}</H2>
                </View>
                <Divider color={'lightgray'} />
            </View>
        </TouchableOpacity>
    )
}

export const EvaluationCard = ({ route, navigation }) => {
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
        headerLeft: () => backButton(() => route.params?.callback(true))
    });

    useEffect(() => {
        const loadLearningOutcomes = async () => {
            try {
                let res = await API.get(
                    `${endpoints["learning-outcomes"]}?outlineId=${evaluation.outline}`);
                setLearningOutcomes(res.data);
            } catch (ex) {
                console.error(ex);
            }
        }
        loadLearningOutcomes();
    }, [evaluation]);

    const patchEvaluation = async () => {
        try {
            console.log(evaluation)
            let token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).patch(endpoints.evaluation(evaluation.id),
                evaluation, {
                    headers: {
                        "Content-Type": "application/json"
                    }
            });
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
        <View style={gStyles.container} key={evaluation?.id}>
            <Text>Mã đánh giá: {evaluation?.id}</Text>
            <Dropdown
                label="Thành phần đánh giá"
                mode="outlined"
                visible={showDropDown?.type}
                onDismiss={() => updateDropDown('type', false)}
                showDropDown={() => updateDropDown('type', true)}
                value={evaluation?.type.toString()}
                setValue={v => updateEvaluation('type', v)}
                list={evaluationType} />
            <TextInput
                label="Bài đánh giá"
                value={evaluation?.method}
                onChangeText={t => updateEvaluation('method', t)}
                returnKeyType="next" />
            <TextInput
                label="Thời điểm"
                value={evaluation?.time}
                onChangeText={t => updateEvaluation('time', toServerDate(t))}
                returnKeyType="next"
                type="date" />
            <Dropdown
                label="CĐR môn học"
                mode="outlined"
                visible={showDropDown?.clo}
                onDismiss={() => updateDropDown('clo', false)}
                showDropDown={() => updateDropDown('clo', true)}
                value={evaluation?.learning_outcomes.toString()}
                setValue={v => updateEvaluation('learning_outcomes', dropdownValue(v))}
                list={learningOutcomes.map(l => ({
                    value: String(l.id),
                    label: l.code
                }))}
                multiSelect />
            <TextInput
                label="Tỉ lệ"
                returnKeyType="done"
                onChangeText={t => updateEvaluation('weight', t)}
                value={evaluation?.weight.toString()}
                keyboardType="numeric" />
        </View>
    )
}

const styles = StyleSheet.create({

});

export default memo(EvaluationDetails);