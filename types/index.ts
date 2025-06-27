export interface StreamLink {
  id: string;
  name: string;
  url: string;
  quality: 'HD' | 'SD' | '4K';
  language: string;
  isWorking: boolean;
}

export interface Channel {
  id: string;
  name: string;
  logo?: string;
  links: StreamLink[];
  category: string;
}

export interface Agenda {
  dia: string;
  eventos: Event[];
}

export interface Event {
  enlaces: Enlace[];
  hora: string;
  titulo: string;
  isLive?: boolean;  // Add this line
}

export interface Enlace{
  canal: string;
  link: string;
  m3u8: M3U8;
}

export interface M3U8 {
  url: string[];
}