// 📦 Imports
import { FriendMap } from '@/interfaces/common';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// 🧠 Contexts
import { useFriends } from '@/contexts/FriendsContext';

// 🧩 Components
import BackButton from '@/components/backButton';
import FriendCard from '@/components/friendCard';
import FriendRequestCard from '@/components/friendRequestCard';
import TextInputComponent from '@/components/textInput';

// 🎨 Estilos y Constantes
import colors from '@/constants/Colors';
import fonts from '@/constants/fonts';

export default function Amigos() {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<FriendMap | null>(null);

  const {
    friends,
    friendRequests,
    searchUser,
    sendFriendRequest,
    handleRequest,
  } = useFriends();

  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<{}>>();

  // 🔍 Buscar amigo por nombre
  const handleSearch = async () => {
    const result = await searchUser(searchText.trim());
    setSearchResult(result);
  };

  // ➕ Enviar solicitud de amistad
  const handleSendRequest = async () => {
    if (searchResult) {
      await sendFriendRequest(searchResult.id, searchResult.name || 'Amigo');
      setSearchResult(null);
      setSearchText('');
    }
  };

  // ✉️ Invitar a jugar
  const sendInvitation = (id: string) => {
    console.log('Invitación enviada a', id);
    // TODO: lógica de notificación
  };

  // 🗑️ Eliminar amigo
  const removeFriend = (id: string) => {
    console.log('Eliminar amigo', id);
    // TODO: lógica de eliminar
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🔝 Header */}
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

        {/* 🔎 Buscar amigo */}
        <View style={styles.AddFriendRow}>
          <Pressable onPress={handleSearch} style={styles.menuButton}>
            <Image source={require('../../../assets/images/Loupe.png')} style={styles.icon} />
          </Pressable>

          <TextInputComponent
            placeholder="Ingrese nombre"
            value={searchText}
            onChangeText={setSearchText}
            color={colors.white}
            textColor={colors.black}
            textAlign="center"
            width={235}
            height={40}
            containerStyle={{ marginBottom: 0 }}
          />

          <Pressable
            onPress={handleSendRequest}
            style={styles.menuButton}
            disabled={!searchResult}
          >
            <Image source={require('../../../assets/images/Add.png')} style={styles.icon} />
          </Pressable>
        </View>

        {/* 👤 Resultado búsqueda */}
        {searchResult && (
          <FriendCard
            id={searchResult.id}
            name={searchResult.name}
            score={searchResult.stats?.[0]}
            onInvite={() => {}}
            onDelete={() => {}}
            actionLabel="Enviar solicitud"
            onAction={handleSendRequest}
          />
        )}

        {/* 👬 Lista de amigos */}
        {friends.length === 0 ? (
          <Text style={styles.title}>No tienes amigos aún</Text>
        ) : (
          friends.map((friend) => (
            <FriendCard
              key={friend.id}
              id={friend.id}
              name={friend.name}
              score={friend.score}
              onInvite={() => sendInvitation(friend.id)}
              onDelete={() => removeFriend(friend.id)}
            />
          ))
        )}

        {/* ✉️ Solicitudes */}
        <View style={styles.RequestsRow}>
          <Image source={require('../../../assets/images/Mailbox.png')} style={styles.userIcon} />
          <Text style={styles.title}>Solicitudes</Text>
        </View>

        {friendRequests.map((request) => (
          <FriendRequestCard
            key={request.id}
            id={request.id}
            name={request.name}
            onAccept={() => handleRequest(request.id, 'accept')}
            onReject={() => handleRequest(request.id, 'reject')}
          />
        ))}

        {/* ⬅️ Volver */}
        <BackButton onPress={() => router.push('/(app)/(drawer)/Index')} />
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
