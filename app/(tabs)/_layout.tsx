import {Tabs} from 'expo-router';
import React, {useEffect} from 'react';
import {Platform} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {CalendarDays, Tv} from "lucide-react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useHideNavBar } from '@/hooks/useHideNavBar';

export default function TabLayout() {
  useHideNavBar();

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color }) => <CalendarDays size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="canales"
        options={{
          title: 'Canales',
          tabBarIcon: ({ color }) => <Tv size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
