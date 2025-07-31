import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useLocalSearchParams} from 'expo-router';
import {
  Animated,
  BackHandler,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {VLCPlayer} from 'react-native-vlc-media-player';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as NavigationBar from 'expo-navigation-bar';
import { Enlace } from '@/types';

const proxyUrl = 'https://walactv.walerike.com/proxy?url=';

export default function Video() {
  const { enlaces, eventName } = useLocalSearchParams();
  const enlacesStr = Array.isArray(enlaces) ? enlaces[0] : enlaces; // string | undefined
  const parsedEnlaces :Enlace[] = enlacesStr ? JSON.parse(enlacesStr) : [];
  const playerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screen, setScreen] = useState(Dimensions.get('screen'));
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<number | null>(null);
  const navigation = useNavigation();
  const [currentUri, setCurrentUri] = useState(proxyUrl + parsedEnlaces[0].m3u8[0]);
  const [activeChannel, setActiveChannel] = useState(0);
  const [activeStream, setActiveStream] = useState(0);

  const showControlsWithTimeout = () => {
    setControlsVisible(true);

    // Limpiar timeout anterior si existe
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    // Crear nuevo timeout de 5 segundos
    const timeout = setTimeout(() => {
      setControlsVisible(false);
    }, 5000); // Cambiado de 3000 a 5000 ms (5 segundos)

    setControlsTimeout(timeout);
  };

  // Efecto para mostrar controles inicialmente con timeout
  useEffect(() => {
    showControlsWithTimeout();

    // Limpiar timeout al desmontar el componente
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      setScreen(screen);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isFullscreen ? { display: 'none' } : undefined,
      headerShown: false,
    });
  }, [isFullscreen, navigation]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setHidden(isFullscreen, 'slide');
      if (isFullscreen) {
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setBehaviorAsync('inset-swipe');
      } else {
        NavigationBar.setVisibilityAsync('visible');
        NavigationBar.setBehaviorAsync('overlay-swipe');
      }
    } else {
      StatusBar.setHidden(isFullscreen);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const backAction = () => {
      if (isFullscreen) {
        exitFullscreen();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isFullscreen]);

  const exitFullscreen = () => {
    Orientation.lockToPortrait();
    setTimeout(() => {
      if (Platform.OS === 'android') {
        StatusBar.setHidden(false, 'slide');
        NavigationBar.setVisibilityAsync('visible');
        NavigationBar.setBehaviorAsync('overlay-swipe');
      } else {
        StatusBar.setHidden(false);
      }
    }, 100);
    setIsFullscreen(false);
    // Mostrar controles al salir de fullscreen
    showControlsWithTimeout();
  };

  const enterFullscreen = () => {
    Orientation.lockToLandscapeLeft();
    setTimeout(() => {
      if (Platform.OS === 'android') {
        StatusBar.setHidden(true, 'slide');
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setBehaviorAsync('inset-swipe');
      } else {
        StatusBar.setHidden(true);
      }
    }, 100);
    setIsFullscreen(true);
    // Mostrar controles al entrar en fullscreen
    showControlsWithTimeout();
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const togglePlayPause = () => {
    setPaused(p => !p);
    showControlsWithTimeout();
  };

  const handlePress = () => {
    if (controlsVisible) {
      // Si los controles están visibles, ocultarlos inmediatamente
      setControlsVisible(false);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    } else {
      // Si los controles están ocultos, mostrarlos con timeout
      showControlsWithTimeout();
    }
  };

  const handleFullscreenPress = () => {
    toggleFullscreen();
    showControlsWithTimeout();
  };

  const handleStreamChange = (channelIndex: React.SetStateAction<number>, streamIndex: React.SetStateAction<number>, url: string) => {
    setCurrentUri(proxyUrl + url);
    setActiveChannel(channelIndex);
    setActiveStream(streamIndex);
    // Mostrar controles brevemente al cambiar stream
    showControlsWithTimeout();
  };

  const StreamButton = ({ title, onPress, isActive, index }: any) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
          <TouchableOpacity
              style={[styles.streamButton, isActive && styles.activeStreamButton]}
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
          >
            <View style={styles.streamButtonContent}>
              <Icon
                  name="play-circle-outline"
                  size={20}
                  color={isActive ? '#ffffff' : '#64748b'}
                  style={styles.streamIcon}
              />
              <Text style={[styles.streamButtonText, isActive && styles.activeStreamButtonText]}>
                {title}
              </Text>
              {isActive && (
                  <View style={styles.activeIndicator}>
                    <Icon name="radio-button-checked" size={12} color="#10b981" />
                  </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
    );
  };

  return (
      <View style={isFullscreen ? styles.fullscreenContainer : styles.safeArea}>
        <StatusBar
            hidden={isFullscreen}
            backgroundColor="transparent"
            translucent={true}
            barStyle="light-content"
        />

        {!isFullscreen && eventName && (
            <View style={styles.titleContainer}>
              <Icon name="live-tv" size={24} color="#f59e0b" style={styles.titleIcon} />
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {eventName}
              </Text>
            </View>
        )}

        <Pressable onPress={handlePress} style={isFullscreen ? styles.fullscreenVideo : styles.videoContainer}>
          <VLCPlayer
              ref={playerRef}
              style={isFullscreen ? styles.fullscreenPlayer : styles.normalPlayer}
              paused={paused}
              source={{ uri: currentUri }}
          />

          {controlsVisible && (
              <>
                <View style={styles.centerControls}>
                  <TouchableOpacity onPress={togglePlayPause} style={styles.centerControlBtn}>
                    <Icon
                        name={paused ? 'play-arrow' : 'pause'}
                        size={80}
                        color="#ffffff"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.fullscreenControls}>
                  <TouchableOpacity onPress={handleFullscreenPress} style={styles.fullscreenBtn}>
                    <Icon
                        name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                        size={40}
                        color="#ffffff"
                    />
                  </TouchableOpacity>
                </View>
              </>
          )}
        </Pressable>

        {!isFullscreen && eventName && (
            <ScrollView style={styles.channelsContainer} showsVerticalScrollIndicator={false}>
              {parsedEnlaces.map((enlace : Enlace, channelIndex : number) => (
                  <View key={channelIndex} style={styles.channelSection}>
                    <View style={styles.channelTitleContainer}>
                      <Icon name="tv" size={20} color="#3b82f6" style={styles.channelIcon} />
                      <Text style={styles.channelTitle} numberOfLines={1} ellipsizeMode="tail">
                        {enlace.canal}
                      </Text>
                      <View style={styles.channelBadge}>
                        <Text style={styles.channelBadgeText}>{enlace.m3u8?.length || 0}</Text>
                      </View>
                    </View>

                    <View style={styles.streamsGrid}>
                      {enlace.m3u8 && enlace.m3u8.map((url : string, streamIndex : number) => (
                          <StreamButton
                              key={streamIndex}
                              title={`Opción ${streamIndex + 1}`}
                              onPress={() => handleStreamChange(channelIndex, streamIndex, url)}
                              isActive={activeChannel === channelIndex && activeStream === streamIndex}
                              index={streamIndex}
                          />
                      ))}
                    </View>
                  </View>
              ))}
            </ScrollView>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 999,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  titleIcon: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  videoContainer: {
    height: 240,
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 0,
    overflow: 'hidden',
  },
  fullscreenVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  normalPlayer: {
    width: '100%',
    height: '100%',
  },
  fullscreenPlayer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centerControls: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerControlBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fullscreenControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullscreenBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  channelsContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 8,
  },
  channelSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  channelTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  channelIcon: {
    marginRight: 8,
  },
  channelTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  channelBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  channelBadgeText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  streamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  streamButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
    marginBottom: 8,
    minWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeStreamButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  streamButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  streamIcon: {
    marginRight: 8,
  },
  streamButtonText: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  activeStreamButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  activeIndicator: {
    marginLeft: 8,
  },
});