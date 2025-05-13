import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BlackButton2 from '../../components/blackButton2';
import TextInput from '../../components/textInput';
import colors from '../../constants/Colors';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          placeholder="Ingrese su Nombre"
          value={name}
          onChangeText={setName}
        />

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

      <BlackButton2
        title="Registrarse"
        onPress={() => console.log('Sign Up!')}
      />

      <TouchableOpacity>
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
    color: colors.purple,
    fontFamily: 'PressStart2P-Regular',
    fontSize: 8,
    marginTop: 16,
    textAlign: 'center',
  },
});
