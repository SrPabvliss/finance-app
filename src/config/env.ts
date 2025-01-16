import Constants from 'expo-constants';

const ENV = {
  API_URL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://192.168.100.238:3000',
};

export default ENV;
