import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { addButton, backButton } from './components/HeaderButton';
import {
    Login,
    Register,
    ForgotPassword
} from './screens/auth';
import {
    Home,
    Outline,
    OutlineDetails
} from './screens/home';
import {
    Message,
    MessageRoom
} from './screens/message';
import {
    Compiler,
    MyWork,
    MyWorkDetails
} from './screens/my_work';
import {
    Profile
} from './screens/profile';
import {
    Settings
} from './screens/settings';
import {
    Dashboard,
    AdditionalInfo,
    StudentInfo,
    InstructorInfo
} from './screens/intro';

const Stack = createStackNavigator();

export const HomeStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}
            options={{
                title: "Trang chủ",
                headerLeft: null,
            }} />
        <Stack.Screen name="Outline" component={Outline}
            options={{
                title: "Đề cương môn học",
                headerLeft: backButton
            }} />
        <Stack.Screen name="OutlineDetails" component={OutlineDetails}
            options={{
                title: "Chi tiết đề cương",
                headerLeft: backButton
            }} />
    </Stack.Navigator>
);

export const WorkStack = () => {
    const navigation = useNavigation();

    return (
        <Stack.Navigator>
            <Stack.Screen name="MyWork" component={MyWork}
                options={{
                    title: "Công việc của tôi",
                    headerLeft: null,
                    headerRight: () => addButton(() =>
                        navigation.navigate("OutlineCompiler"))
                }} />
            <Stack.Screen name="MyWorkDetails" component={MyWorkDetails}
                options={{
                    title: "Chi tiết",
                    headerLeft: backButton
                }} />
            <Stack.Screen name='OutlineCompiler' component={Compiler}
                options={{
                    title: "Biên soạn",
                    headerLeft: backButton
                }} />
        </Stack.Navigator>
    )
}

export const MessageStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Message" component={Message}
            options={{
                title: "Nhắn tin",
                headerLeft: null,
            }} />
        <Stack.Screen name="MessageRoom" component={MessageRoom}
            options={{
                title: "Tin nhắn",
                headerLeft: backButton
            }} />
    </Stack.Navigator>
)

export const ProfileStack = ({ editMode, user, setUser, ...props }) => (
    <Stack.Navigator>
        <Stack.Screen name="Profile"
            options={{
                title: "Hồ sơ",
            }}>
            <Profile {...props}
                editMode={editMode}
                user={tempUser}
                setUser={setTempUser} />
        </Stack.Screen>
    </Stack.Navigator>
)

export const SettingsStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Settings" component={Settings}
            options={{
                title: "Cài đặt",
                headerLeft: null,
            }} />
    </Stack.Navigator>
)

export const IntroStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={Dashboard}
            options={{
                headerMode: "none",
                headerLeft: null,
            }} />
        <Stack.Screen name="AdditionalInfo" component={AdditionalInfo}
            options={{
                headerMode: "none",
                headerLeft: null,
            }} />
        <Stack.Screen name="InstructorInfo" component={InstructorInfo}
            options={{
                headerMode: "none",
                headerLeft: null,
            }} />
        <Stack.Screen name="StudentInfo" component={StudentInfo}
            options={{
                headerMode: "none",
                headerLeft: null,
            }} />
    </Stack.Navigator>
)

export const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}
            options={{
                title: "Đăng nhập",
                headerLeft: null,
            }} />
        <Stack.Screen name="Register" component={Register}
            options={{
                title: "Đăng ký",
                headerLeft: backButton
            }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}
            options={{
                title: "Quên mật khẩu",
                headerLeft: backButton
            }} />
    </Stack.Navigator>
)