import React, { useEffect, useState } from 'react';
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
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Play, Calendar, Clock } from 'lucide-react-native';
import { useHideNavBar } from "@/hooks/useHideNavBar";

interface Repeticion {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  duration: string;
  date: string;
  description: string;
  url: string;
}

export default function RepeticionesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [repeticiones, setRepeticiones] = useState<Repeticion[]>([]);
  const [filteredRepeticiones, setFilteredRepeticiones] = useState<Repeticion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useHideNavBar();

  // Mock data - replace with actual API call
  const mockRepeticiones: Repeticion[] = [
    {
      id: '1',
      title: 'Real Madrid vs Barcelona - El Clásico',
      thumbnail: 'https://via.placeholder.com/300x200/1e293b/ffffff?text=Real+Madrid+vs+Barcelona',
      category: 'Fútbol',
      duration: '2:15:30',
      date: '2024-01-15',
      description: 'El clásico más esperado del año entre Real Madrid y Barcelona',
      url: 'acestream://example1'
    },
    {
      id: '2',
      title: 'Manchester United vs Liverpool',
      thumbnail: 'https://via.placeholder.com/300x200/1e293b/ffffff?text=Man+United+vs+Liverpool',
      category: 'Fútbol',
      duration: '2:05:45',
      date: '2024-01-14',
      description: 'Partido de la Premier League entre dos grandes rivales',
      url: 'acestream://example2'
    },
    {
      id: '3',
      title: 'Lakers vs Warriors - NBA',
      thumbnail: 'https://via.placeholder.com/300x200/1e293b/ffffff?text=Lakers+vs+Warriors',
      category: 'Baloncesto',
      duration: '2:30:15',
      date: '2024-01-13',
      description: 'Partido de temporada regular de la NBA',
      url: 'acestream://example3'
    },
    {
      id: '4',
      title: 'Champions League Final',
      thumbnail: 'https://via.placeholder.com/300x200/1e293b/ffffff?text=Champions+League+Final',
      category: 'Fútbol',
      duration: '2:20:45',
      date: '2024-01-12',
      description: 'La final más esperada de la Champions League',
      url: 'acestream://example4'
    },
  ];

  const loadRepeticiones = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRepeticiones(mockRepeticiones);
      setFilteredRepeticiones(mockRepeticiones);
      setError(false);
    } catch (error) {
      console.error('Error loading repeticiones:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepeticiones();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredRepeticiones(repeticiones);
    } else {
      const filtered = repeticiones.filter(
        (repeticion) =>
          repeticion.title.toLowerCase().includes(query.toLowerCase()) ||
          repeticion.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRepeticiones(filtered);
    }
  };

  const handleRepeticionPress = (repeticion: Repeticion) => {
    // Navigate to video player with replay data
    router.push({
      pathname: '/video',
      params: {
        enlaces: JSON.stringify([{
          canal: repeticion.title,
          logo: repeticion.thumbnail,
          enlace: repeticion.url
        }]),
        eventName: repeticion.title,
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderRepeticion = ({ item }: { item: Repeticion }) => (
    <TouchableOpacity
      style={styles.repeticionCard}
      onPress={() => handleRepeticionPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Play size={24} color="#ffffff" style={styles.playIcon} />
        </View>
        <View style={styles.repeticionInfo}>
          <Text style={styles.repeticionTitle} numberOfLines={2} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.repeticionCategory}>{item.category}</Text>
          <Text style={styles.repeticionDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.repeticionFooter}>
            <View style={styles.dateContainer}>
              <Calendar size={14} color="#94a3b8" />
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Clock size={14} color="#94a3b8" />
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={styles.header}>
        <Text style={styles.title}>Repeticiones</Text>
        <Text style={styles.subtitle}>
          {filteredRepeticiones.length} repeticiones disponibles
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar repeticiones..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={handleSearch}
            selectionColor="#3b82f6"
          />
        </View>
      </View>

      {filteredRepeticiones.length > 0 ? (
        <FlatList
          data={filteredRepeticiones}
          renderItem={renderRepeticion}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.repeticionesList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadRepeticiones}
              colors={['#1E88E5']}
              tintColor="#1E88E5"
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Search size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>
            No se encontraron repeticiones que coincidan con tu búsqueda
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  searchIcon: {
    marginRight: 10,
    color: '#94a3b8',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '400',
    padding: 0,
  },
  repeticionesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#0f172a',
  },
  repeticionCard: {
    backgroundColor: '#1e293b',
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
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  cardContent: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#1e293b',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    borderRadius: 25,
    padding: 15,
  },
  repeticionInfo: {
    padding: 16,
  },
  repeticionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 24,
  },
  repeticionCategory: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 8,
    fontWeight: '500',
  },
  repeticionDescription: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 12,
    lineHeight: 20,
  },
  repeticionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#94a3b8',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    color: '#94a3b8',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
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
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 8,
  },
});