import { Event } from '@/types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Real Madrid vs Barcelona - El Clásico',
    description: 'El partido más esperado del año entre los dos gigantes del fútbol español',
    category: 'deportes',
    thumbnail: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
    isLive: true,
    startTime: '2025-01-21T20:00:00Z',
    endTime: '2025-01-21T22:00:00Z',
    viewers: 125000,
    tags: ['fútbol', 'la liga', 'clásico'],
    channels: [
      {
        id: 'espn1',
        name: 'ESPN',
        logo: 'https://images.pexels.com/photos/163036/mario-luigi-figures-funny-163036.jpeg?auto=compress&cs=tinysrgb&w=200',
        category: 'deportes',
        links: [
          {
            id: 'espn1-hd',
            name: 'ESPN HD Español',
            url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
            quality: 'HD',
            language: 'es',
            isWorking: true,
          },
          {
            id: 'espn1-sd',
            name: 'ESPN SD Backup',
            url: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1',
            quality: 'SD',
            language: 'es',
            isWorking: true,
          }
        ]
      },
      {
        id: 'skysports',
        name: 'Sky Sports',
        category: 'deportes',
        links: [
          {
            id: 'sky1-hd',
            name: 'Sky Sports HD',
            url: 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1',
            quality: 'HD',
            language: 'en',
            isWorking: true,
          },
          {
            id: 'sky1-4k',
            name: 'Sky Sports 4K',
            url: 'https://www.youtube.com/embed/GDpmVUEjagg?autoplay=1&mute=1',
            quality: '4K',
            language: 'en',
            isWorking: false,
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'NBA Finals - Lakers vs Celtics',
    description: 'Las finales de la NBA entre dos equipos históricos',
    category: 'deportes',
    thumbnail: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=800',
    isLive: true,
    startTime: '2025-01-21T21:30:00Z',
    viewers: 89000,
    tags: ['basketball', 'nba', 'finals'],
    channels: [
      {
        id: 'nba1',
        name: 'NBA TV',
        category: 'deportes',
        links: [
          {
            id: 'nba1-hd',
            name: 'NBA TV HD',
            url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
            quality: 'HD',
            language: 'en',
            isWorking: true,
          }
        ]
      },
      {
        id: 'espn2',
        name: 'ESPN 2',
        category: 'deportes',
        links: [
          {
            id: 'espn2-hd',
            name: 'ESPN 2 HD',
            url: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1',
            quality: 'HD',
            language: 'es',
            isWorking: true,
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Concierto de Rock - Metallica en Vivo',
    description: 'Concierto exclusivo de Metallica desde el estadio Wembley',
    category: 'musica',
    thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    isLive: true,
    startTime: '2025-01-21T19:00:00Z',
    viewers: 45000,
    tags: ['rock', 'metallica', 'concierto'],
    channels: [
      {
        id: 'mtv1',
        name: 'MTV Live',
        category: 'musica',
        links: [
          {
            id: 'mtv1-hd',
            name: 'MTV HD',
            url: 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1',
            quality: 'HD',
            language: 'en',
            isWorking: true,
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Noticias 24h - CNN Internacional',
    description: 'Noticias en vivo las 24 horas del día',
    category: 'noticias',
    thumbnail: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
    isLive: true,
    startTime: '2025-01-21T00:00:00Z',
    viewers: 25000,
    tags: ['noticias', 'actualidad', '24h'],
    channels: [
      {
        id: 'cnn1',
        name: 'CNN International',
        category: 'noticias',
        links: [
          {
            id: 'cnn1-hd',
            name: 'CNN HD',
            url: 'https://www.youtube.com/embed/GDpmVUEjagg?autoplay=1&mute=1',
            quality: 'HD',
            language: 'en',
            isWorking: true,
          }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Comedy Central - Show de Comedia',
    description: 'El mejor entretenimiento y comedia en vivo',
    category: 'entretenimiento',
    thumbnail: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=800',
    isLive: false,
    startTime: '2025-01-21T22:00:00Z',
    viewers: 15000,
    tags: ['comedia', 'entretenimiento', 'show'],
    channels: [
      {
        id: 'comedy1',
        name: 'Comedy Central',
        category: 'entretenimiento',
        links: [
          {
            id: 'comedy1-hd',
            name: 'Comedy Central HD',
            url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
            quality: 'HD',
            language: 'es',
            isWorking: true,
          }
        ]
      }
    ]
  }
];