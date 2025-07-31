import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Play, Star, Users } from 'lucide-react-native';

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

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'Canal Uno',
    logo: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
    category: 'Noticias',
    rating: 4.5,
    viewers: '125K',
    description: 'Tu canal de noticias 24 horas',
    isLive: true,
  },
  {
    id: '2',
    name: 'Deportes Max',
    logo: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
    category: 'Deportes',
    rating: 4.8,
    viewers: '89K',
    description: 'El mejor contenido deportivo',
    isLive: true,
  },
  {
    id: '3',
    name: 'Cine Plus',
    logo: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
    category: 'Entretenimiento',
    rating: 4.3,
    viewers: '156K',
    description: 'Las mejores películas y series',
    isLive: false,
  },
  {
    id: '4',
    name: 'Música TV',
    logo: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
    category: 'Música',
    rating: 4.6,
    viewers: '78K',
    description: 'Videos musicales las 24 horas',
    isLive: true,
  },
  {
    id: '5',
    name: 'Discovery',
    logo: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
    category: 'Documentales',
    rating: 4.7,
    viewers: '92K',
    description: 'Documentales y naturaleza',
    isLive: true,
  },
  {
    id: '6',
    name: 'Kids Zone',
    logo: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
    category: 'Infantil',
    rating: 4.4,
    viewers: '201K',
    description: 'Contenido para toda la familia',
    isLive: true,
  },
];

export default function ChannelsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChannels, setFilteredChannels] = useState(mockChannels);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChannels(mockChannels);
    } else {
      const filtered = mockChannels.filter(
          (channel) =>
              channel.name.toLowerCase().includes(query.toLowerCase()) ||
              channel.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChannels(filtered);
    }
  };

  const handleChannelPress = (channel: Channel) => {
    // Navegar a la pantalla de detalles del canal
    router.push({
      pathname: '/channel/[id]',
      params: {
        id: channel.id,
        name: channel.name,
        logo: channel.logo,
        category: channel.category,
        rating: channel.rating.toString(),
        viewers: channel.viewers,
        description: channel.description,
        isLive: channel.isLive.toString(),
      },
    });
  };

  const renderChannel = ({ item }: { item: Channel }) => (
      <TouchableOpacity
          style={styles.channelCard}
          onPress={() => handleChannelPress(item)}
          activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Image source={{ uri: item.logo }} style={styles.channelLogo} />

          <View style={styles.channelInfo}>
            <View style={styles.channelHeader}>
              <Text style={styles.channelName}>{item.name}</Text>
              {item.isLive && (
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>EN VIVO</Text>
                  </View>
              )}
            </View>

            <Text style={styles.channelCategory}>{item.category}</Text>
            <Text style={styles.channelDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.channelStats}>
              <View style={styles.statItem}>
                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.statText}>{item.rating}</Text>
              </View>
              <View style={styles.statItem}>
                <Users size={14} color="#6b7280" />
                <Text style={styles.statText}>{item.viewers}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.playButton}>
            <Play size={18} color="#ffffff" fill="#ffffff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
  );

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <View style={styles.header}>
          <Text style={styles.title}>Canales de TV</Text>
          <Text style={styles.subtitle}>
            {filteredChannels.length} canales disponibles
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar canales..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <FlatList
            data={filteredChannels}
            renderItem={renderChannel}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.channelsList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#f9fafb',
    fontWeight: '400',
  },
  channelsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  channelCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  channelLogo: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  channelInfo: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  channelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  channelCategory: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 4,
  },
  channelDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 8,
  },
  channelStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  separator: {
    height: 1,
  },
});