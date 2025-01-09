import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransactionStackParamList } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { transactionsApi } from '@/api/services/transactions-api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import TransactionTypeSelector from '@/components/transactions/transaction-type-selector';
import CategorySelector from '@/components/transactions/category-selector';
import PaymentMethodSelector from '@/components/payment-methods/PaymentMethodSelector';

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
    payment_method_id: editingTransaction?.payment_method_id || undefined,
  });

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      const data = {
        ...formData,
        user_id: user.id,
      };

      if (mode === 'create') {
        await transactionsApi.create(data);
      } else if (editingTransaction) {
        await transactionsApi.update(editingTransaction.id, data);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <TransactionTypeSelector
          value={formData.type}
          onChange={type => setFormData({ ...formData, type })}
        />

        <Input
          label="Monto"
          value={formData.amount}
          onChangeText={amount => setFormData({ ...formData, amount })}
          keyboardType="numeric"
          placeholder="0.00"
          className="mt-4"
        />

        <CategorySelector
          type={formData.type}
          value={formData.category}
          onChange={category => setFormData({ ...formData, category })}
        />

        <PaymentMethodSelector
          value={formData.payment_method_id}
          onChange={id => setFormData({ ...formData, payment_method_id: id })}
        />

        <Input
          label="Descripción"
          value={formData.description}
          onChangeText={description => setFormData({ ...formData, description })}
          placeholder="Opcional"
          multiline
          className="mt-4"
        />

        <Button
          title={mode === 'create' ? 'Crear' : 'Actualizar'}
          onPress={handleSubmit}
          isLoading={isLoading}
          className="mt-6"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
