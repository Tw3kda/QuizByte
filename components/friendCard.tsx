// 📁 components/FriendCard.tsx

import colors from '@/constants/Colors';
import fonts from '@/constants/fonts';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import WhiteButton from './whiteButton';

interface FriendCardProps {
  id: string;
  name: string;
  score?: number;
  onInvite?: () => void;
  onDelete?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  name,
  score,
  onInvite,
  onDelete,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <Image
          source={require('@/assets/images/User.png')}
          style={styles.avatar}
        />
        <View style={styles.nameScoreContainer}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.scoreRow}>
            <Image
              source={require('@/assets/images/Trophie.png')}
              style={styles.trophy}
            />
            <Text style={styles.score}>{score}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {onInvite && (
          <WhiteButton
            title="INVITAR"
            color={colors.orange}
            onPress={onInvite}
          />
        )}
        {onDelete && (
          <Pressable onPress={onDelete} style={styles.trashButton}>
            <Image
              source={require('@/assets/images/TrashCan.png')}
              style={styles.trashIcon}
            />
          </Pressable>
        )}
        {actionLabel && onAction && (
          <Pressable onPress={onAction} style={styles.actionButton}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.grayDark,
    padding: 12,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  nameScoreContainer: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.pressStart2P,
    fontSize: 12,
    color: colors.white,
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trophy: {
    width: 16,
    height: 16,
  },
  score: {
    fontFamily: fonts.pressStart2P,
    fontSize: 12,
    color: colors.purple,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  inviteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.orange,
    backgroundColor: colors.orange,
  },
  inviteText: {
    fontFamily: fonts.pressStart2P,
    fontSize: 12,
    color: colors.white,
  },
  trashButton: {
    padding: 5,
  },
  trashIcon: {
    width: 32,
    height: 32,
    tintColor: colors.red,
  },
  actionButton: {
    padding: 6,
  },
  actionText: {
    fontFamily: fonts.pressStart2P,
    fontSize: 12,
    color: colors.purple,
  },
});
