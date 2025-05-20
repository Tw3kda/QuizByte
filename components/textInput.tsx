import React from 'react';
import { TextInput, View } from 'react-native';
import { styles } from '../styles/textInput';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  color?: string;
  textColor?: string;
  inputStyle?: object;
  containerStyle?: object;
  textAlign?: 'left' | 'center' | 'right';
  width?: string | number;
  height?: string | number;
}

const TextInputComponent = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  color,
  textColor,
  inputStyle,
  containerStyle,
  textAlign = 'left',
  width,
  height,
}: Props) => {
  return (
    <View
      style={[
        styles.inputContainer,
        color && { backgroundColor: color },
        width && { width },
        height && { height },
        containerStyle,
      ]}
    >
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          textColor && { color: textColor },
          inputStyle,
          { textAlign },
        ]}
      />
    </View>
  );
};


export default TextInputComponent;
