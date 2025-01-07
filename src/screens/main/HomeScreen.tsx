import Button from '@/components/ui/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const navigation = useNavigation();
  const handleLogout = () => {
    // Implementar lógica de cerrar sesión
    // limpiar las tokens de autenticación creadas con async storage

    AsyncStorage.removeItem('@user');
    AsyncStorage.removeItem('@token');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold">Dashboard</Text>
        <Button title="Cerrar sesión" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
