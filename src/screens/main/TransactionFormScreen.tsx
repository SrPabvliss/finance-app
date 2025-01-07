import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransactionStackParamList } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { transactionsApi } from '@/api/services/transactions-api';
import TransactionTypeSelector from '@/components/transactions/transaction-type-selector';
import CategorySelector from '@/components/transactions/category-selector';

type Props = NativeStackScreenProps<TransactionStackParamList, 'TransactionForm'>;

export default function TransactionFormScreen({ route, navigation }: Props) {
  const { mode, transaction: editingTransaction } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: editingTransaction?.amount || '',
    type: editingTransaction?.type || 'EXPENSE',
    category: editingTransaction?.category || '',
    description: editingTransaction?.description || '',
  });

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const data = {
        ...formData,
        amount: formData.amount,
        user_id: user.id,
      };

      if (mode === 'create') {
        await transactionsApi.create(data);
      } else if (editingTransaction) {
        await transactionsApi.update(editingTransaction.id, data);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al guardar la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="space-y-4">
          <TransactionTypeSelector
            value={formData.type}
            onChange={type => setFormData({ ...formData, type })}
          />

          <Input
            label="Monto"
            value={formData.amount as string}
            onChangeText={amount => setFormData({ ...formData, amount })}
            keyboardType="numeric"
            placeholder="0.00"
          />

          <CategorySelector
            type={formData.type}
            value={formData.category}
            onChange={category => setFormData({ ...formData, category })}
          />

          <Input
            label="Descripción"
            value={formData.description}
            onChangeText={description => setFormData({ ...formData, description })}
            placeholder="Opcional"
            multiline
          />

          <Button
            title={mode === 'create' ? 'Crear' : 'Actualizar'}
            onPress={handleSubmit}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
