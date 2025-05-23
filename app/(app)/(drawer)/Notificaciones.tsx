import BackButton from '@/components/backButton';
import NotificationCard from '@/components/notificationsCard';
import TrashButton from '@/components/trashButton';
import colors from '@/constants/Colors';
import { useNotification } from '@/contexts/NotifcationContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import fonts from '../../../constants/fonts';

type NotificationType = {
  id: string;
  type: 'invite' | 'triviaWin' | 'friendRequest';
  message: string;
  timestamp: Timestamp;
};



export default function Notificaciones() {
  const [userName, setUserName] = useState('Cargando...');
  const {expoPushToken, notification } = useNotification();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
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

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const firestore = getFirestore();
      const notifRef = collection(firestore, 'notifications', user.uid, 'items');
      const snapshot = await getDocs(notifRef);

      const notifList: NotificationType[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
      })) as NotificationType[];  

      // Ordenar por fecha descendente
      notifList.sort((a, b) => b.timestamp?.toDate().getTime() - a.timestamp?.toDate().getTime());

      setNotifications(notifList);
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
    }
  };

  fetchNotifications();
}, []);

  const clearNotifications = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const firestore = getFirestore();
  const notifRef = collection(firestore, 'notifications', user.uid, 'items');
  const snapshot = await getDocs(notifRef);

  const deletePromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(firestore, 'notifications', user.uid, 'items', docSnap.id))
  );

  await Promise.all(deletePromises);
  setNotifications([]);
};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <View style={styles.titleContainer}> {/* Nuevo contenedor para el título */}
            <Text style={styles.title}>Notificaciones</Text>
          </View>
          <View style={styles.userIconContainer}> {/* Nuevo contenedor para el icono */}
            <Image source={require('../../../assets/images/User.png')} style={styles.userIcon} />
          </View>
        </View>

        {notifications.map((notif) => (
        <NotificationCard
          key={notif.id}
          type={notif.type}
          message={notif.message}
          timestamp={notif.timestamp}
        />
        ))}
      
        {/* Boton para limpiar notificaciones */}
        <TrashButton onPress={clearNotifications} />
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
    paddingTop: 60,
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
    fontSize: 16,
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