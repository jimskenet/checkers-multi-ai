import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GameSettingsProvider } from './game/gameSettingsContext';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded,error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Baloo: require('../assets/fonts/Baloo-Regular.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GameSettingsProvider>
        <StatusBar style="light" backgroundColor="#000000"/>
        <Stack>
          <Stack.Screen name="index" options={{title: 'Main Menu', headerShown: false}}/>
          <Stack.Screen name="board" options={{title: 'Play Now', headerShown: false}}/>
          <Stack.Screen name="difficulty" options={{title: 'Difficulty', headerShown: false}}/>
          <Stack.Screen name="+not-found" />
        </Stack>
      </GameSettingsProvider>
    </ThemeProvider>
  );
}
