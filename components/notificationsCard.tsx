import colors from '@/constants/Colors';
import fonts from '@/constants/fonts';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const icons = {
  invite: require('../assets/images/GameController.png'),
  triviaWin: require('../assets/images/Confetti.png'),
  friendRequest: require('../assets/images/HandShake.png'),
};

export default function NotificationCard({ type, message, timestamp }: {
  type: 'invite' | 'triviaWin' | 'friendRequest';
  message: string;
  timestamp: any;
}) {
  const formatDate = (ts: any) => {
  if (!ts) return '';
  const date = ts.toDate();
  const now = new Date();

  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const today = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === today) {
    return `Hoy ${timeString}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Ayer ${timeString}`;
  } else {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} ${timeString}`;
  }
};


  return (
   <View style={styles.card}>
    {/* Fila 1: ícono principal + mensaje */}
    <View style={styles.row}>
        <Image source={icons[type]} style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
    </View>

    {/* Fila 2: ícono de calendario + tiempo */}
    <View style={styles.row}>
        <Image source={require('../assets/images/Calendar.png')} style={styles.timeIcon} />
        <Text style={styles.time}>{formatDate(timestamp)}</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.grayDark,
    padding: 16,
    width: 300,
    gap: 8, // Espacio entre filas
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginTop: 2,
  },
  timeIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginTop: 2,
  },
  message: {
    flex: 1,
    flexShrink: 1,
    fontFamily: fonts.pressStart2P,
    fontSize: 15,
    color: colors.white,
    textAlign: 'left',
  },
  time: {
    fontFamily: fonts.pressStart2P,
    fontSize: 12,
    color: colors.pink,
    marginBottom: 2,
  },
});
