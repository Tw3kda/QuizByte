import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { styles } from '../styles/buttons';

interface Props {
  onPress: () => void;
}

const TrashButton = ({ onPress }: Props) => {
  return (
    <Pressable style={styles.trashButton} onPress={onPress}>
      <View style={styles.trashContent}>
        <Text style={styles.backButtonText}>LIMPIAR TODAS</Text>
        <Image
          source={require('../assets/images/TrashCan.png')}
          style={styles.trashIcon}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};

export default TrashButton;