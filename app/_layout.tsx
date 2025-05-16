import Drawer from "expo-router/drawer";
import { AuthProvider } from '../contexts/AuthContext'; // Ajusta la ruta si cambia
import CustomDrawer from './(app)/(drawer)/CustomDrawer'; // Ajusta la ruta si cambia


export default function RootLayout() {
  return (
    <AuthProvider>
      <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#4F46E5',
          width: 260,
        },
      }}
      />
    </AuthProvider>
  );
}
