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
import { Text } from "react-native-paper";

const OutcomeDetails = ({ route, navigation }) => {
    const { outlineId } = route.params;
    const [outcomes, setOutcomes] = useState(null);
    const [callback, setCallback] = useState(false);

    useEffect(() => {
        const loadOutcomes = async () => {
            try {
                let token = await AsyncStorage.getItem('access-token');
                let res = await authApi(token).get(
                    `${endpoints["learning-outcomes"]}?outlineId=${outlineId}`);
                setOutcomes(res.data.sort((a, b) => {
                    if (a.code < b.code) {
                        return -1;
                    }
                    if (a.code > b.code) {
                        return 1;
                    }
                    return 0;
                }));
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được mục tiêu môn học");
                navigation.goBack();
            }
        }

        loadOutcomes();
    }, [outlineId, callback]);

    return (
        <View style={gStyles.container}>
            <ScrollView style={gStyles.w100}>
                <H1>Chuẩn đầu ra môn học</H1>
                {outcomes === null ? <ActivityIndicator /> : <View>
                    {outcomes.map((o, index) => <View key={index}>
                        <Outcome
                            instance={o}
                            navigation={navigation}
                            callback={() => setCallback(!callback)} />
                    </View>)}
                    <View key={0}>
                        <Outcome
                            instance={{ objective: { outline: outlineId } }}
                            navigation={navigation}
                            callback={() => setCallback(!callback)} />
                    </View>
                </View>}
            </ScrollView>
        </View>
    )
}

const Outcome = ({ instance, navigation, callback }) => {
    const [outcome, setOutcome] = useState(instance);
    const updateOutcome = (field, value) => {
        setOutcome(current => ({ ...current, [field]: value }))
    };

    const deleteOutcome = async () => {
        if (outcome.id) {
            try {
                let token = await AsyncStorage.getItem("access-token");
                await authApi(token).delete(endpoints["learning-outcome"](outcome.id));
                Alert.alert("Done", "Xóa thành công");
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Xóa thất bại");
            }
        } else {
            updateOutcome('code', null);
        }
    }

    return (
        <>{outcome.code ?
            <View style={[gStyles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                <View style={{ width: '90%' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("OutcomeCard", {
                        outcome: outcome,
                        callback: callback
                    })}>
                        <Divider color={'lightgray'} />
                        <View style={[gStyles.row, { justifyContent: 'space-between' }]}>
                            <H2>{outcome.id ? `${outcome.id}. ` : null}
                                {outcome.code}</H2>
                            <H2>{outcome.objective.code}</H2>
                        </View>
                        <Divider color={'lightgray'} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ marginStart: 10 }} onPress={deleteOutcome}>
                    <Icon name="closecircle" size={25} color={'red'} />
                </TouchableOpacity>
            </View> : <View style={{ width: '90%' }}>
                <Divider color={'lightgray'} />
                <TouchableOpacity style={{ marginStart: 10 }} onPress={() => {
                    updateOutcome('code', 'CLO');
                }}>
                    <Icon name="pluscircle" size={25} color={'blue'} />
                </TouchableOpacity>
                <Divider color={'lightgray'} />
            </View>}
        </>
    )
}

export const OutcomeCard = ({ route, navigation }) => {
    const { callback } = route.params;
    const [outcome, setOutcome] = useState(route.params?.outcome ?? null);
    const [objectives, setObjectives] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const updateOutcome = (field, value) => {
        setOutcome(current => ({ ...current, [field]: value }))
    };

    useEffect(() => {
        const loadObjectives = async () => {
            try {
                let token = await AsyncStorage.getItem('access-token');
                let res = await authApi(token).get(
                    `${endpoints.objectives}?outlineId=${outcome.objective.outline}`);
                setObjectives(res.data);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được mục tiêu môn học");
                navigation.goBack();
            }
        }

        loadObjectives();
    }, []);

    const patchOutcome = async () => {
        try {
            let token = await AsyncStorage.getItem("access-token"), res = null;
            const form = new FormData();
            for (let key in outcome) {
                if (key == 'objective')
                    form.append(key, outcome[key].id);
                else
                    form.append(key, outcome[key]);
            }

            if (outcome.id) {
                res = await authApi(token).patch(endpoints["learning-outcome"](outcome.id),
                    form, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            } else {
                res = await authApi(token).post(endpoints["learning-outcomes"],
                    form, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }
            setOutcome(res.data);
            callback();
            Alert.alert("Done", "Cập nhật thành công!");
        } catch (ex) {
            Alert.alert("Error", "Lỗi hệ thống!");
            console.error(ex);
        }
    };

    navigation.setOptions({
        headerRight: () => doneButton(() => patchOutcome()),
        headerLeft: backButton
    });

    return (
        <View style={gStyles.container}>
            <ScrollView style={gStyles.w100}>
                <Text>Mã chuẩn đầu ra: {outcome.id}</Text>
                <Dropdown
                    label="Mục tiêu"
                    mode="outlined"
                    visible={showDropDown}
                    onDismiss={() => setShowDropDown(false)}
                    showDropDown={() => setShowDropDown(true)}
                    value={outcome.objective?.id.toString()}
                    list={objectives ? objectives.map(o => ({
                        value: `${o.id}`,
                        label: o.code
                    })) : []} />
                <TextInput
                    label="Mã CLO"
                    value={outcome.code}
                    onChangeText={t => updateOutcome('code', t)}
                    returnKeyType="next" />
                <TextInput
                    label="Chi tiết"
                    value={outcome.description}
                    onChangeText={t => updateOutcome('description', t)}
                    returnKeyType="next"
                    multiline />
            </ScrollView>
        </View>
    )
}

export default memo(OutcomeDetails);