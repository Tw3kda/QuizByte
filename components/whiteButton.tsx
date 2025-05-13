import React from 'react';
import { Pressable, Text } from 'react-native';
import { styles as baseStyles } from '../styles/buttons';

interface Props {
  title: string;
  color?: string; // color de fondo
  textColor?: string; // color del texto
  onPress: () => void;
}

const WhiteButton = ({ title, onPress, color, textColor }: Props) => {
  return (
    <Pressable
      style={[
        baseStyles.whiteButton,
        color && { backgroundColor: color }, // si hay color, lo aplica
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          baseStyles.whiteButtonText,
          textColor && { color: textColor }, // si hay textColor, lo aplica
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default WhiteButton;
