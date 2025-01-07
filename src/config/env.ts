import Constants from 'expo-constants';

const ENV = {
  API_URL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://10.80.1.196:3000',
};

export default ENV;
