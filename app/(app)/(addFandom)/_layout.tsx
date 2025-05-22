import { Stack } from "expo-router";
import React from "react";

import { FandomProvider } from "../../../contexts/FandomContext";

export default function _layout() {
  return (
    <FandomProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="confirm" options={{ headerShown: false }} />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
      </Stack>
    </FandomProvider>
  );
}
