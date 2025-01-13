import Constants from 'expo-constants';

const ENV = {
  API_URL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://10.79.5.157:3000',
};

export default ENV;
