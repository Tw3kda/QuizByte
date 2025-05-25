import { LobbyProvider } from "@/contexts/LobbyContext";
import { Stack } from "expo-router";
import React from "react";

import { GeminiProvider } from "@/contexts/GeminiContext";

export default function _layout() {
  return (
    <GeminiProvider>
      <LobbyProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="JoinedLobby" options={{ headerShown: false }} />
          <Stack.Screen name="Lobby" options={{ headerShown: false }} />
          <Stack.Screen name="QR" options={{ headerShown: false }} />
          <Stack.Screen name="LobbyGuest" options={{ headerShown: false }} />
        </Stack>
      </LobbyProvider>
    </GeminiProvider>
  );
}
