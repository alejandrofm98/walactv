import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';

const API_VERSION_URL = 'https://walactv.walerike.com/manifest.json';

/* -----------------------------------------------------------
   Hook
   ----------------------------------------------------------- */
export function useForceUpdate() {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [remoteVersion, setRemoteVersion] = useState<string>('');

  useEffect(() => {
    if (__DEV__) return; // skip during dev
    check();
  }, []);

  const check = async () => {
    try {
      const res = await fetch(API_VERSION_URL);
      const data = await res.json();
      const currentVersion = DeviceInfo.getVersion();
      const remoteV = data.android.version;
      if (compareVersions(remoteV, currentVersion) > 0) {
        const url = await getApkUrlByArchitecture(data.android.architectures);
        if (url) {
          setRemoteVersion(remoteV);
          setApkUrl(url);
          setNeedsUpdate(true);
        }
      }
    } catch (e) {
      console.error('Error al buscar actualización:', e);
    }
  };

  return { needsUpdate, apkUrl, remoteVersion };
}

/* -----------------------------------------------------------
   Modal
   ----------------------------------------------------------- */
export function ForceUpdateModal({
                                   remoteVersion,
                                   apkUrl,
                                 }: {
  remoteVersion: string;
  apkUrl: string | null;
}) {
  const handleInstall = () => {
    if (!apkUrl) return;
    downloadAndInstallApk(apkUrl);
  };

  return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Actualización obligatoria</Text>
          <Text style={styles.body}>
            Instala la versión {remoteVersion} para continuar.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleInstall}>
            <Text style={styles.buttonText}>Instalar ahora</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

/* -----------------------------------------------------------
   Funciones auxiliares
   ----------------------------------------------------------- */
function compareVersions(v1: string, v2: string): number {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x !== y) return x - y;
  }
  return 0;
}

async function getApkUrlByArchitecture(
    architectures: Record<string, string>
): Promise<string | null> {
  try {
    const supportedAbis = await DeviceInfo.supportedAbis();
    for (const abi of supportedAbis) {
      if (architectures[abi]) return architectures[abi];
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function downloadAndInstallApk(url: string) {
  if (Platform.OS !== 'android') return;

  try {
    // 1. Permiso legacy (Android < 10)
    const needLegacyStoragePermission = Platform.Version < 29;
    let granted = PermissionsAndroid.RESULTS.GRANTED;
    if (needLegacyStoragePermission) {
      granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permiso de almacenamiento',
            message: 'Se necesita acceso para guardar e instalar la actualización.',
            buttonPositive: 'Permitir',
          }
      );
      if (
          granted !== PermissionsAndroid.RESULTS.GRANTED &&
          granted !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        return;
      }
    }

    // 2. Descargar APK
    const res = await RNBlobUtil.config({
      fileCache: true,
      appendExt: 'apk',
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'Descargando actualización',
        description: 'Actualización de la app',
        mime: 'application/vnd.android.package-archive',
        mediaScannable: true,
      },
    }).fetch('GET', url);

    const downloadedPath = res.path();

    // 3. Intentar instalar
    RNBlobUtil.android
    .actionViewIntent(downloadedPath, 'application/vnd.android.package-archive')
    .catch(() => {
      // Android 8+: abrir directamente la pantalla de permisos de tu paquete
      if (Number(Platform.Version) >= 26) {
        Linking.openURL('package:com.walerike.walactv');
      } else {
        Linking.openSettings();
      }
    });
  } catch (e) {
    console.error(e);
  }
}

/* -----------------------------------------------------------
   Estilos
   ----------------------------------------------------------- */
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  body: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});