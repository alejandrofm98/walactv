import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Filter, RefreshCw, Radio } from 'lucide-react-native';
import { EventCard } from '@/components/EventCard';
import { Event, Agenda } from '@/types';
import { router } from 'expo-router';
import { getLastEvent } from '@/services/eventService';

export default function HomeScreen() {
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterBy, setFilterBy] = useState<string>('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [categories, setCategories] = useState<string[]>(['all']);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const agenda = await getLastEvent();
      if (!agenda || !agenda.length) {
        setError(true);
        return;
      }
      setAgenda(agenda);
      setEvents(agenda[0].eventos);

      // Generar categorías únicas
      const unique = Array.from(
          new Set(agenda[0].eventos.map(e => e.categoria?.trim().toLowerCase()).filter(Boolean))
      ).sort();
      setCategories(['all', ...unique]);

      setError(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    if (event) {
      router.push({
        pathname: '/video',
        params: {
          enlaces: JSON.stringify(event.enlaces),
          eventName: event.titulo,
        },
      });
    }
  };

  const handleChannelPress = () => {};

  const isEventLive = (e: Event) => e.isLive === true;

  const getSortedAndFilteredEvents = () => {
    if (!events || events.length === 0) return [];

    let filtered = [...events];

    // Filtro por categoría
    if (filterBy !== 'all') {
      filtered = filtered.filter(
          e => e.categoria.toLowerCase() === filterBy.toLowerCase()
      );
    }

    // Filtro por "En Directo"
    if (liveOnly) {
      filtered = filtered.filter(isEventLive);
    }

    // Ordenar por hora por defecto
    return filtered.sort(
        (a, b) => new Date(a.hora).getTime() - new Date(b.hora).getTime()
    );
  };

  const liveEventsCount = events?.filter(isEventLive).length || 0;
  const filteredEvents = getSortedAndFilteredEvents();

  if (loading) {
    return (
        <SafeAreaView style={styles.container}>
          <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Eventos</Text>
            </View>
          </LinearGradient>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.loadingText}>Cargando eventos...</Text>
          </View>
        </SafeAreaView>
    );
  }

  if (error) {
    return (
        <SafeAreaView style={styles.container}>
          <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Eventos</Text>
            </View>
          </LinearGradient>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.reloadButton} onPress={loadEvents}>
              <RefreshCw size={20} color="#fff" />
              <Text style={styles.reloadButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
            colors={['#1A1A2E', '#16213E', '#0F3460']}
            style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}
              {filterBy !== 'all' && ` en ${filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}`}
              {liveOnly && ' • En directo'}
            </Text>
          </View>
        </LinearGradient>

        {/* FILTROS EN UNA SOLA LÍNEA */}
        <View style={styles.filtersContainer}>
          {/* Botón En Directo - Separado */}
          <View style={styles.liveSection}>
            <TouchableOpacity
                style={[styles.liveButton, liveOnly && styles.liveButtonActive]}
                onPress={() => setLiveOnly(prev => !prev)}
            >
              <Radio size={18} color={liveOnly ? "#ff4444" : "#B0B0B0"} />
              {liveEventsCount > 0 && (
                  <View style={styles.liveBadge}>
                    <Text style={styles.liveBadgeText}>{liveEventsCount}</Text>
                  </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Categorías */}
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
          >
            {categories.map(filter => (
                <TouchableOpacity
                    key={filter}
                    style={[styles.filterButton, filterBy === filter && styles.filterButtonActive]}
                    onPress={() => setFilterBy(filter)}
                >
                  <Text
                      style={[
                        styles.filterButtonText,
                        filterBy === filter && styles.filterButtonTextActive,
                      ]}
                  >
                    {filter === 'all' ? 'Todos' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={loadEvents} colors={['#1E88E5']} />
            }
        >
          {filteredEvents.map(event => (
              <EventCard
                  key={event.titulo}
                  event={event}
                  onPress={() => handleEventPress(event)}
                  onChannelPress={handleChannelPress}
              />
          ))}

          {filteredEvents.length === 0 && (
              <View style={styles.emptyContainer}>
                <Filter size={48} color="#666" />
                <Text style={styles.emptyText}>No se encontraron eventos</Text>
                <Text style={styles.emptySubtext}>
                  Prueba cambiando los filtros o la ordenación
                </Text>
              </View>
          )}
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { paddingTop: 20, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { alignItems: 'center' },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#B0B0B0', fontSize: 16, textAlign: 'center' },

  // Contenedor principal de filtros
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },

  // Sección de En Directo
  liveSection: {
    marginRight: 16,
  },

  // Botón En Directo
  liveButton: {
    backgroundColor: '#2A2A2A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  liveButtonActive: {
    backgroundColor: 'rgba(255,68,68,0.2)',
    borderColor: '#ff4444',
    shadowColor: '#ff4444',
    shadowOpacity: 0.4,
  },
  liveBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0A0A0A',
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Separador visual
  separator: {
    width: 2,
    height: 32,
    backgroundColor: '#444',
    marginRight: 16,
    borderRadius: 1,
  },

  // Scroll de categorías
  categoriesScroll: {
    flex: 1,
  },

  // Botones de filtro (categorías)
  filterButton: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 36,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(30,136,229,0.2)',
    borderColor: '#1E88E5',
  },
  filterButtonText: { color: '#B0B0B0', fontSize: 14, fontWeight: '600' },
  filterButtonTextActive: { color: '#1E88E5' },

  // Sección de Categorías
  categorySection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(30,136,229,0.2)',
    borderColor: '#1E88E5',
  },
  categoryButtonText: { color: '#B0B0B0', fontSize: 14, fontWeight: '600' },
  categoryButtonTextActive: { color: '#1E88E5' },

  // Indicador de filtros activos
  activeFiltersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#1A1A1A',
  },
  activeFiltersText: {
    color: '#B0B0B0',
    fontSize: 12,
    textAlign: 'center',
  },

  content: { flex: 1 },
  scrollContent: { padding: 20 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptySubtext: { color: '#B0B0B0', fontSize: 14, textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', fontSize: 16, marginTop: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#ff4444', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  reloadButton: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  reloadButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});