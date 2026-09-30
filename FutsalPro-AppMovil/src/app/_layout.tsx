import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after initialization
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#090d16' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Torneos' }} />
        <Stack.Screen
          name="login"
          options={{
            title: 'Iniciar Sesión',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="torneo/[id]"
          options={{
            title: 'Detalle de Torneo',
          }}
        />
        <Stack.Screen
          name="perfil"
          options={{
            title: 'Perfil',
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
