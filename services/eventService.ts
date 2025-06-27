import {Agenda, Event} from '@/types';
import {getFirestore, query, collection, where, getDocs} from '@react-native-firebase/firestore';

/**
 * Obtiene todos los eventos de Firestore
 */
export const getLastEvent = async (): Promise<Agenda[]> => {
  try {
    const db = getFirestore();
    const q = query(collection(db, 'tvLibreEventos'));
    const querySnapshot = await getDocs(q);

    const now = new Date();
    const currentDay = now.getDate(); // Día del mes actual (1-31)
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (!data) throw new Error('No data found');

      // Extraer el día del mes del título (ej: "27" de "Agenda - Viernes 27 de Junio de 2025")
      const match = data.dia?.match(/\d+/);
      if (!match) {
        console.warn('Formato de fecha no reconocido en:', data.dia);
        return data as Agenda;
      }

      const diaDelMes = parseInt(match[0], 10);
      const diferenciaDias = currentDay - diaDelMes;


      // Si es hoy, calcular qué eventos ya pasaron
      const eventos = data.eventos || [];
      const lastIndex = eventos.findLastIndex(event => {
        const [eventHours, eventMinutes] = event.hora.split(':').map(Number);
        return eventHours < currentHour || eventHours === currentHour && eventMinutes <= currentMinute
      });

      const processedEvents = eventos.map((event, index) => ({
        ...event,
        isLive: lastIndex === -1 || index <= lastIndex
      }));

      return {
        ...data,
        eventos: processedEvents
      } as Agenda;
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    throw error;
  }
};

// /**
//  * Obtiene eventos por categoría
//  */
// export const getEventsByCategory = async (category: string): Promise<Event[]> => {
//   try {
//     const eventsCollection = collection(db, 'events');
//     const q = query(eventsCollection, where('category', '==', category));
//     const eventsSnapshot = await getDocs(q);
// import { db } from '@/firebase/config';
// import { Event } from '@/types';
//
// /**
//  * Obtiene todos los eventos de Firestore
//  */
// export const getEvents = async (): Promise<Event[]> => {
//   try {
//     const eventsSnapshot = await db.collection('events').get();
//
//     return eventsSnapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data
//       } as Event;
//     });
//   } catch (error) {
//     console.error('Error al obtener eventos:', error);
//     throw error;
//   }
// };
//
// /**
//  * Obtiene eventos por categoría
//  */
// export const getEventsByCategory = async (category: string): Promise<Event[]> => {
//   try {
//     const eventsSnapshot = await db.collection('events')
//       .where('category', '==', category)
//       .get();
//
//     return eventsSnapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data
//       } as Event;
//     });
//   } catch (error) {
//     console.error(`Error al obtener eventos de categoría ${category}:`, error);
//     throw error;
//   }
// };
//
// /**
//  * Obtiene eventos en vivo
//  */
// export const getLiveEvents = async (): Promise<Event[]> => {
//   try {
//     const eventsSnapshot = await db.collection('events')
//       .where('isLive', '==', true)
//       .get();
//
//     return eventsSnapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data
//       } as Event;
//     });
//   } catch (error) {
//     console.error('Error al obtener eventos en vivo:', error);
//     throw error;
//   }
// };
//
// /**
//  * Obtiene un evento por su ID
//  */
// export const getEventById = async (eventId: string): Promise<Event | null> => {
//   try {
//     const eventDoc = await db.collection('events').doc(eventId).get();
//
//     if (eventDoc.exists) {
//       const data = eventDoc.data();
//       return {
//         id: eventDoc.id,
//         ...data
//       } as Event;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error(`Error al obtener evento con ID ${eventId}:`, error);
//     throw error;
//   }
// };
//
// /**
//  * Obtiene los eventos populares (por número de espectadores)
//  */
// export const getPopularEvents = async (limitCount: number = 5): Promise<Event[]> => {
//   try {
//     const eventsSnapshot = await db.collection('events')
//       .orderBy('viewers', 'desc')
//       .limit(limitCount)
//       .get();
//
//     return eventsSnapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data
//       } as Event;
//     });
//   } catch (error) {
//     console.error('Error al obtener eventos populares:', error);
//     throw error;
//   }
// };
//     return eventsSnapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data
//       } as Event;
//     });
//   } catch (error) {
//     console.error(`Error al obtener eventos de categoría ${category}:`, error);
//     throw error;
//   }
// };
//
// /**
//  * Obtiene eventos en vivo
//  */
// export const getLiveEvents = async (): Promise<Event[]> => {
//   try {
//     const eventsCollection = collection(db, 'events');
//     const q = query(eventsCollection, where('isLive', '==', true));
//     const eventsSnapshot = await getDocs(q);
//
//     return eventsSnapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data
//       } as Event;
//     });
//   } catch (error) {
//     console.error('Error al obtener eventos en vivo:', error);
//     throw error;
//   }
// };
//
// /**
//  * Obtiene un evento por su ID
//  */
// export const getEventById = async (eventId: string): Promise<Event | null> => {
//   try {
//     const eventRef = doc(db, 'events', eventId);
//     const eventSnapshot = await getDoc(eventRef);
//
//     if (eventSnapshot.exists()) {
//       const data = eventSnapshot.data();
//       return {
//         id: eventSnapshot.id,
//         ...data
//       } as Event;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error(`Error al obtener evento con ID ${eventId}:`, error);
//     throw error;
//   }
// };
//
// /**
//  * Obtiene los eventos populares (por número de espectadores)
//  */
// export const getPopularEvents = async (limitCount: number = 5): Promise<Event[]> => {
//   try {
//     const eventsCollection = collection(db, 'events');
//     const q = query(eventsCollection, orderBy('viewers', 'desc'), limit(limitCount));
//     const eventsSnapshot = await getDocs(q);
//
//     return eventsSnapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data
//       } as Event;
//     });
//   } catch (error) {
//     console.error('Error al obtener eventos populares:', error);
//     throw error;
//   }
// };
