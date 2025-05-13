import React from 'react';
import { Pressable, Text } from 'react-native';
import { styles } from '../styles/buttons';

interface Props {
  title: string;
  onPress: () => void;
  children?: React.ReactNode;
}

const BlackButton2 = ({ title, onPress }: Props) => {
  return (
    <Pressable style={styles.blackButton2} onPress={onPress}>
      <Text style={styles.blackButtonText}>{title}</Text>
    </Pressable>
  );
};

export default BlackButton2;
