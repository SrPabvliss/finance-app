import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'finance-app',
  slug: 'finance-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  extra: {
    API_URL: process.env.EXPO_PUBLIC_API_URL,
  },
};

export default config;
