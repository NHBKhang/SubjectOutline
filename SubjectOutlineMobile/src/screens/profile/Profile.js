import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { memo, useContext, useState } from 'react';
import { gStyles } from '../../core/global';
import { ProfileTable, H1, Button, Avatar } from '../../components';
import { picker } from '../../core/utils';
import Context from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../configs/API';

const Profile = ({ navigation, user, setUser, editMode }) => {
    const [, dispatch] = useContext(Context);

    const logout = () => {
        navigation.navigate('Login');

        dispatch({
            "type": "logout"
        });
    };

    const updateUser = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }

    const rows = [
        {
            label: 'Tên',
            value: user.first_name,
            field: 'first_name',
            type: 'text'
        },
        {
            label: 'Họ',
            value: user.last_name,
            field: 'last_name',
            type: 'text'
        },
        {
            label: 'Email',
            value: user.email,
            field: 'email',
            type: 'text'
        },
        {
            label: 'Số điện thoại',
            value: user.phone,
            field: 'phone',
            type: 'text'
        },
        {
            label: 'Ngày sinh',
            value: user.birthday,
            field: 'birthday',
            type: 'date'
        }
    ];

    const changeAvatar = async () => {
        let avatar = await picker();

        if (avatar) {
            Alert.alert(
                'Cập nhật ảnh đại diện?',
                'Tải ảnh đại diện mới lên ứng dụng.', [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        const form = new FormData();
                        form.append('avatar', {
                            uri: avatar.uri,
                            name: avatar.fileName,
                            type: avatar.mimeType
                        });
                        try {
                            let token = await AsyncStorage.getItem("access-token");
                            let res = await authApi(token).patch(endpoints["current-user"],
                                form, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            updateUser('avatar', res.data.avatar);
                            dispatch({
                                type: "login",
                                payload: res.data
                            });

                            Alert.alert("Updated", "Cập nhật ảnh đại diện thành công.");
                        } catch (ex) {
                            console.error(ex);
                            Alert.alert("Failed", "Cập nhật ảnh đại diện thất bại.");
                        }
                    }
                }],
                { cancelable: false }
            );
        }
    }

    return (
        <ScrollView>
            <View style={gStyles.container}>
                <TouchableOpacity onPress={changeAvatar}>
                    <Avatar
                        src={user.avatar}
                        size={100} />
                </TouchableOpacity>

                <H1>{user.username}</H1>

                <ProfileTable
                    rows={rows}
                    editMode={editMode}
                    updateCallback={updateUser} />

                {editMode ? null :
                    <Button mode="contained" onPress={logout}>Đăng xuất</Button>}
            </View>
        </ScrollView>
    )
}


export default memo(Profile);