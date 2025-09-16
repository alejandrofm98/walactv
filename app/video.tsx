import React, {useEffect, useRef, useState} from 'react';
import {activateKeepAwakeAsync, deactivateKeepAwake} from 'expo-keep-awake';
import {useLocalSearchParams} from 'expo-router';
import {
  Alert,
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
import CastContext, {
  CastButton,
  MediaHlsSegmentFormat,
  MediaHlsVideoSegmentFormat,
  MediaStreamType,
  PlayServicesState,
  useCastSession,
  useRemoteMediaClient,
} from 'react-native-google-cast';
import {Enlace} from '@/types';
import {useNavigation} from '@react-navigation/native';
import ChannelsList from '@/components/ChannelsList';
import {useHideNavBar} from '@/hooks/useHideNavBar';


export default function Video() {
  const {enlaces, eventName} = useLocalSearchParams();
  const enlacesStr = Array.isArray(enlaces) ? enlaces[0] : enlaces;
  const parsedEnlaces: Enlace[] = enlacesStr ? JSON.parse(enlacesStr) : [];
  const playerRef = useRef<any>(null);

  const [paused, setPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUri, setCurrentUri] = useState(parsedEnlaces[0]?.m3u8[0] || '');
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const navigation = useNavigation();
  const [activeChannel, setActiveChannel] = useState(0);
  const [activeStream, setActiveStream] = useState(0);

  // Google Cast
  const castSession = useCastSession();
  const client = useRemoteMediaClient();
  const isCasting = !!castSession;

  const [clientReady, setClientReady] = useState(false);

  useHideNavBar();

  // Google Play Services check en Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      CastContext.getPlayServicesState().then((state) => {
        if (state && state !== PlayServicesState.SUCCESS) {
          CastContext.showPlayServicesErrorDialog(state);
        }
      });
    }
  }, []);

  // Detectar cuando el cliente está listo
  useEffect(() => {
    if (client && typeof client.loadMedia === 'function') {
      console.log('Cliente listo para cargar media');
      setClientReady(true);
    } else {
      console.log('Cliente NO listo');
      setClientReady(false);
    }
  }, [client, castSession]);

  // Auto-cast cuando hay sesión activa
  useEffect(() => {
    if (clientReady && isCasting && currentUri) {
      const timer = setTimeout(() => {
        console.log('Cargando media automáticamente en Chromecast:', currentUri);
        loadMediaToCast(currentUri);
      }, 1000); // delay importante para evitar "No media selected"
      return () => clearTimeout(timer);
    }
  }, [clientReady, isCasting, currentUri]);

  // Configuración de navegación
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isFullscreen ? {display: 'none'} : undefined,
      headerShown: false,
    });
  }, [isFullscreen, navigation]);

  const handleStreamChange = (channelIndex: number, streamIndex: number, url: string) => {
    setCurrentUri(url);
    setActiveChannel(channelIndex);
    setActiveStream(streamIndex);
    setPaused(false);

    if (clientReady && isCasting) {
      setTimeout(() => loadMediaToCast(url), 800);
    }
  };

  // Función para cargar media en Chromecast
  const loadMediaToCast = async (uri?: string) => {
    if (!clientReady || !client || !castSession) {
      console.warn('Cliente de Chromecast no está listo todavía');
      return;
    }

    try {
      const videoUri = uri || currentUri;
      if (!videoUri) {
        console.warn('No hay URI de video para castear');
        return;
      }

      const title = `${eventName} - ${parsedEnlaces[activeChannel]?.canal || 'Canal'}`;
      console.log('Enviando a Chromecast:', videoUri);


    await client.loadMedia({
      mediaInfo: {
        contentUrl: videoUri,
        contentType: "video/mp2t",
        hlsSegmentFormat: MediaHlsSegmentFormat.TS,
        hlsVideoSegmentFormat: MediaHlsVideoSegmentFormat.MPEG2_TS,
        metadata: { title: "AceStream Live", type: "generic" },
        streamType: MediaStreamType.LIVE
      },
      autoplay: true,
    });

      console.log('✅ Media cargada en Chromecast');
    } catch (error) {
      console.error('❌ Error cargando media en Chromecast:', error);
      Alert.alert('Error', 'No se pudo cargar el video en Chromecast');
    }
  };

  // Control de reproducción Cast
  const toggleCastPlayback = async () => {
    if (!clientReady || !client) return;

    try {
      const mediaStatus = await client.getMediaStatus();
      if (mediaStatus?.playerState === 'playing') {
        await client.pause();
      } else {
        await client.play();
      }
    } catch (error) {
      console.error('Error controlando playback en Chromecast:', error);
    }
  };

  // Helpers UI
  const resetControlsTimer = () => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    setControlsVisible(true);
    controlsTimeout.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  const togglePlayPause = () => {
    if (isCasting && clientReady) toggleCastPlayback();
    else setPaused((p) => !p);
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    if (isCasting) return;
    isFullscreen ? exitFullscreen() : enterFullscreen();
    resetControlsTimer();
  };

  const enterFullscreen = () => {
    Orientation.lockToLandscapeLeft();
    setIsFullscreen(true);
  };
  const exitFullscreen = () => {
    Orientation.lockToPortrait();
    setIsFullscreen(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        exitFullscreen();
        return true;
      }
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

  return (
      <View style={isFullscreen ? styles.fullscreenContainer : styles.safeArea}>
        <StatusBar hidden={isFullscreen} backgroundColor="transparent" translucent
                   barStyle="light-content"/>

        {!isFullscreen && eventName && (
            <View style={styles.titleContainer}>
              <Icon name="live-tv" size={24} color="#f59e0b" style={styles.titleIcon}/>
              <Text style={styles.title}>{eventName}</Text>

              <View style={styles.castButtonContainer}>
                {isCasting && (
                    <View style={styles.castStatusContainer}>
                      <Icon name="cast-connected" size={20} color="#10b981"/>
                      <Text
                          style={styles.castStatusText}>{clientReady ? 'Conectado' : 'Conectando...'}</Text>
                    </View>
                )}
                <CastButton style={styles.castButton}/>
              </View>
            </View>
        )}

        <Pressable style={isFullscreen ? styles.fullscreenVideo : styles.videoContainer}
                   onPress={resetControlsTimer}>
          {!isCasting ? (
              <VLCPlayer
                  ref={playerRef}
                  style={isFullscreen ? styles.fullscreenPlayer : styles.normalPlayer}
                  source={{uri: currentUri}}
                  paused={paused}
                  resizeMode="fill"
                  onPlaying={() => activateKeepAwakeAsync()}
                  onPaused={() => deactivateKeepAwake()}
                  onStopped={() => deactivateKeepAwake()}
                  onEnd={() => deactivateKeepAwake()}
              />
          ) : (
              <View style={styles.castingView}>
                <Icon name="cast-connected" size={80} color="#10b981"/>
                <Text style={styles.castingText}>Transmitiendo a Chromecast</Text>
                <Text style={styles.castingSubtext}>{eventName}</Text>
                <Text
                    style={styles.castingChannel}>{parsedEnlaces[activeChannel]?.canal || 'Canal'}</Text>
                {!clientReady && <Text style={styles.castingStatus}>Inicializando cliente...</Text>}
              </View>
          )}

          {controlsVisible && (
              <>
                <View style={styles.centerControls}>
                  <TouchableOpacity onPress={togglePlayPause} style={styles.centerControlBtn}>
                    <Icon name={paused ? 'play-arrow' : 'pause'} size={80} color="#ffffff"/>
                  </TouchableOpacity>
                </View>
                <View style={styles.fullscreenControls}>
                  {isFullscreen && (
                      <TouchableOpacity
                          onPress={() => clientReady && loadMediaToCast()}
                          style={[styles.fullscreenBtn, isCasting && styles.castActiveBtn, !clientReady && styles.disabledBtn]}
                          disabled={!clientReady}
                      >
                        <Icon
                            name={isCasting ? 'cast-connected' : 'cast'}
                            size={40}
                            color={isCasting ? '#10b981' : clientReady ? '#ffffff' : '#666666'}
                        />
                      </TouchableOpacity>
                  )}
                  {!isCasting && (
                      <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenBtn}>
                        <Icon name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} size={40}
                              color="#ffffff"/>
                      </TouchableOpacity>
                  )}
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

// estilos iguales a los que ya tienes
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  fullscreenContainer: {...StyleSheet.absoluteFillObject, backgroundColor: 'black'},
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  titleIcon: {marginRight: 12},
  title: {flex: 1, color: '#ffffff', fontSize: 18, fontWeight: '700', lineHeight: 24},
  castButtonContainer: {flexDirection: 'row', alignItems: 'center'},
  castStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
  },
  castStatusText: {color: '#10b981', fontSize: 12, fontWeight: '600', marginLeft: 4},
  castButton: {width: 40, height: 40, tintColor: '#ffffff'},
  videoContainer: {
    height: 240,
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 0,
    overflow: 'hidden'
  },
  fullscreenVideo: {flex: 1, width: '100%', height: '100%', backgroundColor: 'black'},
  normalPlayer: {width: '100%', height: '100%'},
  fullscreenPlayer: {flex: 1, width: '100%', height: '100%'},
  castingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 20
  },
  castingText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center'
  },
  castingSubtext: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500'
  },
  castingChannel: {
    color: '#10b981',
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600'
  },
  castingStatus: {
    color: '#f59e0b',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  centerControls: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -60}, {translateY: -60}],
    justifyContent: 'center',
    alignItems: 'center'
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
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  fullscreenControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  fullscreenBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  castActiveBtn: {
    borderColor: 'rgba(16, 185, 129, 0.5)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)'
  },
  disabledBtn: {opacity: 0.5, backgroundColor: 'rgba(0, 0, 0, 0.3)'},
});
