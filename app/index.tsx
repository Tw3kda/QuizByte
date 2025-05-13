import BlackButton from '@/components/blackButton';
import BlackButton2 from '@/components/blackButton2';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { Image, View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // o un SplashScreen
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#111721", justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <Image
        source={require('../assets/images/QuizByte-Logo.png')}
        style={{ width: 337, height: 337 }}
        resizeMode="contain">
      </Image>

      <BlackButton2 title="Registrar" onPress={() => router.push('/(auth)/SignUp')} />

      <BlackButton title="Iniciar Sesión" onPress={() => router.push('/(auth)/LogIn')} />
    </View>
  );
}
