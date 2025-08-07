import { CapacitorConfig } from '@capacitor/cli';

const WEB_URL = process.env.WEB_URL || 'http://10.0.2.2:8080';

const config: CapacitorConfig = {
  appId: 'br.gov.cdt.demo',
  appName: 'CDT Demo',
  webDir: '../public',
  server: {
    url: WEB_URL,
    cleartext: WEB_URL.startsWith('http://')
  }
};

export default config;