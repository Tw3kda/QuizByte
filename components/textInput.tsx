import React from 'react';
import { TextInput, View } from 'react-native';
import { styles } from '../styles/textInput';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const TextInputComponent = ({ placeholder, value, onChangeText, secureTextEntry }: Props) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
};

export default TextInputComponent;
