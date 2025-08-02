import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import {useColorScheme} from '@/hooks/useColorScheme';

import {ForceUpdateModal, useForceUpdate} from "@/utils/autoUpdate";
import {useEffect, useState} from "react";
import {Platform, View} from "react-native";
import * as NavigationBar from 'expo-navigation-bar';
import {useHideNavBar} from "@/hooks/useHideNavBar";

export default function RootLayout() {
  const [checked, setChecked] = useState(false);
  const { needsUpdate, apkUrl, remoteVersion } = useForceUpdate();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useHideNavBar();

  // 1. Mark check as finished once
  useEffect(() => {
    setChecked(true);
  }, []);

  // 2. Decide what to show AFTER all hooks have run
  if (!checked || !loaded) {
    // still loading (fonts or update check)
    return <View style={{ flex: 1 }} />;
  }

  if (needsUpdate && apkUrl) {
    return <ForceUpdateModal remoteVersion={remoteVersion} apkUrl={apkUrl} />;
  }

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
          <Stack.Screen name="+not-found"/>
        </Stack>
        <StatusBar hidden={true}/>
      </ThemeProvider>
  );
}
