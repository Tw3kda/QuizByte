import React from 'react';
import { Pressable, Text } from 'react-native';
import { styles as baseStyles } from '../styles/buttons';

interface Props {
  title: string;
  onPress: () => void;
  color?: string; // color de fondo
  textColor?: string; // color del texto
}

const BlackButton = ({ title, onPress, color, textColor }: Props) => {
  return (
    <Pressable
      style={[
        baseStyles.blackButton,
        color && { backgroundColor: color }, // aplica color de fondo si se pasa
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          baseStyles.blackButtonText,
          textColor && { color: textColor }, // aplica color del texto si se pasa
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default BlackButton;
