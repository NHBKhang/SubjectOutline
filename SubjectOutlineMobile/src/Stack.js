import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { addButton, backButton } from './components/HeaderButton';
import {
    Login,
    Register,
    ForgotPassword
} from './screens/auth';
import Home from './screens/home/Home';
import Outline from './screens/home/Outline';
import OutlineDetails from './screens/home/OutlineDetails';
import Message from './screens/message/Message';
import MessageRoom from './screens/message/MessageRoom';
import MyWork from './screens/my_work/MyWork';
import MyWorkDetails from './screens/my_work/MyWorkDetails';
import Compiler from './screens/my_work/Compiler';
import Dashboard from './screens/intro/Dashboard';
import AdditionalInfo from './screens/intro/AdditionalInfo';
import InstructorInfo from './screens/intro/InstructorInfo';
import StudentInfo from './screens/intro/StudentInfo';

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