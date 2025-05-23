// 📦 Imports
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// 🧠 Contexts
import { useFriendContext } from '@/contexts/FriendsContext';

// 🧩 Components
import BackButton from '@/components/backButton';
import FriendCard from '@/components/friendCard';
import FriendRequestCard from '@/components/friendRequestCard';
import TextInputComponent from '@/components/textInput';

// 🎨 Estilos y Constantes
import colors from '@/constants/Colors';
import fonts from '../../../constants/fonts';

export default function Amigos() {
  const [userName, setUserName] = useState('Cargando...');
  const [searchText, setSearchText] = useState('');
  const {friends, friendRequests, searchUser, sendFriendRequest, handleRequest } = useFriendContext();
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  // 🔍 Obtener nombre del usuario actual
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        setUserName(userSnap.exists() ? userSnap.data().name || 'Jugador' : 'Jugador');
      } catch (error) {
        console.error('Error obteniendo el nombre:', error);
        setUserName('Jugador');
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
  console.log('Amigos:', friends);
  console.log('Solicitudes:', friendRequests);
}, [friends, friendRequests]);


  const sendInvitation = (id: string) => {
    console.log('Invitación enviada a', id);
  };

  const removeFriend = (id: string) => {
    console.log('Eliminar amigo', id);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🧠 Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Amigos</Text>
          </View>
          <View style={styles.userIconContainer}>
            <Image source={require('../../../assets/images/User.png')} style={styles.userIcon} />
          </View>
        </View>

        {/* 🔍 Buscar amigo */}
        <View style={styles.AddFriendRow}>
          <Pressable onPress={() => searchUser(searchText)} style={styles.menuButton}>
            <Image source={require('../../../assets/images/Loupe.png')} style={styles.icon} />
          </Pressable>

          <TextInputComponent
            placeholder="Ingrese nombre"
            value={searchText}
            onChangeText={setSearchText}
            color={colors.white}
            textColor="7C6E6E"
            textAlign="center"
            width={235}
            height={40}
            containerStyle={{ marginBottom: 0 }}
          />

          <Pressable onPress={() => sendFriendRequest(searchText)} style={styles.menuButton}>
            <Image source={require('../../../assets/images/Add.png')} style={styles.icon} />
          </Pressable>
        </View>

        {/* 👫 Lista de amigos */}
        <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendCard
            name={item.name}
            score={item.score}
            onInvite={() => sendInvitation(item.id)}
            onDelete={() => removeFriend(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.subtitle}>No tienes amigos</Text>}
      contentContainerStyle={{ gap: 15 }}
  showsVerticalScrollIndicator={false}
/>



        <View style={styles.RequestsContainer}>
          <Image source={require('../../../assets/images/Mailbox.png')} style={styles.icon} />
          <Text style={styles.title}>Solicitudes</Text>
        </View>

        {/* 📩 Solicitudes */}  
        {friendRequests.map((request) => (
          <FriendRequestCard
            key={request.id}
            name={request.name}
            onAccept={() => handleRequest(request.id, 'accept')}
            onReject={() => handleRequest(request.id, 'reject')}    
          />
        ))}

        {/* ⬅️ Volver */}
        <BackButton onPress={() => router.back()} />
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
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: fonts.pressStart2P,
    fontSize: 14,
    color: colors.white,
    textAlign: 'left',
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
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  RequestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    marginBottom: 30,
    gap: 30,
  },
});
