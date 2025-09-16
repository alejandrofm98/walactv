// import RNFS from "react-native-fs";
// import { FFmpegKit, FFmpegSession } from "ffmpeg-kit-react-native";
// import HttpServer from "react-native-http-server";
// import { NetworkInfo } from "react-native-network-info";
//
// class AceStreamHlsService {
//   private outputDir: string;
//   private outputM3u8: string;
//   private server: HttpServer;
//   private ffmpegSession: FFmpegSession | null;
//
//   constructor() {
//     this.outputDir = `${RNFS.CachesDirectoryPath}/hls`;
//     this.outputM3u8 = `${this.outputDir}/stream.m3u8`;
//     this.server = new HttpServer();
//     this.ffmpegSession = null;
//   }
//
//   /** Inicializa el directorio HLS y el servidor HTTP */
//   public async init(): Promise<void> {
//     const exists = await RNFS.exists(this.outputDir);
//     if (!exists) await RNFS.mkdir(this.outputDir);
//
//     await this.server.start({ port: 8080, root: this.outputDir });
//     console.log("HTTP server iniciado en puerto 8080");
//   }
//
//   /** Devuelve la URL local del HLS para Chromecast */
//   public async getLocalHlsUrl(): Promise<string> {
//     const ip = await NetworkInfo.getIPAddress();
//     return `http://${ip}:8080/stream.m3u8`;
//   }
//
//   /** Inicia la transcodificación TS → HLS */
//   public async startTranscoding(aceStreamUrl: string): Promise<void> {
//     const cmd = `
//       -i "${aceStreamUrl}"
//       -c:v libx264 -preset veryfast -b:v 1500k
//       -c:a aac -b:a 128k
//       -f hls
//       -hls_time 4
//       -hls_list_size 6
//       -hls_flags delete_segments+append_list
//       "${this.outputM3u8}"
//     `;
//
//     this.ffmpegSession = FFmpegKit.executeAsync(cmd, (session) => {
//       console.log("FFmpeg finalizó:", session);
//     });
//
//     console.log("Transcodificación iniciada...");
//   }
//
//   /** Detiene FFmpeg y el servidor HTTP */
//   public async stop(): Promise<void> {
//     if (this.ffmpegSession) {
//       FFmpegKit.cancel(this.ffmpegSession);
//       console.log("FFmpeg detenido");
//     }
//
//     await this.server.stop();
//     console.log("HTTP server detenido");
//   }
// }
//
// export default new AceStreamHlsService();
