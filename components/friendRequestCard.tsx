// 📁 components/FriendRequestCard.tsx

import colors from '@/constants/Colors';
import fonts from '@/constants/fonts';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface FriendRequestCardProps {
  id: string;
  name: string;
  onAccept: () => void;
  onReject: () => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  name,
  onAccept,
  onReject,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Image
          source={require('@/assets/images/User.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <Pressable onPress={onAccept} style={styles.acceptButton}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </Pressable>
        <Pressable onPress={onReject} style={styles.rejectButton}>
          <Text style={styles.buttonText}>Rechazar</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FriendRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.grayDark,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontFamily: fonts.pressStart2P,
    fontSize: 16,
    color: colors.white,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: colors.green,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: colors.red,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: fonts.pressStart2P,
    fontSize: 14,
    color: colors.white,
  },
});
