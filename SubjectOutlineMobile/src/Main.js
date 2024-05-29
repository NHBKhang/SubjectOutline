import Context from "./configs/Context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/FontAwesome';
import { memo, useContext, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { authApi, endpoints } from "./configs/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toMyDate, toServerDate } from "./core/utils";
import {
    HomeStack,
    MessageStack,
    WorkStack,
    SettingsStack,
    ProfileStack
} from "./Stack";
import { backButton, doneButton, editButton } from "./components/HeaderButton";

const Tab = createBottomTabNavigator();

const Main = () => {
    const [user, dispatch] = useContext(Context);
    const [tempUser, setTempUser] = useState(user);
    const [editMode, setEditMode] = useState(false);

    const updateUser = async () => {
        if (user === tempUser) {
            setEditMode(false);
            return;
        }

        const form = new FormData();
        for (let key in tempUser) {
            if (key === 'avatar') continue;
            else if (key === 'birthday') {
                const str = await toServerDate(tempUser[key]);
                form.append(key, str);
            }
            else if (key !== 'name' && key !== 'instructor')
                form.append(key, tempUser[key]);
        }

        try {
            let token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).patch(endpoints["current-user"],
                form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            res.data.birthday = toMyDate(res.data.birthday);
            dispatch({
                type: "login",
                payload: res.data
            });

            console.info(res.data);
            await Alert.alert("Updated", "Cập nhật thành công.");

            setEditMode(false);
        } catch (ex) {
            console.error(ex);
            Alert.alert("Failed", "Cập nhật thất bại.");
        }
    };

    return (
        <Tab.Navigator screenOptions={{
            title: "Tab",
            tabBarInactiveTintColor: "whitesmoke",
            tabBarActiveTintColor: 'yellowgreen',
            tabBarStyle: {
                backgroundColor: '#330093',
            },
        }}>
            <Tab.Screen name="HomeStack" component={HomeStack}
                options={{
                    title: 'Nhà',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home"
                            color={color} size={size} />)
                }} />

            {user && user.is_staff &&
                <Tab.Screen name="WorkStack" component={WorkStack}
                    options={{
                        title: 'Biên soạn',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="edit"
                                color={color} size={size} />)
                    }} />}

            <Tab.Screen name="MessageStack" component={MessageStack}
                options={{
                    title: 'Nhắn tin',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="comments"
                            color={color} size={size} />)
                }} />

            <Tab.Screen name="ProfileStack"
                options={{
                    title: 'Hồ sơ',
                    headerShown: false,
                    headerLeft: () => editMode ?
                        backButton(() => {
                            setEditMode(false);
                            setTempUser(user);
                        }, false) : null,
                    headerRight: () => editMode ?
                        doneButton(updateUser) :
                        editButton(() => setEditMode(true)),
                    tabBarIcon: ({ color, size }) =>
                        <Icon name="user" color={color} size={size} />
                }} >
                {props => <ProfileStack {...props}
                    editMode={editMode}
                    user={tempUser}
                    setUser={setTempUser} />}
            </Tab.Screen>

            <Tab.Screen name="SettingsStack" component={SettingsStack}
                options={{
                    title: 'Cài đặt',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="gear"
                            color={color} size={size} />
                    ),
                }} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    hBtn: {
        fontSize: 16,
        color: 'blue'
    }
});

export default memo(Main);