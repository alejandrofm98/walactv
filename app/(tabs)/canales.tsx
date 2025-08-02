import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Play, Star, Users } from 'lucide-react-native';
import {useHideNavBar} from "@/hooks/useHideNavBar";
import {Enlace} from "@/types";
import {getCanales} from '@/services/eventService';

interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  rating: number;
  viewers: string;
  description: string;
  isLive: boolean;
}

export default function ChannelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [canales, setCanales] = useState<Enlace[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Enlace[]>(canales);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  useHideNavBar();

  const loadEvents = async () => {
    try {
      setLoading(true);
      const canales = await getCanales();
      if (!canales?.length) {
        setError(true);
        return;
      }
      setCanales(canales);
      setFilteredChannels(canales);
      setError(false);
    } catch (error) {
      console.error('Error loading channels:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChannels(canales);
    } else {
      const filtered = canales.filter(
        (canal) =>
            canal.canal.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChannels(filtered);
    }
  };

  const handleChannelPress = (enlaces: Enlace) => {
    // Navegar a la pantalla de detalles del canal
    const enlacesAux = [enlaces];
    router.push({
      pathname: '/video',
      params: {
        enlaces: JSON.stringify(enlacesAux),
        eventName: enlacesAux[0].canal,
      },
    });
  };

  const renderChannel = ({ item }: { item: Enlace }) => (
    <TouchableOpacity
      style={styles.channelCard}
      onPress={() => handleChannelPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Image
            source={{ uri: item.logo }}
            style={styles.channelLogo}
            resizeMode="contain"   // <-- para que entre completa y centrada
        />
        <View style={styles.channelInfo}>
          <View style={styles.channelHeader}>
            <Text style={styles.channelName} numberOfLines={1} ellipsizeMode="tail">
              {item.canal}
            </Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={styles.header}>
        <Text style={styles.title}>Canales Acestream</Text>
        <Text style={styles.subtitle}>
          {filteredChannels.length} canales disponibles
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar canales..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={handleSearch}
            selectionColor="#3b82f6"
          />
        </View>
      </View>

      {filteredChannels.length > 0 ? (
          <FlatList
              data={filteredChannels}
              renderItem={renderChannel}
              keyExtractor={(item) => item.canal}
              contentContainerStyle={styles.channelsList}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              refreshControl={
                <RefreshControl
                    refreshing={loading}            // estado que ya usas
                    onRefresh={loadEvents}          // la función que ya tienes
                    colors={['#1E88E5']}            // color del spinner (Android)
                    tintColor="#1E88E5"             // color del spinner (iOS)
                />
              }
          />
      ) : (
        <View style={styles.emptyContainer}>
          <Search size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>
            No se encontraron canales que coincidan con tu búsqueda
          </Text>
        </View>
      )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Matching video.tsx background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)', // Matching video.tsx border color
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff', // White text
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8', // Lighter text color
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b', // Slightly lighter than background
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)', // Matching video.tsx border color
  },
  searchIcon: {
    marginRight: 10,
    color: '#94a3b8', // Matching secondary text color
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff', // White text
    fontWeight: '400',
    padding: 0,
  },
  channelsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#0f172a',
  },
  channelCard: {
    backgroundColor: '#1e293b', // Slightly lighter than background
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)', // Subtle border
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  channelLogo: {
    width: 80,
    height: 60,
    borderRadius: 6,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  channelInfo: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444', // Brighter red for better visibility
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  channelCategory: {
    fontSize: 13,
    color: '#94a3b8', // Matching secondary text color
    marginBottom: 6,
    fontWeight: '500',
  },
  channelDescription: {
    fontSize: 13,
    color: '#cbd5e1', // Slightly lighter than secondary
    marginBottom: 10,
    lineHeight: 18,
  },
  channelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  channelRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#f59e0b', // Yellow for rating
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewersText: {
    color: '#94a3b8', // Matching secondary text color
    fontSize: 13,
    marginLeft: 4,
  },
  playButton: {
    backgroundColor: '#3b82f6', // Blue from video.tsx
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  playButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f172a',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  channelStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#94a3b8', // Matching secondary text color
    marginLeft: 4,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
});