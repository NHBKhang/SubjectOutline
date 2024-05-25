import React, { memo, useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import Logo from '../../components/Logo';
import TextInput from '../../components/TextInput';
import { theme } from '../../core/theme';
import Button from '../../components/Button';
import { H1 } from '../../components/Header';
import { emailValidator } from '../../core/utils';
import { gStyles } from '../../core/global';
import Mailgun, { endpoints } from '../../configs/Mailgun';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' });

  const onSendPressed = async () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    try {
      let res = await Mailgun.post(endpoints['recovery-password']);

      Alert.alert("Done", "Yêu cầu đã được gửi thành công!");
      navigation.navigate('Login');
    } catch (ex) {
      console.error(ex);
      Alert.alert("Error", "Yêu cầu gửi thất bại!");
    }
  };

  return (
    <ScrollView>
      <View style={[gStyles.container, gStyles.mx]}>
        <Logo />

        <H1>Khôi phục mật khẩu</H1>

        <TextInput
          label="Địa chỉ email"
          returnKeyType="done"
          value={email.value}
          onChangeText={text => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address" />

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