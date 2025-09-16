import React, { useState, useEffect } from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Clock} from 'lucide-react-native';
import {Event} from '@/types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onChannelPress: (eventId: string, channelId: string) => void;
}

const images = {
  ciclismo: [
    require("../assets/images/ciclismo.webp"),
    require("../assets/images/ciclismo2.webp"),
    require("../assets/images/ciclismo3.webp"),
  ],
  beisbol: [
    require("../assets/images/beisbol.webp"),
    require("../assets/images/beisbol2.webp"),
    require("../assets/images/beisbol3.webp"),
  ],
  coches: [
    require("../assets/images/coches.webp"),
    require("../assets/images/coches2.webp"),
    require("../assets/images/coches3.webp"),
  ],
  futbol: [
    require("../assets/images/futbol.webp"),
    require("../assets/images/futbol2.webp"),
    require("../assets/images/futbol3.webp"),
  ],
  lucha: [
    require("../assets/images/lucha.webp"),
    require("../assets/images/lucha2.webp"),
    require("../assets/images/lucha3.webp"),
  ],
  motos: [
    require("../assets/images/motos.webp"),
    require("../assets/images/motos2.webp"),
    require("../assets/images/motos3.webp"),
  ],
  tenis: [
    require("../assets/images/tenis.webp"),
    require("../assets/images/tenis2.webp"),
    require("../assets/images/tenis3.webp"),
  ],
};

// Global state to track last used images per category
let lastUsedImages: { [key: string]: number } = {};

export function EventCard({ event, onPress, onChannelPress }: EventCardProps) {
  console.log("event", event);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const getRandomImage = (category: string) => {
    const categoryKey = category.toLowerCase();
    const categoryImages = images[categoryKey as keyof typeof images];

    if (!categoryImages || categoryImages.length === 0) {
      // Fallback to futbol images if category not found
      return images.futbol[0];
    }

    if (categoryImages.length === 1) {
      return categoryImages[0];
    }

    // Get available indices (excluding the last used one)
    const lastUsedIndex = lastUsedImages[categoryKey];
    const availableIndices = categoryImages
      .map((_, index) => index)
      .filter(index => index !== lastUsedIndex);

    // If all images have been used, reset and use any image except the last one
    const indicesToChooseFrom = availableIndices.length > 0 ? availableIndices :
      categoryImages.map((_, index) => index).filter(index => index !== lastUsedIndex);

    // If still no options (shouldn't happen with more than 1 image), use any
    const finalIndices = indicesToChooseFrom.length > 0 ? indicesToChooseFrom :
      categoryImages.map((_, index) => index);

    // Select random index
    const randomIndex = finalIndices[
      Math.floor(Math.random() * finalIndices.length)
    ];

    // Update last used image for this category
    lastUsedImages[categoryKey] = randomIndex;

    return categoryImages[randomIndex];
  };

  useEffect(() => {
    if (event.categoria) {
      const image = getRandomImage(event.categoria);
      setSelectedImage(image);
    }
  }, [event.categoria]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={selectedImage || images.futbol[0]} style={styles.image} />
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