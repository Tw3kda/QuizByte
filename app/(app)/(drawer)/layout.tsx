import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen name="Index" options={{ drawerLabel: 'Lobby', title: 'overview',}}/>
        <Drawer.Screen name="Perfil" options={{ drawerLabel: 'Perfil', title: 'overview', }}/>
        <Drawer.Screen name="Amigos" options={{ drawerLabel: 'Amigos', title: 'overview',}}/>
        <Drawer.Screen name="Notificaciones" options={{ drawerLabel: 'Notificaciones', title: 'overview',}}/>
        <Drawer.Screen name="Settings" options={{ drawerLabel: 'Configuración', title: 'overview',}}/>
        <Drawer.Screen name="CerrarSesion" options={{ drawerLabel: 'Cerrar sesión', title: 'overview',}}/>
      </Drawer>
    </GestureHandlerRootView>
  );
}
