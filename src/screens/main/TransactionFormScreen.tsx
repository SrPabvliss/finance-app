import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransactionStackParamList } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { transactionsApi } from '@/api/services/transactions-api';
import TransactionTypeSelector from '@/components/transactions/transaction-type-selector';
import CategorySelector from '@/components/transactions/category-selector';
import PaymentMethodSelector from '@/components/payment-methods/PaymentMethodSelector';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import TransactionScheduleSelector from '@/components/transactions/transactions-schedule-selector';

type Props = NativeStackScreenProps<TransactionStackParamList, 'TransactionForm'>;

export default function TransactionFormScreen({ route, navigation }: Props) {
  const { mode, transaction: editingTransaction } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(mode === 'edit');

  const [formData, setFormData] = useState({
    amount: editingTransaction?.amount || '',
    type: editingTransaction?.type || 'EXPENSE',
    category: editingTransaction?.category || '',
    description: editingTransaction?.description || '',
    payment_method_id: editingTransaction?.payment_method_id,
    // Campos de programación inicializados en false/vacío
    is_scheduled: false,
    frequency: undefined as string | undefined,
    next_execution_date: '',
  });

  // Cargar datos adicionales si es modo edición
  useEffect(() => {
    const loadTransactionDetails = async () => {
      if (mode === 'edit' && editingTransaction) {
        try {
          setIsInitializing(true);

          // Si tiene scheduled_transaction_id, cargar los detalles de la programación
          if (editingTransaction.scheduled_transaction_id) {
            const scheduledDetails = await transactionsApi.getScheduledById(
              editingTransaction.scheduled_transaction_id
            );
            setFormData(prev => ({
              ...prev,
              is_scheduled: true,
              frequency: scheduledDetails.frequency,
              next_execution_date: scheduledDetails.next_execution_date,
            }));
          }
        } catch (error) {
          console.error('Error loading transaction details:', error);
          Alert.alert('Error', 'No se pudieron cargar los detalles de la transacción');
        } finally {
          setIsInitializing(false);
        }
      } else {
        setIsInitializing(false);
      }
    };

    loadTransactionDetails();
  }, [mode, editingTransaction]);

  const handleSubmit = async () => {
    if (!user || !formData.category) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        user_id: user.id,
        amount: formData.amount,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        payment_method_id: formData.payment_method_id,
        scheduled_transaction_id: editingTransaction?.scheduled_transaction_id,
      };

      // Manejar programación
      if (formData.is_scheduled && formData.frequency && formData.next_execution_date) {
        if (mode === 'create') {
          const scheduledTransaction = await transactionsApi.createScheduled({
            user_id: user.id,
            name: formData.description || 'Transacción programada',
            amount: formData.amount,
            category: formData.category,
            description: formData.description,
            payment_method_id: formData.payment_method_id,
            frequency: formData.frequency as any,
            next_execution_date: formData.next_execution_date,
            active: true,
          });
          data.scheduled_transaction_id = scheduledTransaction.id;
        } else if (editingTransaction?.scheduled_transaction_id) {
          await transactionsApi.updateScheduled(editingTransaction.scheduled_transaction_id, {
            frequency: formData.frequency as any,
            next_execution_date: formData.next_execution_date,
          });
          data.scheduled_transaction_id = editingTransaction.scheduled_transaction_id;
        }
      } else if (mode === 'edit' && editingTransaction?.scheduled_transaction_id) {
        // Si estaba programada y se desactivó, eliminar la programación
        await transactionsApi.deleteScheduled(editingTransaction.scheduled_transaction_id);
      }

      if (mode === 'create') {
        await transactionsApi.create(data);
      } else if (editingTransaction) {
        await transactionsApi.update(editingTransaction.id, data);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="space-y-6">
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
          />

          <TransactionScheduleSelector
            enabled={formData.is_scheduled}
            frequency={formData.frequency as any}
            nextExecutionDate={formData.next_execution_date}
            onToggle={() => setFormData({ ...formData, is_scheduled: !formData.is_scheduled })}
            onFrequencyChange={frequency => setFormData({ ...formData, frequency })}
            onDateChange={date => setFormData({ ...formData, next_execution_date: date })}
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
