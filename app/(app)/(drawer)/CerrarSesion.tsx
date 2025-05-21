import { Redirect } from 'expo-router'

export default function CerrarSesion() {
  return (
    Redirect ({ href: '/' }) // Redirige a la pantalla de inicio de sesión
  )
}