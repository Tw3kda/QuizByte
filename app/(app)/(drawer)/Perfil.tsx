import colors from '@/constants/Colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import fonts from '../../../constants/fonts';

export default function Index() {
  const [userName, setUserName] = useState('Cargando...');
  const [stats, setStats] = useState<number[]>([0, 0, 0]);
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

          const puntaje = userData.stats[0] || 0;
          const trivias = userData.stats[1] || 0;
          const ranking = userData.stats[2] || 0;
          setStats([puntaje, trivias, ranking]);
        } else {
          setUserName('Jugador');
        }
      } catch (error) {
        console.error('Error obteniendo el nombre y sus datos', error);
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
          <View style={styles.titleContainer}> {/* Nuevo contenedor para el título */}
            <Text style={styles.title}>Holaa {userName}</Text>
          </View>
          <View style={styles.userIconContainer}> {/* Nuevo contenedor para el icono */}
            <Image source={require('../../../assets/images/User.png')} style={styles.userIcon} />
            </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleStats}>Tus Estadísticas</Text>
            <Image source={require('../../../assets/images/Trophie.png')} style={styles.sectionIcon} />
          </View>

          <Text style={styles.statLabel}>Puntaje Total</Text>
          <Text style={styles.statValue}>{stats[0]}</Text>

          <Text style={styles.statLabel}>Trivias Jugadas</Text>
          <Text style={styles.statValue}>{stats[1]}</Text>

          <Text style={styles.statLabel}>Ranking Actual</Text>
          <Text style={styles.statValue}>{stats[2]}</Text>
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
    paddingTop: 45,
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
    marginBottom: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
  menuButton: {
    paddingVertical: 10,
    paddingRight: 15,
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
    padding: 25,
    width: '100%',
    gap: 18,
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
    padding: 25,
    width: '100%',
  },
  sagasText: {
    fontFamily: fonts.pressStart2P,
    color: '#D1D5DB',
    fontSize: 13,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitleStats: {
    fontFamily: fonts.pressStart2P,
    color: '#6366F1',
    fontSize: 16,
  },
  sectionTitleSagas: {
    fontFamily: fonts.pressStart2P,
    color: colors.pink,
    fontSize: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  titleContainer: { 
    flex: 1,
    alignItems: 'center', // Centramos el título dentro de su contenedor
  },
  userIconContainer: {
    alignItems: 'center',
  },
});
