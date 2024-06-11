import { memo, useEffect, useState } from "react"
import { Alert, View } from "react-native";
import { authApi, endpoints } from "../../configs/API";
import { gStyles } from "../../core/global";
import { doneButton, H1, ActivityIndicator, Dropdown } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dropdownValue } from "../../core/utils";

const RequirementDetails = ({ navigation, route }) => {
    const { requirementId, outlineId, courses } = route.params;
    const [showDropDown, setShowDropDown] = useState(false);
    const [requirement, setRequirement] = useState(null);

    const updateDropDown = (field, value) => {
        setShowDropDown(current => {
            return { ...current, [field]: value }
        })
    };
    const updateRequirement = (field, value) => {
        setRequirement(current => {
            return { ...current, [field]: value }
        })
    };

    useEffect(() => {
        const loadRequirement = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token"), res = null;
                if (requirementId)
                    res = await authApi(token).get(endpoints.requirement(requirementId));
                else
                    res = await authApi(token).post(endpoints.requirements,
                        { outline: outlineId }, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                setRequirement(res.data);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được môn học điều kiện");
                navigation.goBack();
            }
        }
        loadRequirement();
    }, [requirementId, outlineId]);

    navigation.setOptions({
        headerRight: () => doneButton(() => patchRequirement())
    });

    const patchRequirement = async () => {
        try {
            console.info(requirement)
            const token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).patch(endpoints.requirement(requirementId),
                requirement, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setRequirement(res.data);
            Alert.alert("Done", "Cập nhật môn học điều kiện thành công!");
        } catch (ex) {
            console.error(ex);
            Alert.alert("Error", "Không thể cập nhật môn học điều kiện!");
        }
    }

    return (
        <View style={gStyles.container}>
            <H1>Môn học điều kiện</H1>
            {requirement === null ?
                <View style={[gStyles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator />
                </View> : <>
                    <Dropdown
                        label="Môn tiên quyết"
                        mode='outlined'
                        visible={showDropDown?.prerequisites}
                        showDropDown={() => updateDropDown('prerequisites', true)}
                        onDismiss={() => updateDropDown('prerequisites', false)}
                        value={requirement?.prerequisites.toString()}
                        setValue={v => updateRequirement('prerequisites', dropdownValue(v))}
                        list={courses}
                        multiSelect />
                    <Dropdown
                        label="Môn học trước"
                        mode='outlined'
                        visible={showDropDown?.preceding_courses}
                        showDropDown={() => updateDropDown('preceding_courses', true)}
                        onDismiss={() => updateDropDown('preceding_courses', false)}
                        value={requirement?.preceding_courses.toString()}
                        list={courses}
                        setValue={v => updateRequirement('preceding_courses', dropdownValue(v))}
                        multiSelect />
                    <Dropdown
                        label="Môn song hành"
                        mode='outlined'
                        visible={showDropDown?.co_courses}
                        showDropDown={() => updateDropDown('co_courses', true)}
                        onDismiss={() => updateDropDown('co_courses', false)}
                        value={requirement?.co_courses.toString()}
                        list={courses}
                        setValue={v => updateRequirement('co_courses', dropdownValue(v))}
                        multiSelect />
                </>}
        </View>
    )
}

export default memo(RequirementDetails);