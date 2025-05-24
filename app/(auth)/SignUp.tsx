  import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BlackButton from '../../components/blackButton';
import TextInput from '../../components/textInput';
import colors from '../../constants/Colors';
import { AuthContext } from '../../contexts/AuthContext'; // Ajusta el path si es necesario

  export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const authContext = useContext(AuthContext);

    const handleSignUp = async () => {
      if (!authContext) return;
      const user = await authContext.register(email, password, name);
      if (!user) {
        Alert.alert("Error", "No se pudo registrar el usuario");
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            placeholder="Ingrese su Nombre"
            value={name}
            onChangeText={setName}
            width={278}
            height={55}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Ingrese su Email"
            value={email}
            onChangeText={setEmail}
            width={278}
            height={55}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="Ingresa su contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            width={278}
            height={55} 
          />
        </View>

        <BlackButton
          title="Registrarse"
          color={colors.orange}
          onPress={handleSignUp}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/LogIn')}>
          <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#111827',
      paddingHorizontal: 24,
      paddingTop: 80,
      alignItems: 'center',
    },
    title: {
      color: colors.white,
      fontFamily: 'PressStart2P-Regular',
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 50,
      lineHeight: 28,
    },
    subtitle: {
      color: colors.grayLight,
      fontFamily: 'PressStart2P-Regular',
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 32,
      width: 280,
    },
    inputGroup: {
      width: '100%',
      maxWidth: 280, // opcional, para que no se estire tanto
      alignItems: 'flex-start',
      alignSelf: 'center',
      marginBottom: 24,
    },
    label: {
      color: colors.white,
      fontFamily: 'PressStart2P-Regular',
      fontSize: 12,
      textAlign: 'left',
    },
    link: {
      color: colors.purple,
      fontFamily: 'PressStart2P-Regular',
      fontSize: 8,
      marginTop: 16,
      textAlign: 'center',
    },
  });
