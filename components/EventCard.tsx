import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Users, Play, Clock } from 'lucide-react-native';
import { Event } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onChannelPress: (eventId: string, channelId: string) => void;
}

export function EventCard({ event, onPress, onChannelPress }: EventCardProps) {
  console.log("event",event)


  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'deportes': return '#FF5722';
      case 'entretenimiento': return '#9C27B0';
      case 'noticias': return '#2196F3';
      case 'musica': return '#FF9800';
      default: return '#757575';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {/*<Image source={{ uri: event.thumbnail }} style={styles.image} />*/}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        
        {event.isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>EN VIVO</Text>
          </View>
        )}

        {/*<TouchableOpacity*/}
        {/*  style={[styles.favoriteButton, favorite && styles.favoriteActive]}*/}
        {/*  onPress={() => toggleFavorite(event.id)}*/}
        {/*>*/}
        {/*  <Heart*/}
        {/*    size={20}*/}
        {/*    color={favorite ? '#FF1744' : '#fff'}*/}
        {/*    fill={favorite ? '#FF1744' : 'transparent'}*/}
        {/*  />*/}
        {/*</TouchableOpacity>*/}

        <View style={styles.overlay}>
          {/*<View style={styles.categoryContainer}>*/}
          {/*  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>*/}
          {/*    /!*<Text style={styles.categoryText}>{event.category.toUpperCase()}</Text>*!/*/}
          {/*  </View>*/}
          {/*</View>*/}

          <View style={styles.infoContainer}>

            <View style={styles.timeContainer}>
              <Clock size={14} color="#fff" />
              <Text style={styles.timeText}>
                {event.hora}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{event.titulo}</Text>
        {/*<Text style={styles.description} numberOfLines={2}>{event.description}</Text>*/}
        <Text style={styles.description} numberOfLines={2}>Descripción</Text>

        <View style={styles.channelsContainer}>
          <Text style={styles.channelsLabel}>Canales disponibles:</Text>
          {/*<View style={styles.channelsList}>*/}
          {/*  {event.enlaces.slice(0, 3).map((channel, index) => (*/}
          {/*    <TouchableOpacity*/}
          {/*      key={channel.id}*/}
          {/*      style={styles.channelButton}*/}
          {/*      onPress={() => onChannelPress(event.id, channel.id)}*/}
          {/*    >*/}
          {/*      <Play size={12} color="#1E88E5" />*/}
          {/*      <Text style={styles.channelName}>{channel.name}</Text>*/}
          {/*      <Text style={styles.linksCount}>({channel.links.length})</Text>*/}
          {/*    </TouchableOpacity>*/}
          {/*  ))}*/}
          {/*  {event.channels.length > 3 && (*/}
          {/*    <Text style={styles.moreChannels}>+{event.channels.length - 3} más</Text>*/}
          {/*  )}*/}
          {/*</View>*/}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF1744',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteActive: {
    backgroundColor: 'rgba(255,23,68,0.2)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  channelsContainer: {
    marginTop: 8,
  },
  channelsLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  channelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,136,229,0.1)',
    borderColor: '#1E88E5',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  channelName: {
    color: '#1E88E5',
    fontSize: 12,
    fontWeight: '600',
  },
  linksCount: {
    color: '#1E88E5',
    fontSize: 10,
    opacity: 0.7,
  },
  moreChannels: {
    color: '#B0B0B0',
    fontSize: 12,
    alignSelf: 'center',
    marginLeft: 8,
  },
});