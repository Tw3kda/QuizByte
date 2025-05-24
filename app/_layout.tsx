import colors from "@/constants/Colors";
import { FriendProvider } from "@/contexts/FriendsContext";
import { NotificationProvider } from "@/contexts/NotifcationContext";
import Drawer from "expo-router/drawer";
import { AuthProvider } from '../contexts/AuthContext'; // Ajusta la ruta si cambia
import CustomDrawer from './(app)/(drawer)/CustomDrawer'; // Ajusta la ruta si cambia


export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <FriendProvider userId={""}>
          <Drawer
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
            headerShown: false,
            drawerStyle: {
            backgroundColor: colors.purple,
            width: 260,
            },
          }}
          />
        </FriendProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
