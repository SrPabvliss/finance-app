import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransactionStackParamList } from '@/types/navigation';
import Button from '@/components/ui/Button';
import { transactionsApi } from '@/api/services/transactions-api';
import { paymentMethodsApi } from '@/api/services/payment-methods-api';
import Loading from '@/components/ui/LoadingComponent';

type Props = NativeStackScreenProps<TransactionStackParamList, 'TransactionDetail'>;

export default function TransactionDetailScreen({ route, navigation }: Props) {
  const { transaction } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(route.params.transaction);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);

  const handleEdit = () => {
    navigation.navigate('TransactionForm', {
      mode: 'edit',
      transaction: currentTransaction,
    });
  };

  const handleDelete = async () => {
    Alert.alert('Eliminar transacción', '¿Estás seguro de que deseas eliminar esta transacción?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await transactionsApi.delete(transaction.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la transacción');
          }
        },
      },
    ]);
  };

  const loadTransaction = async () => {
    try {
      setIsLoading(true);
      const updatedTransaction = await transactionsApi.getById(currentTransaction.id);
      setCurrentTransaction(updatedTransaction);

      if (updatedTransaction.payment_method_id) {
        const method = await paymentMethodsApi.getById(updatedTransaction.payment_method_id);
        setPaymentMethod(method);
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransaction();
    });

    return unsubscribe;
  }, [navigation]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <View className="space-y-4">
          <Text className="text-2xl font-bold text-gray-900">
            {currentTransaction.type === 'INCOME' ? '+' : '-'}${currentTransaction.amount}
          </Text>

          <View className="space-y-2">
            <Text className="text-base font-semibold text-gray-700">Categoría</Text>
            <Text className="text-base text-gray-600">{currentTransaction.category}</Text>
          </View>

          {paymentMethod && (
            <View className="space-y-2">
              <Text className="text-base font-semibold text-gray-700">Método de pago</Text>
              <Text className="text-base text-gray-600">
                {paymentMethod.name}
                {paymentMethod.last_four_digits && ` (**** ${paymentMethod.last_four_digits})`}
              </Text>
            </View>
          )}

          {currentTransaction.description && (
            <View className="space-y-2">
              <Text className="text-base font-semibold text-gray-700">Descripción</Text>
              <Text className="text-base text-gray-600">{currentTransaction.description}</Text>
            </View>
          )}

          <View className="space-y-2">
            <Text className="text-base font-semibold text-gray-700">Fecha</Text>
            <Text className="text-base text-gray-600">
              {new Date(currentTransaction.date).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Button title="Editar" onPress={handleEdit} />
            </View>
            <View className="flex-1">
              <Button title="Eliminar" variant="secondary" onPress={handleDelete} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
