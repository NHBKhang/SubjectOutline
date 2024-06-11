import { Alert, View } from "react-native";
import { gStyles } from "../../core/global";
import { memo, useEffect, useState } from "react";
import { ActivityIndicator, Divider, Dropdown, H1, H2, TextInput, backButton, doneButton } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/API";
import { Text } from "react-native-paper";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/AntDesign';
import { dropdownValue, firstRowSplit } from "../../core/utils";

const OutcomeDetails = ({ route, navigation }) => {
    const { outlineId } = route.params;
    const [scheduleWeeks, setScheduleWeeks] = useState(null);
    const [callback, setCallback] = useState(false);

    useEffect(() => {
        const loadScheduleWeeks = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(
                    `${endpoints["schedule-weeks"]}?outlineId=${outlineId}`);
                setScheduleWeeks(res.data);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được kế hoạch giảng dạy");
                navigation.goBack();
            }
        }

        loadScheduleWeeks();
        setCallback(false);
    }, [outlineId, callback]);

    return (
        <View style={gStyles.container}>
            <H1>Kế hoạch giảng dạy</H1>
            {scheduleWeeks === null ? <ActivityIndicator /> : <View>
                {scheduleWeeks.map((w, index) => <View key={index}>
                    <Schedule
                        instance={w}
                        navigation={navigation}
                        callback={() => setCallback(!callback)} />
                </View>)}
                <View key={0}>
                    <Schedule
                        instance={{ outline: outlineId }}
                        navigation={navigation}
                        callback={() => setCallback(!callback)} />
                </View>
            </View>}
        </View>
    )
}

const Schedule = ({ instance, navigation, callback, state }) => {
    const [schedule, setSchedule] = useState(instance);
    const updateSchedule = (field, value) => {
        setSchedule(current => ({ ...current, [field]: value }))
    };

    const deleteSchedule = async () => {
        if (schedule.id) {
            try {

            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Xóa thất bại");
            }
        } else {
            updateSchedule('week', null);
        }
    }

    return (
        <>{schedule.week ?
            <View style={[gStyles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                <View style={{ width: '90%' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("ScheduleWeekCard", {
                        schedule: schedule,
                        callback: callback
                    })}>
                        <Divider color={'lightgray'} />
                        <View style={[gStyles.row, { justifyContent: 'space-between' }]}>
                            <H2>{`Tuần ${schedule.week}: ` + firstRowSplit(schedule.content)}</H2>
                        </View>
                        <Divider color={'lightgray'} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ marginStart: 10 }} onPress={deleteSchedule}>
                    <Icon name="closecircle" size={25} color={'red'} />
                </TouchableOpacity>
            </View> : <View style={{ width: '90%' }}>
                <Divider color={'lightgray'} />
                <TouchableOpacity style={{ marginStart: 10 }} onPress={() =>
                    updateSchedule('week', 'mới')
                }>
                    <Icon name="pluscircle" size={25} color={'blue'} />
                </TouchableOpacity>
                <Divider color={'lightgray'} />
            </View >}
        </>
    )
}

export const ScheduleCard = ({ route, navigation }) => {
    const { callback } = route.params;
    const [schedule, setSchedule] = useState(route.params?.schedule ?? null);
    const [outcomes, setOutcomes] = useState(null);
    const [evaluations, setEvaluations] = useState(null);
    const [materials, setMaterials] = useState(null);
    const [showDropDown, setShowDropDown] = useState(null);
    const updateSchedule = (field, value) => {
        setSchedule(current => ({ ...current, [field]: value }))
    };
    const updateDropDown = (field, value) => {
        setShowDropDown(current => ({ ...current, [field]: value }))
    };

    const patchSchedule = async () => {
        try {
            let token = await AsyncStorage.getItem("access-token"), res = null;
            if (schedule.id) {
                res = await authApi(token).patch(endpoints["schedule-week"](schedule.id),
                    schedule, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } else {
                res = await authApi(token).post(endpoints["schedule-weeks"],
                    schedule, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            setSchedule(res.data);
            callback();
            Alert.alert("Done", "Cập nhật thành công!");
        } catch (ex) {
            Alert.alert("Error", "Lỗi hệ thống!");
            console.error(ex);
        }
    };

    navigation.setOptions({
        headerRight: () => doneButton(() => patchSchedule()),
        headerLeft: backButton
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token"),
                    outline = schedule.outline;

                let o = await authApi(token).get(
                    `${endpoints["learning-outcomes"]}?outlineId=${outline}`);
                setOutcomes(o.data);

                let e = await authApi(token).get(
                    `${endpoints.evaluations}?outlineId=${outline}`);
                setEvaluations(e.data);

                let m = await authApi(token).get(
                    `${endpoints.materials}?outlineId=${outline}`);
                setMaterials(m.data);
                console.log(schedule.outcomes);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được kế hoạch giảng dạy");
                navigation.goBack();
            }
        }

        loadData();
    }, []);

    return (
        <View style={gStyles.container}>
            <ScrollView style={gStyles.w100}>
                <Text>Mã kế hoạch: {schedule?.id}</Text>
                <TextInput
                    label="Tuần"
                    value={schedule.week?.toString()}
                    onChangeText={t => updateSchedule('week', t)}
                    returnKeyType="next" />
                <TextInput
                    label="Nội dung"
                    value={schedule.content}
                    onChangeText={t => updateSchedule('content', t)}
                    returnKeyType="done"
                    multiline />
                <Dropdown
                    label='Chuẩn đầu ra'
                    mode='outlined'
                    visible={showDropDown?.outcomes}
                    showDropDown={() => updateDropDown('outcomes', true)}
                    onDismiss={() => updateDropDown('outcomes', false)}
                    value={schedule.outcomes?.toString()}
                    setValue={v => updateSchedule("outcomes", v)}
                    list={outcomes ? outcomes.map(c => ({
                        label: `${c.code}`,
                        value: `${c.id}`
                    })) : []}
                    multiSelect />
                <Dropdown
                    label='Đánh giá'
                    mode='outlined'
                    visible={showDropDown?.evaluations}
                    showDropDown={() => updateDropDown('evaluations', true)}
                    onDismiss={() => updateDropDown('evaluations', false)}
                    value={schedule.evaluations?.toString()}
                    setValue={v => updateSchedule("evaluations", v)}
                    list={evaluations ? evaluations.map(c => ({
                        label: `${c.method}`,
                        value: `${c.id}`
                    })) : []} />
                <Dropdown
                    label='Học liệu'
                    mode='outlined'
                    visible={showDropDown?.materials}
                    showDropDown={() => updateDropDown('materials', true)}
                    onDismiss={() => updateDropDown('materials', false)}
                    value={schedule.materials?.toString()}
                    setValue={v => updateSchedule("materials", dropdownValue(v))}
                    list={materials ? materials.map(c => ({
                        label: `[${c.no}] ${c.content}`,
                        value: `${c.id}`
                    })) : []}
                    multiSelect />
            </ScrollView>
        </View>
    )
}

export default memo(OutcomeDetails);