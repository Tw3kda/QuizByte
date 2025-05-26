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
  const [fandoms, setFandoms] = useState<{ name: string; url: string }[]>([]);
  const navigation = useNavigation<DrawerNavigationProp<{}>>();


  useEffect(() => {
    const fetchUserData = async () => {
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

          const puntaje = userData.stats?.[0] || 0;
          const trivias = userData.stats?.[1] || 0;
          const ranking = userData.stats?.[2] || 0;
          setStats([puntaje, trivias, ranking]);

          // Obtener fandoms
          const fandomsMap = userData.fandoms || {};
const fandomsArray = Object.values(fandomsMap) as { name: string; url: string }[];
setFandoms(fandomsArray);

        } else {
          setUserName('Jugador');
        }
      } catch (error) {
        console.error('Error obteniendo los datos del usuario', error);
        setUserName('Jugador');
      }
    };

    fetchUserData();
  }, []);

  const handlePress = (item: { name: string; url: string }) => {
    // Aquí puedes agregar navegación u otra lógica
    console.log('Fandom seleccionado:', item.name);
  };

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

          {fandoms.length === 0 ? (
            <Text style={styles.sagasText}>Aquí irán tus sagas favoritas... 👀</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.containerResult}>
                {fandoms.map((item, index) => (
                  <Pressable key={index} onPress={() => handlePress(item)}>
                    <View style={styles.cardContainer}>
                      {item.url ? (
                        <Image
                          style={styles.image}
                          source={{ uri: item.url }}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.noImageText}>Sin imagen</Text>
                      )}
                      <Text
                        style={styles.name}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}
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
  containerResult: {
    flexDirection: 'row',
    gap: 20,
  },
  cardContainer: {
    width: 120,
    alignItems: 'center',
    backgroundColor: colors.grayDark,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 90,
    height: 120,
    marginBottom: 10,
  },
  noImageText: {
    color: colors.gray,
    fontSize: 12,
  },
  name: {
    fontFamily: fonts.pressStart2P,
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
  },
});
