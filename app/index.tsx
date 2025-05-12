import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // o un SplashScreen
  }

  return (
    <View>
      <Text style={{ fontFamily: 'PressStart2P-Regular' }}>
        ¡Pixelpower activado!
      </Text>
    </View>
  );
}
