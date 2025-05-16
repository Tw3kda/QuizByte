import { DrawerContentScrollView, } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../../constants/Colors';
import fonts from '../../../constants/fonts';

const drawerItems = [
  { label: 'Lobby', route: './Index', icon: require('../../../assets/images/lobby.png') },
  { label: 'Perfil', route: './Perfil', icon: require('../../../assets/images/profile.png') },
  { label: 'Amigos', route: './Amigos', icon: require('../../../assets/images/Friends.png') },
  { label: 'Notificaciones', route: './Notificaciones', icon: require('../../../assets/images/Bell.png') },
  { label: 'Configuración', route: './Settings', icon: require('../../../assets/images/Gears.png') },
];

export default function CustomDrawer(props: any) {
const [userName, setUserName] = useState('Cargando...');
  const router = useRouter();

  const logout = () => {
    router.replace('/'); // o la ruta real
  };

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
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.menu}>
        {drawerItems.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.item,
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => router.push(item.route)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        ))}

        <Pressable style={styles.item} onPress={logout}>
          <Image source={require('../../../assets/images/SignOut.png')} style={styles.icon} />
          <Text style={styles.label}>Cerrar Sesión</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.username}>{userName}</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.purple,
    flex: 1,
    paddingTop: 40,
  },
  menu: {
    flex: 1,
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  label: {
    color: colors.white,
    fontFamily: fonts.pressStart2P,
    fontSize: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.white,
  },
  username: {
    color: colors.white,
    fontFamily: fonts.pressStart2P,
    fontSize: 10,
  },
});
