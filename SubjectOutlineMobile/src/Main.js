import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/FontAwesome';
import { memo, useContext } from "react";
import {
    HomeStack,
    MessageStack,
    WorkStack,
    SettingsStack,
    ProfileStack
} from "./Stack";
import Context from "./configs/Context";

const Tab = createBottomTabNavigator();

const Main = () => {
    const [user, ] = useContext(Context);
    
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

            <Tab.Screen name="ProfileStack" component={ProfileStack}
                options={{
                    title: 'Hồ sơ',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) =>
                        <Icon name="user" color={color} size={size} />
                }} />

            {/* <Tab.Screen name="SettingsStack" component={SettingsStack}
                options={{
                    title: 'Cài đặt',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="gear"
                            color={color} size={size} />
                    ),
                }} /> */}
        </Tab.Navigator>
    )
}

export default memo(Main);