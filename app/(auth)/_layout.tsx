import { AuthProvider } from '@/contexts/AuthContext'
import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* No hace falta listar todos si están dentro de subcarpetas */} 
      </Stack>
    </AuthProvider>
  )
}