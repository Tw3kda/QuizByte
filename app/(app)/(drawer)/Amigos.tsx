// 📦 Imports
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// 🧩 Components
import BackButton from '@/components/backButton';
import FriendCard from '@/components/friendCard';
import TextInputComponent from '@/components/textInput';

// 🎨 Estilos y Constantes
import colors from '@/constants/Colors';
import fonts from '@/constants/fonts';

export default function Amigos() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🔝 Header */}
        <View style={styles.header}>
          <Pressable style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Amigos</Text>
          </View>
          <View style={styles.userIconContainer}>
            <Image source={require('../../../assets/images/User.png')} style={styles.userIcon} />
          </View>
        </View>

        {/* 🔎 Buscar amigo */}
        <View style={styles.AddFriendRow}>
          <Pressable style={styles.menuButton}>
            <Image source={require('../../../assets/images/Loupe.png')} style={styles.icon} />
          </Pressable>

          <TextInputComponent
            placeholder="Ingrese nombre"
            value="Ejemplo"
            onChangeText={() => {}}
            color={colors.white}
            textColor={colors.black}
            textAlign="center"
            width={235}
            height={40}
            containerStyle={{ marginBottom: 0 }}
          />

          <Pressable style={styles.menuButton}>
            <Image source={require('../../../assets/images/Add.png')} style={styles.icon} />
          </Pressable>
        </View>

        {/* 👤 Resultado fijo */}
        <FriendCard
          id="1"
          name="Juan Pérez"
          score={1234}
          onInvite={() => {}}
          onDelete={() => {}}
          actionLabel="Enviar solicitud"
        />

        {/* ✉️ Solicitudes */}
        <View style={styles.RequestsRow}>
          <Image source={require('../../../assets/images/Mailbox.png')} style={styles.userIcon} />
          <Text style={styles.title}>Solicitudes</Text>
        </View>

        {/* ⬅️ Volver */}
        <BackButton onPress={() => {}} />
      </ScrollView>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueDark,
    paddingTop: 35,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  menuButton: {
    padding: 10,
    width: 50,
    height: 50,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.white,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.pressStart2P,
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
  },
  userIconContainer: {
    alignItems: 'center',
  },
  userIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  AddFriendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
    gap: 10,
    paddingRight: 20,
  },
  RequestsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
