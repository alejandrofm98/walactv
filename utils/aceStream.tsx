import { Linking, Alert } from 'react-native';

const PACKAGE_NAMES = [
  'org.acestream.core',          // Ace Stream móvil
  'org.acestream.core.atv',      // Ace Stream TV
];

export async function openAceStreamOrPromptInstall() {
  let found = false;

  for (const pkg of PACKAGE_NAMES) {
    const intentUrl = `intent://${pkg}#Intent;scheme=package;end`;
    const canOpen = await Linking.canOpenURL(intentUrl);

    if (canOpen) {
      Linking.openURL(intentUrl);
      found = true;
      break;
    }
  }

  if (!found) {
    Alert.alert(
        'Ace Stream no instalado',
        'Para continuar necesitas instalar Ace Stream Engine.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Instalar ahora',
            onPress: () =>
                Linking.openURL(
                    'https://play.google.com/store/apps/details?id=' + PACKAGE_NAMES[0]
                ),
          },
        ],
        { cancelable: true }
    );
  }
}