import colors from "@/constants/Colors";
import { FriendProvider } from "@/contexts/FriendsContext";
import Drawer from "expo-router/drawer";
import { AuthProvider } from '../contexts/AuthContext'; // Ajusta la ruta si cambia
import CustomDrawer from './(app)/(drawer)/CustomDrawer'; // Ajusta la ruta si cambia


export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
