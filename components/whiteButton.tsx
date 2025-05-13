import React from 'react';
import { Pressable, Text } from 'react-native';
import { styles } from '../styles/buttons';

interface Props {
  title: string;
  onPress: () => void;
}

const WhiteButton = ({ title, onPress }: Props) => {
  return (
    <Pressable style={styles.whiteButton} onPress={onPress}>
      <Text style={styles.whiteButtonText}>{title}</Text>
    </Pressable>
  );
};

export default WhiteButton;
