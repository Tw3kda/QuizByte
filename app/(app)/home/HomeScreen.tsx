import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import WhiteButton from '../../../components/whiteButton';
import colors from '../../../constants/Colors';
import fonts from '../../../constants/fonts';

export default function HomeScreen() {
  const [userName, setUserName] = useState('Cargando...');
  const router = useRouter();
  const navigation = useNavigation();


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
      <ImageBackground
        source={require('../../../assets/images/BackgroundLobby.png')}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Bienvenido {userName}</Text>
          
        <WhiteButton
          title='¡Jugar Trivia!'
          color={colors.green}
          onPress={() => router.push('/(app)/(game)/GameScreen')}
        />

        <WhiteButton
          title="Crear Lobby Privado"
          color={colors.purple}
          onPress={() => router.push('/(app)/(privateLobby)/Index')}
        />

        <WhiteButton
          title="Unirse a Lobby"
          color={colors.orange}
          onPress={() => router.push('/(app)/(privateLobby)/JoinedLobby')}
        />

        <WhiteButton
          title="Agregar Fandoms"
          color={colors.pink}
          onPress={() => router.push('/(app)/(addGame)/Index')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111721',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  imageStyle: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 20,
  },
  title: {
    fontFamily: fonts.pressStart2P,
    fontSize: 17,
    color: '#fff',
    marginBottom: 70,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 70,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
    paddingHorizontal: 10,
  },
});
