import React, { memo, useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { theme } from '../../core/theme';
import { gStyles } from '../../core/global';
import Mailgun, { endpoints } from '../../configs/Mailgun';
import { Button, H1, Logo, TextInput } from '../../components';
import { isNullOrEmpty, usernameValidator } from '../../core/utils';

const ForgotPassword = ({ navigation }) => {
  const [username, setUsername] = useState({ value: '', error: null });

  const onSendPressed = async () => {
    const usernameError = usernameValidator(username.value);

    if (isNullOrEmpty(username.value)) {
      setUsername({ ...username, error: usernameError });
    } else {
      try {
        let res = await Mailgun.post(endpoints['recovery-password'],
          { username: username }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log(res.data);

        Alert.alert("Done", "Yêu cầu đã được gửi thành công!");
        navigation.navigate('Login');
      } catch (ex) {
        console.error(ex);
        Alert.alert("Error", "Yêu cầu gửi thất bại!");
      }
    }
  };

  return (
    <ScrollView>
      <View style={[gStyles.container, gStyles.mx]}>
        <Logo />

        <H1>Khôi phục mật khẩu</H1>

        <TextInput
          label="Tên tài khoản"
          returnKeyType="done"
          value={username.value}
          onChangeText={text => setUsername({ value: text, error: null })}
          error={!!username.error}
          errorText={username.error}
          autoCapitalize="none" />

        <Button mode="contained" onPress={onSendPressed} style={styles.button}>
          Gửi yêu cầu
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
  },
});

export default memo(ForgotPassword);