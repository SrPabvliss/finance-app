import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import './src/styles.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider className="flex-1 p-2">
        <RootNavigator />
        <StatusBar style="dark" />
        <Toast />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
