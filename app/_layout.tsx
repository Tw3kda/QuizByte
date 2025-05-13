import { Stack } from "expo-router";
import { AuthProvider } from '../contexts/AuthContext'; // Ajusta la ruta si cambia


export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* No hace falta listar todos si están dentro de subcarpetas */} 
      </Stack>
    </AuthProvider>
  );
}
