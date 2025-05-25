import { Image, View } from 'react-native';

export default function App() {


  return (
    <View style={{ flex: 1, backgroundColor: "#111721", justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <Image
        source={require('../assets/images/QuizByte-Logo.png')}
        style={{ width: 337, height: 337 }}
        resizeMode="contain">
      </Image>

    </View>
  );
}
