import colors from '@/constants/Colors';
import fonts from '@/constants/fonts';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WhiteButton from './whiteButton';

interface FriendCardProps {
  name: string;
  score?: number;
  onInvite: () => void;
  onDelete: () => void;
}

export default function FriendCard({ name, score, onInvite, onDelete }: FriendCardProps) {
  const handleInvite = () => {
    onInvite();
    Alert.alert('Invitación enviada', `Has invitado a ${name} al lobby.`);
  };

  return (
    <View style={styles.card}>
      {/* Fila 1: avatar + nombre + score */}
      <View style={styles.row}>
        <Image source={require('../assets/images/User.png')} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
        <View style={styles.scoreContainer}>
          <Image source={require('../assets/images/Trophie.png')} style={styles.trophy} />
          <Text style={styles.score}>{score ?? 0}</Text>
        </View>
      </View>

      {/* Fila 2: botones */}
      <View style={styles.row}>
        <WhiteButton title="INVITAR" color={colors.pink} onPress={handleInvite} />
        <TouchableOpacity onPress={onDelete}>
          <Image source={require('../assets/images/TrashCan.png')} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.grayDark,
    padding: 16,
    width: 300,
    gap: 8,
    flexDirection: 'column',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  name: {
    flex: 1,
    flexShrink: 1,
    fontFamily: fonts.pressStart2P,
    fontSize: 14,
    color: colors.white,
    textAlign: 'left',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophy: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  score: {
    fontFamily: fonts.pressStart2P,
    fontSize: 14,
    color: colors.purple,
    marginLeft: 4,
  },
  deleteIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
