import React, { useState } from 'react';
import { Modal, View, Text } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface BudgetAmountModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void>;
  remainingAmount: string;
}

export function BudgetAmountModal({
  visible,
  onClose,
  onSubmit,
  remainingAmount,
}: BudgetAmountModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) {
      setError('El monto es requerido');
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onSubmit(numAmount);
      setAmount('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el monto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50">
        <View className="mt-auto rounded-t-3xl bg-white p-6">
          <View className="mb-6">
            <Text className="text-center text-xl font-semibold">Registrar Gasto</Text>
            <Text className="mt-2 text-center text-gray-600">Disponible: ${remainingAmount}</Text>
          </View>

          <Input
            label="Monto"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            error={error}
          />

          <View className="mt-6 space-y-4">
            <Button title="Registrar" onPress={handleSubmit} isLoading={isLoading} />
            <Button title="Cancelar" variant="secondary" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
