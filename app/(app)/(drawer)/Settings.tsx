import TextInputComponent from '@/components/textInput';
import colors from '@/constants/Colors';
import { styles as TextInputStyles } from '@/styles/textInput';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import fonts from '../../../constants/fonts';



export default function Settings() {
  const [userName, setUserName] = useState('Cargando...');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // true = activadas
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<{}>>(); // Drawer navigation pa' abrir el menú

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
          setNotificationsEnabled(userData.notificationsEnabled ?? true);
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

const handleConfirm = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const firestore = getFirestore();
    const userRef = doc(firestore, 'users', user.uid);

    await setDoc(
      userRef,
      {
        name: userName,
        notificationsEnabled: notificationsEnabled,
      },
      { merge: true }
    );

    showFeedback('¡Configuración guardada con éxito!');
    router.back(); // o navigation.goBack()
  } catch (error) {
    console.error('Error guardando configuración:', error);
    showFeedback('Ocurrió un error al guardar. Intenta de nuevo.');
  }
};


const showFeedback = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('¡Listo!', message);
  }
};


const handleDeleteAccount = () => {
  Alert.alert(
    'Confirmar eliminación',
    '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive',
        onPress: async () => {
          try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            await user.delete();
            showFeedback('Cuenta eliminada. 😢');
            router.replace('/');
          } catch (error) {
            console.error('Error eliminando cuenta:', error);
            showFeedback('Error al eliminar la cuenta.');
          }
        }
      }
    ]
  );
};


  return (
  <View style={styles.container}>
    
    {/* Header separado del scroll */}
    <View style={styles.header}>
      <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>CONFIGURACIÓN</Text>
      </View>
    </View>

    <View style={styles.changeNameContainer}>
      <View style={styles.changeNameContent}>

        <View style={styles.titleAndIcon}>
          <Text style={styles.changeNameText}>CAMBIAR NOMBRE</Text>
          <Image source={require('../../../assets/images/InputText.png')} style={styles.inputIcon} /> 
        </View>

        <TextInputComponent
          placeholder={userName}
          onChangeText={(text) => setUserName(text)}
          color={colors.grayDark}
          textColor={colors.white}
          textAlign="left"
          width={102}
          height={33}
          containerStyle={TextInputStyles.inputContainer}
          inputStyle={styles.inputText}
          secureTextEntry={false}
          placeholderTextColor="#9CA3AF"
          value={userName}
        />
      </View>
      
    </View>      

    <View style={styles.notificationsContainer}>
      <Text style={styles.sectionTitle}>Notificaciones</Text>     
        <View style={styles.notificationIcons}>
          <Pressable onPress={() => setNotificationsEnabled(false)}>
          <Image
            source={require('../../../assets/images/BellOff.png')}
            style={[
              styles.notifIcon,
                { tintColor: !notificationsEnabled ? colors.orange : '#9CA3AF' },
            ]}
            />
          </Pressable>
          <Pressable onPress={() => setNotificationsEnabled(true)}>
          <Image
            source={require('../../../assets/images/BellOn.png')}
            style={[
              styles.notifIcon,
                { tintColor: notificationsEnabled ? colors.orange : '#9CA3AF' },
            ]}
            />
            </Pressable>
        </View>
    </View>

    <View style={styles.deleteContainer}>
      <Text style={styles.deleteTitle}>Borrar cuenta permanentemente</Text>
        <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </Pressable>
    </View>

      <Pressable style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirmar y regresar</Text>
      </Pressable>

  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blueDark,
    alignItems: 'center',
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
  flex: 1,
  justifyContent: 'center', // Centrado vertical
  alignItems: 'center',     // Centrado horizontal
  paddingHorizontal: 20,
  gap: 20,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: 60,
  marginBottom: 20,
  width: '100%',
  },
  changeNameContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  menuButton: {
    padding: 10, // Añadimos un poco de padding al botón del menú para que sea más fácil de tocar
  },
  menuIcon: {
    fontSize: 20, // Hacemos el icono un poco más grande
    color: '#fff',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center', // Centramos el título dentro de su contenedor
  },
  title: {
    fontFamily: fonts.pressStart2P,
    fontSize: 22, // Un poco más grande para que destaque
    color: '#fff',
    textAlign: 'center',
  },
  changeNameContainer: {
    flexDirection: 'column',
    backgroundColor: colors.grayDark,
    width: 301,
    height: 109,
  },
  changeNameText: {
    fontFamily: fonts.pressStart2P,
    fontSize: 12,
    color: colors.orange,
    textAlign: 'left',
    alignSelf: 'flex-start', // Esto lo empuja a la izquierda
    marginTop: 25,           // Bajalo un poquito del borde superior
    marginLeft: 12,          // Un pelín de espacio a la izquierda
  },
  notificationsContainer: {
    backgroundColor: colors.grayDark,
    width: 301,
    height: 109,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: fonts.pressStart2P,
    fontSize: 12,
    color: colors.orange,
    marginBottom: 10,
  },
  notificationIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  notifIcon: {
    width: 35,
    height: 35,
  },
  deleteContainer: {
    backgroundColor: colors.grayDark,
    width: 301,
    height: 109,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  deleteTitle: {
    fontFamily: fonts.pressStart2P,
    fontSize: 11,
    color: colors.orange,
    marginBottom: 10,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: colors.red,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    fontFamily: fonts.pressStart2P,
    fontSize: 13,
    color: '#fff',
  },
  confirmButton: {
    marginTop: 40,
    backgroundColor: colors.purple,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: 301,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: fonts.pressStart2P,
    fontSize: 13,
    color: '#fff',
  },
  inputText: {
    fontFamily: fonts.pressStart2P,
    fontSize: 13,
    color: colors.white,
    textAlign: 'left',
  },
  titleAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // en vez de center
    gap: 20,
    width: '100%', // importante para que el justify funcione bien
    paddingHorizontal: 10, // un poco de margen interno
},

  inputIcon: {
    width: 39,
    height: 25,
    tintColor: colors.orange,
    marginTop: 18, // Espacio entre el texto y el icono
  },
});