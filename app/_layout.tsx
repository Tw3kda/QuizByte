import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* No hace falta listar todos si están dentro de subcarpetas */}
    </Stack>
  );
}
