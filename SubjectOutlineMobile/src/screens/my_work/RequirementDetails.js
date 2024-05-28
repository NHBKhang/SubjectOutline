import { memo, useEffect, useState } from "react"
import { Alert, View } from "react-native";
import Dropdown from "../../components/Dropdown";
import API, { endpoints } from "../../configs/API";
import { gStyles } from "../../core/global";
import { ActivityIndicator } from "react-native-paper";
import { H1 } from "../../components/Header";

const RequirementDetails = ({ navigation, route }) => {
    const courses = route.params?.courses;
    const outlineId = route.params?.outlineId;
    const [showDropDown, setShowDropDown] = useState(false);
    const [requirement, setRequirement] = useState(null);

    const updateDropDown = (field, value) => {
        setShowDropDown(current => {
            return { ...current, [field]: value };
        })
    };

    useEffect(() => {
        const loadRequirement = async () => {
            try {
                // let res = await API.get(endpoints);

                // setRequirement(res.data);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được môn học điều kiện");
                navigation.goBack();
            }
        }
        loadRequirement();
    }, [outlineId]);

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
                        value={requirement ? requirement.prerequisites.map(String) : ''}
                        setValue={v => { }}
                        list={courses}
                        multiSelect />
                    <Dropdown
                        label="Môn học trước"
                        mode='outlined'
                        visible={showDropDown?.preceding_courses}
                        showDropDown={() => updateDropDown('preceding_courses', true)}
                        onDismiss={() => updateDropDown('preceding_courses', false)}
                        value={requirement ? requirement.preceding_courses.map(String) : ''}
                        list={courses}
                        setValue={v => { }}
                        multiSelect />
                    <Dropdown
                        label="Môn song hành"
                        mode='outlined'
                        visible={showDropDown?.co_courses}
                        showDropDown={() => updateDropDown('co_courses', true)}
                        onDismiss={() => updateDropDown('co_courses', false)}
                        value={requirement ? requirement.co_courses.map(String) : ''}
                        list={courses}
                        setValue={v => { }}
                        multiSelect />
                </>}
        </View>
    )
}

export default memo(RequirementDetails);