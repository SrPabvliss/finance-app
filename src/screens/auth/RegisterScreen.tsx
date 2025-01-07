import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register({ name, username, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <View className="mb-10 items-center">
          <Text className="text-3xl font-bold text-gray-900">Crear cuenta</Text>
          <Text className="mt-2 text-center text-gray-600">Regístrate para comenzar</Text>
        </View>

        <View className="space-y-4">
          <Input label="Nombre" placeholder="Tu nombre" value={name} onChangeText={setName} />

          <Input
            label="Nombre de usuario"
            placeholder="username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />

          <Input
            label="Email"
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text className="text-center text-sm text-red-500">{error}</Text>}

          <Button title="Registrarse" onPress={handleRegister} isLoading={isLoading} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')} className="p-4">
            <Text className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta? <Text className="font-semibold text-blue-500">Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
