import colors from '@/constants/Colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import fonts from '../../../constants/fonts';

export default function Index() {
  const [userName, setUserName] = useState('Cargando...');
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.name || 'Jugador');
        } else {
          setUserName('Jugador');
        }
      } catch (error) {
        console.error('Error obteniendo el nombre:', error);
        setUserName('Jugador');
      }
    };

    fetchUserName();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Holaa {userName}</Text>
            <Image source={require('../../../assets/images/User.png')} style={styles.userIcon} />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleStats}>Tus Estadísticas</Text>
            <Image source={require('../../../assets/images/Trophie.png')} style={styles.sectionIcon} />
          </View>

          <Text style={styles.statLabel}>Puntaje Total</Text>
          <Text style={styles.statValue}>120540</Text>

          <Text style={styles.statLabel}>Trivias Jugadas</Text>
          <Text style={styles.statValue}>12</Text>

          <Text style={styles.statLabel}>Ranking Actual</Text>
          <Text style={styles.statValue}>150</Text>
        </View>

        <View style={styles.sagasContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleSagas}>Sagas Favoritas</Text>
            <Image source={require('../../../assets/images/Badge.png')} style={styles.sectionIcon} />
          </View>

          <Text style={styles.sagasText}>Aquí irán tus sagas favoritas... 👀</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111721',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40, // Reducimos un poco el padding superior
    paddingBottom: 40,
    paddingHorizontal: 20,
    gap: 25, // Aumentamos un poco el espacio entre contenedores
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40, // Reducimos el margen inferior
    paddingHorizontal: 20,
    width: '100%',
  },
  menuButton: {
    paddingVertical: 10,
    paddingRight: 15, // Ajustamos el padding para estar más pegado al borde izquierdo
  },
  menuIcon: {
    fontSize: 22,
    color: colors.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  title: {
    fontFamily: fonts.pressStart2P,
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
  },
  userIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  statsContainer: {
    backgroundColor: colors.grayDark,
    padding: 25, // Aumentamos el padding
    width: '100%',
    borderRadius: 10, // Añadimos bordes redondeados
    gap: 18, // Aumentamos el espacio entre elementos
  },
  statLabel: {
    fontFamily: fonts.pressStart2P,
    color: colors.orange,
    fontSize: 13,
  },
  statValue: {
    fontFamily: fonts.pressStart2P,
    color: colors.white,
    fontSize: 15,
  },
  sagasContainer: {
    backgroundColor: colors.grayDark,
    padding: 25, // Aumentamos el padding
    width: '100%',
    borderRadius: 10, // Añadimos bordes redondeados
  },
  sagasText: {
    fontFamily: fonts.pressStart2P,
    color: '#D1D5DB', // Un tono de gris más claro
    fontSize: 13,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15, // Reducimos un poco el margen inferior
  },
  sectionTitleStats: {
    fontFamily: fonts.pressStart2P,
    color: '#6366F1', // Color del encabezado de estadísticas
    fontSize: 16,
  },
  sectionTitleSagas: {
    fontFamily: fonts.pressStart2P,
    color: colors.pink, // Un tono de morado/rosa para Sagas Favoritas (ajústalo si tienes un color específico)
    fontSize: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});