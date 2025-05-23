import colors from '@/constants/Colors';
import fonts from '@/constants/fonts';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FriendRequestCardProps {
  name: string;
  onAccept: () => void;
  onReject: () => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ name, onAccept, onReject }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image source={require('../assets/images/User.png')} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={onAccept}>
          <Image source={require('../assets/images/Accept.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onReject}>
          <Image source={require('../assets/images/Decline.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendRequestCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grayDark,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 10,
  },
  name: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.pressStart2P,
  },
  right: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
