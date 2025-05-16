import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BlackButton from '../../components/blackButton';
import TextInput from '../../components/textInput';
import colors from '../../constants/Colors';
import { AuthContext } from '../../contexts/AuthContext'; // Ajusta el path si es necesario

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    if (!authContext) return;
    const success = await authContext.login(email, password);
    if (!success) {
      Alert.alert("Error", "Correo o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido{'\n'}de nuevo</Text>

      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Ingrese su Email"
          value={email} 
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Ingresa su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <BlackButton
        title="Iniciar Sesión"
        color={colors.purple}
        onPress={handleLogin}
      />

      <TouchableOpacity onPress={() => router.push('/(auth)/SignUp')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
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
    color: colors.orange,
    fontFamily: 'PressStart2P-Regular',
    fontSize: 8,
    marginTop: 16,
    textAlign: 'center',
  },
});
