import React, {useEffect, useRef, useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {
  BackHandler,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {VLCPlayer} from 'react-native-vlc-media-player';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Enlace} from '@/types';
import {useNavigation} from "@react-navigation/native";
import ChannelsList from "@/components/ChannelsList";
import {useHideNavBar} from "@/hooks/useHideNavBar";

export default function Video() {
  const { enlaces, eventName } = useLocalSearchParams();
  const enlacesStr = Array.isArray(enlaces) ? enlaces[0] : enlaces;
  const parsedEnlaces: Enlace[] = enlacesStr ? JSON.parse(enlacesStr) : [];
  const playerRef = useRef<any>(null);

  const [paused, setPaused]   = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUri, setCurrentUri] = useState(parsedEnlaces[0].m3u8[0]);
  const [controlsVisible, setControlsVisible] = useState(true);
  let controlsTimeout = useRef<number | null>(null);
  const navigation = useNavigation();
  const [activeChannel, setActiveChannel] = useState(0);
  const [activeStream, setActiveStream] = useState(0);

  useHideNavBar();


  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isFullscreen ? { display: 'none' } : undefined,
      headerShown: false,
    });
  }, [isFullscreen, navigation]);

  const handleStreamChange = (channelIndex: number, streamIndex: number, url: string) => {
    setCurrentUri(url);
    setActiveChannel(channelIndex);
    setActiveStream(streamIndex);
    setPaused(false);
  };

  /* ---- helpers ---- */
  const resetControlsTimer = () => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    setControlsVisible(true);
    controlsTimeout.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  const togglePlayPause = () => {
    setPaused((p) => !p);
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    isFullscreen ? exitFullscreen() : enterFullscreen();
    resetControlsTimer();
  };

  /* ---- fullscreen ---- */
  const enterFullscreen = () => {
    Orientation.lockToLandscapeLeft();
    setIsFullscreen(true);
  };
  const exitFullscreen = () => {
    Orientation.lockToPortrait();
    setIsFullscreen(false);
  };

  /* ---- efectos ---- */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) { exitFullscreen(); return true; }
      return false;
    });
    return backHandler.remove;
  }, [isFullscreen]);

  useEffect(() => {
    if (Platform.OS === 'android') StatusBar.setHidden(isFullscreen, 'slide');
    else StatusBar.setHidden(isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleOrientation = (o: string) => {
      if (o.startsWith('LANDSCAPE')) setIsFullscreen(true);
      if (o === 'PORTRAIT') setIsFullscreen(false);
    };
    Orientation.addOrientationListener(handleOrientation);
    return () => Orientation.removeOrientationListener(handleOrientation);
  }, []);

  /* ---- render ---- */
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

        <Pressable style={isFullscreen ? styles.fullscreenVideo : styles.videoContainer} onPress={resetControlsTimer}>
          <VLCPlayer
              ref={playerRef}
              style={isFullscreen ? styles.fullscreenPlayer : styles.normalPlayer}
              source={{ uri: currentUri }}
              paused={paused}
              resizeMode="fill"
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
                  <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenBtn}>
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
            <ChannelsList
                enlaces={parsedEnlaces}
                activeChannel={activeChannel}
                activeStream={activeStream}
                onStreamChange={handleStreamChange}
            />
        )}
      </View>
  );
}

/* ---- estilos ---- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  fullscreenContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },

  playBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 30,
    padding: 8,
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