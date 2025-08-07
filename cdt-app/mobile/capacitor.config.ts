import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.gov.cdt.demo',
  appName: 'CDT Demo',
  webDir: '../public',
  server: {
    // Troque por sua URL pública gerada via Cloudflared
    url: 'http://10.0.2.2:8080',
    cleartext: true
  }
};

export default config;