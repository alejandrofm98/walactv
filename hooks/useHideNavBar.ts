import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

export function useHideNavBar() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    // initial hide
    NavigationBar.setVisibilityAsync('hidden');

    // re-hide whenever the bars become visible
    const sub = NavigationBar.addVisibilityListener(({ visibility }) => {
      if (visibility === 'visible') {
        NavigationBar.setVisibilityAsync('hidden');
      }
    });

    return () => sub.remove();
  }, []);
}