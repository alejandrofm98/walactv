import { Agenda, Event } from '@/types';
import { getFirestore, query, collection, getDocs } from '@react-native-firebase/firestore';

/**
 * Obtiene la última agenda de Firestore y calcula en qué eventos están en directo
 * basándose en la hora y la fecha real inferida desde el orden de la lista.
 */
export const getLastEvent = async (): Promise<Agenda[]> => {
  try {
    const db = getFirestore();
    const q = query(collection(db, 'tvLibreEventos'))
    .orderBy('fecha', 'desc')
    .limit(1);

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return [];

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    if (!data) throw new Error('No data found');

    // Extraer el día del título (ej: "27" de "Agenda - Viernes 27 de Junio de 2025")
    const match = data.dia?.match(/\d+/);
    if (!match) {
      console.warn('Formato de fecha no reconocido en:', data.dia);
      return [data as Agenda];
    }

    const diaDelMes = parseInt(match[0], 10);
    const now = new Date();

    // Fecha base: hoy a las 00:00
    let baseDate = new Date(now.getFullYear(), now.getMonth(), diaDelMes, 0, 0, 0, 0);

    const eventos = data.eventos || [];

    // Procesar eventos para asignar fecha real y calcular "en directo"
    const processedEvents = eventos.map((event: Event, index: number, arr: Event[]) => {
      const [h, m] = (event.hora || '00:00').split(':').map(Number);
      let eventDate = new Date(baseDate);
      eventDate.setHours(h, m, 0, 0);

      // Si la hora es menor que la del evento anterior, asumimos que es del día siguiente
      if (index > 0) {
        const prevHora = arr[index - 1].hora || '00:00';
        const [prevH, prevM] = prevHora.split(':').map(Number);
        const prevDate = new Date(baseDate);
        prevDate.setHours(prevH, prevM, 0, 0);

        if (eventDate < prevDate) {
          eventDate.setDate(eventDate.getDate() + 1);
          baseDate.setDate(baseDate.getDate() + 1); // actualizamos para siguientes
        }
      }

      // Determinar si está en directo (margen de 3 horas)
      const isLive = eventDate <= now;

      return {
        ...event,
        isLive,
        fechaReal: eventDate,
      };
    });

    return [
      {
        ...data,
        eventos: processedEvents,
      } as Agenda,
    ];
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    throw error;
  }
};