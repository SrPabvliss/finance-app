import { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddFriendModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (email: string) => Promise<void>;
}

export function AddFriendModal({ visible, onClose, onAdd }: AddFriendModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!email) {
      setError('El email es requerido');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onAdd(email);
      setEmail('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar amigo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50">
        <View className="mt-auto rounded-t-3xl bg-white p-6">
          <View className="mb-6 items-center">
            <Text className="text-xl font-semibold text-gray-900">Agregar Amigo</Text>
          </View>

          <Input
            label="Email del usuario"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <View className="mt-6 space-y-4">
            <Button title="Agregar" onPress={handleAdd} isLoading={isLoading} />
            <Button title="Cancelar" variant="secondary" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
