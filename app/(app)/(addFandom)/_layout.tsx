import { Stack } from "expo-router";
import React from "react";

import { GeminiProvider } from "@/contexts/GeminiContext";
import { FandomProvider } from "../../../contexts/FandomContext";

export default function _layout() {
  return (
    <GeminiProvider>
      <FandomProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Search" options={{ headerShown: false }} />
          <Stack.Screen name="confirm" options={{ headerShown: false }} />
          <Stack.Screen name="camera" options={{ headerShown: false }} />
        </Stack>
      </FandomProvider>
    </GeminiProvider>
  );
}
