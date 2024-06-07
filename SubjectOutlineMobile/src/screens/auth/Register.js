import * as React from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import RegisterInstructor from './RegisterInstructor';
import RegisterStudent from './RegisterStudent';
import { gStyles } from '../../core/global';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../core/theme';
import { Text } from 'react-native-paper';
import { H1, Logo } from '../../components';

const RegisterTabView = ({ navigation }) => {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'student', title: 'Sinh viên' },
        { key: 'instructor', title: 'Giảng viên' },
    ]);

    const renderScene = SceneMap({
        student: () =>
            <RegisterContainer navigation={navigation} >
                <RegisterStudent navigation={navigation} />
            </RegisterContainer>,
        instructor: () =>
            <RegisterContainer navigation={navigation} >
                <RegisterInstructor navigation={navigation} />
            </RegisterContainer>,
    });

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}

const RegisterContainer = ({ children, navigation }) => (
    <ScrollView>
        <View style={[gStyles.container, gStyles.mx]}>
            <Logo size={100} />

            <H1>Tạo tài khoản mới</H1>

            {children}

            <View style={styles.row}>
                <Text style={styles.label}>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
)

const styles = StyleSheet.create({
    label: {
        color: theme.colors.secondary,
    },
    button: {
        marginTop: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default React.memo(RegisterTabView);