import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

const CustomTextField = ({label, placeholder, handleChange, value}) => {
  return (
    <View>
      <Text>{label}</Text>
      <TextInput
        style={styles.textInput}
        keyboardType="numeric"
        value={value}
        onChangeText={(text) => handleChange(text)}
        placeholder={placeholder}
      />
    </View>
  );
};

export default CustomTextField;

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 20,
    padding: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 100,
    fontSize: 16,
  },
});
