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
      <View style={styles.contentRow}>
        <View style={styles.infoContainer}>
          <Image
            source={require('@/assets/images/User.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <Pressable onPress={onAccept} style={styles.iconButton}>
            <Image
              source={require('@/assets/images/Accept.png')}
              style={styles.Accepticon}
            />
          </Pressable>
          <Pressable onPress={onReject} style={styles.iconButton}>
            <Image
              source={require('@/assets/images/Decline.png')}
              style={styles.Declineicon}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FriendRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.grayDark,
    padding: 20,
    width: '100%',
    marginVertical: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  name: {
    fontFamily: fonts.pressStart2P,
    fontSize: 16,
    color: colors.white,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  iconButton: {
    padding: 5,
  },
  Accepticon: {
    width: 40,
    height: 40,
    tintColor: colors.green,
  },
  Declineicon: {
    width: 40,
    height: 40,
    tintColor: colors.red,
  },
});