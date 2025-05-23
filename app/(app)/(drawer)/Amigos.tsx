import BackButton from '@/components/backButton';
import TextInputComponent from '@/components/textInput';
import colors from '@/constants/Colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import fonts from '../../../constants/fonts';

export default function Amigos() {
  const [userName, setUserName] = useState('Cargando...');
  const [searchText, setSearchText] = useState('');
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
        {/* Encabezado */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <View style={styles.titleContainer}> {/* Nuevo contenedor para el título */}
            <Text style={styles.title}>Amigos</Text>
          </View>
          <View style={styles.userIconContainer}> {/* Nuevo contenedor para el icono */}
            <Image source={require('../../../assets/images/User.png')} style={styles.userIcon} />
          </View>
        </View>

        <View style={styles.AddFriendRow}>
          <Pressable onPress={() => console.log('Buscando amigos...')} style={styles.menuButton}>
            <Image
              source={require('../../../assets/images/Loupe.png')}
              style={{ width: 25, height: 25, resizeMode: 'contain' }}
            />
          </Pressable>

          <TextInputComponent
            placeholder="Ingrese nombre"
            value={searchText}
            onChangeText={setSearchText}
            color={colors.white}
            textColor={"7C6E6E"}
            textAlign="center"
            width={235}
            height={40}
            containerStyle={{ marginBottom: 0 }}
          />

          <Pressable onPress={() => console.log('Añadiste un nuevo amigo')} style={styles.menuButton}>
            <Image
              source={require('../../../assets/images/Add.png')}
              style={{ width: 25, height: 25, resizeMode: 'contain' }}
            />
          </Pressable>
        </View>
        {/* Aquí vendría el dropdown personalizado después */}

        {/* Aquí iría la lista de amigos, que sera renderizada dependiendo de la cantidad de amigos que tenga el usuario iniciado */}
        {/* FriendCardComponent */}
        {/* Aquí iría la lista de solicitudes de amistad */}
        {/* FriendRequestCardComponent */}

        {/* Botón de regresar */}
        <BackButton onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueDark,
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
    justifyContent: 'space-between', // Mantenemos space-between
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 'auto', // Empuja el bloque a la derecha
  },
  title: {
    fontFamily: fonts.pressStart2P,
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
  },
  titleContainer: { 
    flex: 1,
    alignItems: 'center', // Centramos el título dentro de su contenedor
  },
  userIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  userIconContainer: {
    alignItems: 'center',
  },
  AddFriendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
    width: '100%',
    gap: 10,
  },
});