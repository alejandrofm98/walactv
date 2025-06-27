import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteEvent } from '@/types';

const FAVORITES_KEY = 'favorite_events';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: FavoriteEvent[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = (eventId: string) => {
    const newFavorite: FavoriteEvent = {
      eventId,
      addedAt: new Date().toISOString(),
    };
    const updated = [...favorites, newFavorite];
    saveFavorites(updated);
  };

  const removeFromFavorites = (eventId: string) => {
    const updated = favorites.filter(fav => fav.eventId !== eventId);
    saveFavorites(updated);
  };

  const isFavorite = (eventId: string) => {
    return favorites.some(fav => fav.eventId === eventId);
  };

  const toggleFavorite = (eventId: string) => {
    if (isFavorite(eventId)) {
      removeFromFavorites(eventId);
    } else {
      addToFavorites(eventId);
    }
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}