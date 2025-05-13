import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { styles } from '../styles/buttons';

interface Props {
  onPress: () => void;
}

const BackButton = ({ onPress }: Props) => {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <View style={styles.backContent}>
        <Text style={styles.backButtonText}>REGRESAR</Text>
        <Image
          source={require('../assets/images/backButton.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};

export default BackButton;
