import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'captura360',
  webDir: 'www',
  server: {
    url: 'http://192.168.0.179:8100',
    cleartext: true,
  },
};

export default config;
