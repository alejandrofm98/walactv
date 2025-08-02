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
      if (!agenda?.length) {
        setError(true);
        return;
      }
      setAgenda(agenda);
      setEvents(agenda[0].eventos);

      // Generar categorías únicas
      const unique = Array.from(
          new Set(agenda[0].eventos.map(e => e.categoria?.trim().toLowerCase()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, 'es', {sensitivity: 'base'}));
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
  container: { 
    flex: 1, 
    backgroundColor: '#0f172a' // Matching video.tsx background
  },
  header: { 
    paddingTop: 20, 
    paddingBottom: 16, 
    paddingHorizontal: 20,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)' // Matching video.tsx border color
  },
  headerContent: { 
    alignItems: 'center' 
  },
  title: { 
    color: '#ffffff', 
    fontSize: 24, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginBottom: 4 
  },
  subtitle: { 
    color: '#94a3b8', 
    fontSize: 14, 
    textAlign: 'center' 
  },

  // Contenedor principal de filtros
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.1)',
  },

  // Sección de En Directo
  liveSection: {
    marginRight: 12,
  },

  // Botón En Directo
  liveButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  liveButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
  },
  liveBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0f172a',
  },
  liveBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    includeFontPadding: false,
  },

  // Separador visual
  separator: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },

  // Scroll de categorías
  categoriesScroll: {
    flex: 1,
  },

  // Botones de filtro (categorías)
  filterButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 32,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
  filterButtonText: { 
    color: '#94a3b8', 
    fontSize: 13, 
    fontWeight: '500',
    textAlign: 'center',
  },
  filterButtonTextActive: { 
    color: '#3b82f6',
    fontWeight: '600',
  },

  // Sección de Categorías
  categorySection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterSectionTitle: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 4,
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  categoryButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
  categoryButtonText: { 
    color: '#94a3b8', 
    fontSize: 13, 
    fontWeight: '500',
  },
  categoryButtonTextActive: { 
    color: '#3b82f6',
    fontWeight: '600',
  },

  // Indicador de filtros activos
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  activeFiltersText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },

  content: { 
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: { 
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#0f172a',
  },
  emptyText: { 
    color: '#e2e8f0', 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 20, 
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: { 
    color: '#94a3b8', 
    fontSize: 14, 
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: { 
    color: '#94a3b8', 
    fontSize: 14, 
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24,
    backgroundColor: '#0f172a',
  },
  errorText: { 
    color: '#ef4444', 
    fontSize: 15, 
    marginBottom: 20, 
    textAlign: 'center',
    lineHeight: 22,
  },
  reloadButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  reloadButtonText: { 
    color: '#ffffff', 
    fontSize: 15, 
    fontWeight: '600', 
    marginLeft: 8,
  },
});