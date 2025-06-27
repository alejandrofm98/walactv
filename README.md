# Welcome to your Expo app 👋
# Aplicación de Eventos en Vivo
# Aplicación de Eventos en Vivo

## Configuración de Firebase con google-services.json

Esta aplicación utiliza Firebase para almacenar y recuperar información sobre eventos. Sigue estos pasos para configurar Firebase en tu proyecto:

### 1. Crear un proyecto en Firebase

1. Ve a la [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Añadir proyecto" y sigue los pasos para crear un nuevo proyecto

### 2. Registrar la aplicación Android

1. En la consola de Firebase, haz clic en el icono de Android para añadir una aplicación
2. Introduce el nombre del paquete de tu aplicación (el mismo que se encuentra en android/app/build.gradle)
3. (Opcional) Añade un apodo para la aplicación
4. Haz clic en "Registrar aplicación"

### 3. Descargar el archivo google-services.json

1. Firebase generará un archivo google-services.json. Descárgalo.
2. Coloca este archivo en la carpeta `android/app/` de tu proyecto

### 4. Configurar Firestore

1. En la consola de Firebase, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona el modo que prefieras (modo de prueba o modo de producción)
4. Selecciona la ubicación más cercana a tus usuarios

### 5. Crear la colección de eventos

Crea una colección llamada `events` en Firestore con la siguiente estructura para cada documento:

```typescript
{
  title: string,
  description: string,
  category: string,
  thumbnail: string,
  isLive: boolean,
  startTime: timestamp,
  endTime?: timestamp,
  viewers: number,
  tags: string[],
  channels: [
    {
      id: string,
      name: string,
      logo?: string,
      category: string,
      links: [
        {
          id: string,
          name: string,
          url: string,
          quality: string,
          language: string,
          isWorking: boolean
        }
      ]
    }
  ]
}
```

## Uso de los servicios de eventos

Importa las funciones de servicio donde necesites obtener datos de eventos:

```typescript
import { getEvents, getEventsByCategory, getLiveEvents, getEventById, getPopularEvents } from '@/services/eventService';

// Ejemplo: Obtener todos los eventos
const loadEvents = async () => {
  try {
    const events = await getEvents();
    console.log(events);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Notas Importantes

- Asegúrate de que la versión del plugin de Google Services en android/build.gradle coincida con la versión compatible con tu proyecto.
- Si encuentras problemas, verifica que las dependencias de Firebase estén correctamente instaladas con `npm install @react-native-firebase/app @react-native-firebase/firestore`.
## Configuración de Firebase

La aplicación utiliza Firebase para almacenar y recuperar información sobre eventos. Sigue estos pasos para configurar Firebase en tu proyecto:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Agrega una aplicación web a tu proyecto Firebase
3. Copia las credenciales de configuración
4. Actualiza el archivo `firebase/config.ts` con tus credenciales

## Estructura de datos en Firestore

Debes crear una colección llamada `events` en Firestore con la siguiente estructura para cada documento:

```typescript
{
  title: string,
  description: string,
  category: string,
  thumbnail: string,
  isLive: boolean,
  startTime: timestamp,
  endTime?: timestamp,
  viewers: number,
  tags: string[],
  channels: [
    {
      id: string,
      name: string,
      logo?: string,
      category: string,
      links: [
        {
          id: string,
          name: string,
          url: string,
          quality: string,
          language: string,
          isWorking: boolean
        }
      ]
    }
  ]
}
```

## Uso de los servicios de eventos

Importa las funciones de servicio donde necesites obtener datos de eventos:

```typescript
import { getEvents, getEventsByCategory, getLiveEvents, getEventById, getPopularEvents } from '@/services/eventService';

// Ejemplo: Obtener todos los eventos
const loadEvents = async () => {
  try {
    const events = await getEvents();
    console.log(events);
  } catch (error) {
    console.error('Error:', error);
  }
};
```
This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
