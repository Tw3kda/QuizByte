import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="Index"
          options={{
            drawerLabel: 'Lobby',
            title: 'Lobby',
          }}
        />
        <Drawer.Screen
          name="Perfil"
          options={{
            drawerLabel: 'Perfil',
            title: 'Perfil',
          }}
        />
        <Drawer.Screen
          name="Amigos"
          options={{
            drawerLabel: 'Amigos',
            title: 'Amigos',
          }}
        />
        <Drawer.Screen
          name="Notificaciones"
          options={{
            drawerLabel: 'Notificaciones',
            title: 'Notificaciones',
          }}
        />
        <Drawer.Screen
          name="Settings"
          options={{
            drawerLabel: 'Configuración',
            title: 'Ajustes',
          }}
        />
        <Drawer.Screen
          name="logout"
          options={{
            drawerLabel: 'Cerrar sesión',
            title: 'cerrar sesión',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
