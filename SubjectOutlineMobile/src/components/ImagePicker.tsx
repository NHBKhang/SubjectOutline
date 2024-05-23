import React, { useState, memo } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { gStyles } from '../core/global';
import { theme } from '../core/theme';
import { picker } from '../core/utils';

const ImagePicker = ({ label, errorText, value, onValueChange }) => {
  const [image, setImage] = useState(value);

  const onPress = async () => {
    await picker([setImage, onValueChange]);
  }

  return (
    <TouchableOpacity
      style={[
        gStyles.container,
        styles.container,
        errorText && !image && styles.errorBox]}
      onPress={onPress}>

      <View style={styles.center}>
        {image ?
          <Image source={{ uri: image.uri }} style={styles.photo} /> : null
        }
        <Text style={[
          styles.text,
          errorText && !image && styles.error]}>
          {label}
        </Text>
      </View>

      {!image ?
        <Text style={styles.error}>{errorText}</Text> : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  photo: {
    width: 200,
    height: 150,
    objectFit: 'cover'
  },
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surface,
    marginBottom: 30
  },
  center: {
    width: '100%',
    height: 200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  text: {
    fontSize: 15,
    color: '#444444',
    margin: 5,
    marginTop: 10
  },
  error: {
    color: theme.colors.error,
  },
  errorBox: {
    borderWidth: 2,
    borderColor: theme.colors.error
  }
});

export default memo(ImagePicker);