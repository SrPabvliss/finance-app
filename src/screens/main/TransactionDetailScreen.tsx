import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransactionStackParamList } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { transactionsApi } from '@/api/services/transactions-api';
import { PaymentMethod, paymentMethodsApi } from '@/api/services/payment-methods-api';
import { friendsApi } from '@/api/services/friends-api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import { Calendar, CreditCard, Users } from 'lucide-react-native';
import { ScheduledTransaction } from '@/types/transactions';

type Props = NativeStackScreenProps<TransactionStackParamList, 'TransactionDetail'>;

export default function TransactionDetailScreen({ route, navigation }: Props) {
  const { transaction } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(route.params.transaction);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [scheduledTransaction, setScheduledTransaction] = useState<ScheduledTransaction | null>(
    null
  );
  const [sharedWithUser, setSharedWithUser] = useState<any>(null);

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
            // Si es una transacción programada, eliminar también la programación
            if (currentTransaction.scheduled_transaction_id) {
              await transactionsApi.deleteScheduled(currentTransaction.scheduled_transaction_id);
            }
            await transactionsApi.delete(transaction.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la transacción');
          }
        },
      },
    ]);
  };

  const loadTransactionDetails = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const updatedTransaction = await transactionsApi.getById(currentTransaction.id);
      setCurrentTransaction(updatedTransaction);

      // Cargar método de pago si existe
      if (updatedTransaction.payment_method_id) {
        const method = await paymentMethodsApi.getById(updatedTransaction.payment_method_id);
        setPaymentMethod(method);
      }

      // Cargar información de programación si existe
      if (updatedTransaction.scheduled_transaction_id) {
        const scheduled = await transactionsApi.getScheduledById(
          updatedTransaction.scheduled_transaction_id
        );
        setScheduledTransaction(scheduled);
      }

      // Cargar información de usuario compartido si existe
      if (updatedTransaction.shared_with_id) {
        const friends = await friendsApi.getByUser(user.id);
        const friend = friends.find(f => f.friend.id === updatedTransaction.shared_with_id);
        if (friend) {
          setSharedWithUser(friend.friend);
        }
      }
    } catch (error) {
      console.error('Error loading transaction details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactionDetails();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const isIncome = currentTransaction.type === 'INCOME';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="space-y-6 p-4">
          {/* Monto y tipo */}
          <View className="items-center space-y-2">
            <Text className={`text-3xl font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
              {isIncome ? '+' : '-'}${currentTransaction.amount}
            </Text>
            <Text className="text-lg text-gray-600">{currentTransaction.category}</Text>
          </View>

          {/* Detalles básicos */}
          {currentTransaction.description && (
            <View className="space-y-2">
              <Text className="text-base font-medium text-gray-700">Descripción</Text>
              <Text className="text-base text-gray-600">{currentTransaction.description}</Text>
            </View>
          )}

          {/* Método de pago */}
          {paymentMethod && (
            <View className="space-y-2">
              <Text className="text-base font-medium text-gray-700">Método de pago</Text>
              <View className="flex-row items-center space-x-2">
                <CreditCard size={20} color="#6b7280" />
                <Text className="text-base text-gray-600">
                  {paymentMethod.name}
                  {paymentMethod.last_four_digits && ` (**** ${paymentMethod.last_four_digits})`}
                </Text>
              </View>
            </View>
          )}

          {/* Información de programación */}
          {scheduledTransaction && (
            <View className="space-y-2">
              <Text className="text-base font-medium text-gray-700">Programación</Text>
              <View className="rounded-lg bg-blue-50 p-4 space-y-2">
                <View className="flex-row items-center space-x-2">
                  <Calendar size={20} color="#3b82f6" />
                  <Text className="text-base text-blue-600">
                    {scheduledTransaction.frequency.charAt(0) +
                      scheduledTransaction.frequency.slice(1).toLowerCase()}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600">
                  Próxima ejecución:{' '}
                  {new Date(scheduledTransaction.next_execution_date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}

          {/* Información de compartición */}
          {sharedWithUser && (
            <View className="space-y-2">
              <Text className="text-base font-medium text-gray-700">Compartida con</Text>
              <View className="rounded-lg bg-purple-50 p-4 flex-row items-center space-x-2">
                <Users size={20} color="#9333ea" />
                <View>
                  <Text className="text-base text-purple-600">{sharedWithUser.name}</Text>
                  <Text className="text-sm text-gray-600">@{sharedWithUser.username}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Fecha */}
          <View className="space-y-2">
            <Text className="text-base font-medium text-gray-700">Fecha</Text>
            <Text className="text-base text-gray-600">
              {new Date(currentTransaction.date).toLocaleDateString()}
            </Text>
          </View>

          {/* Acciones */}
          <View className="flex-row space-x-4 pt-4">
            <View className="flex-1">
              <Button title="Editar" onPress={handleEdit} />
            </View>
            <View className="flex-1">
              <Button title="Eliminar" variant="secondary" onPress={handleDelete} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
