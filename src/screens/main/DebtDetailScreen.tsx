import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DebtStackParamList } from '@/navigation/DebtNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { debtsApi } from '@/api/services/debts-api';
import { friendsApi } from '@/api/services/friends-api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import { DebtPaymentModal } from '@/components/debts/debt-payment-modal';
import { ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react-native';

type Props = NativeStackScreenProps<DebtStackParamList, 'DebtDetail'>;

export default function DebtDetailScreen({ route, navigation }: Props) {
  const { debt: initialDebt } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [debt, setDebt] = useState(initialDebt);
  const [counterpart, setCounterpart] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isCreditor = user?.id === debt.creditor_id;

  const loadDebtDetails = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedDebt = await debtsApi.getById(debt.id);
      setDebt(updatedDebt);

      // Cargar info del otro usuario
      const userId = isCreditor ? debt.user_id : debt.creditor_id;
      const friends = await friendsApi.getByUser(user.id);
      const friend = friends.find(f => f.friend.id === userId);
      if (friend) {
        setCounterpart(friend.friend);
      }
    } catch (error) {
      console.error('Error loading debt details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDebtDetails();
  }, []);

  const handleEdit = () => {
    navigation.navigate('DebtForm', {
      mode: 'edit',
      debt,
    });
  };

  const handleDelete = () => {
    Alert.alert('Eliminar deuda', '¿Estás seguro de que deseas eliminar esta deuda?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await debtsApi.delete(debt.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la deuda');
          }
        },
      },
    ]);
  };

  const handlePayment = async (amount: number) => {
    if (!user) return;
    try {
      const updatedDebt = await debtsApi.registerPayment(debt.id, user.id, amount);
      setDebt(updatedDebt);
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="space-y-6 p-4">
          {/* Header con monto */}
          <View className="items-center space-y-2">
            <View className={`rounded-full p-3 ${isCreditor ? 'bg-green-100' : 'bg-red-100'}`}>
              {isCreditor ? (
                <ArrowUpRight size={32} color="#22c55e" />
              ) : (
                <ArrowDownLeft size={32} color="#ef4444" />
              )}
            </View>
            <Text className="text-2xl font-bold text-gray-900">${debt.original_amount}</Text>
            <Text className="text-lg text-gray-600">{debt.description}</Text>
          </View>

          {/* Información del otro usuario */}
          {counterpart && (
            <View className="space-y-2">
              <Text className="text-base font-medium text-gray-700">
                {isCreditor ? 'Me debe' : 'Le debo a'}
              </Text>
              <View className="rounded-lg bg-gray-50 p-4">
                <Text className="text-lg font-medium text-gray-900">{counterpart.name}</Text>
                <Text className="text-sm text-gray-600">@{counterpart.username}</Text>
              </View>
            </View>
          )}

          {/* Estado y monto pendiente */}
          <View className="space-y-2">
            <Text className="text-base font-medium text-gray-700">Estado</Text>
            <View className="rounded-lg bg-gray-50 p-4">
              <View className="flex-row justify-between">
                <Text className="text-base text-gray-600">Monto pendiente</Text>
                <Text className="text-base font-medium text-gray-900">${debt.pending_amount}</Text>
              </View>
              {debt.paid ? (
                <View className="mt-2 rounded-full bg-green-100 px-3 py-1 self-start">
                  <Text className="text-sm font-medium text-green-600">Pagada</Text>
                </View>
              ) : (
                <View className="mt-2 rounded-full bg-yellow-100 px-3 py-1 self-start">
                  <Text className="text-sm font-medium text-yellow-600">Pendiente</Text>
                </View>
              )}
            </View>
          </View>

          {/* Fecha de vencimiento */}
          <View className="space-y-2">
            <Text className="text-base font-medium text-gray-700">Fecha de vencimiento</Text>
            <View className="flex-row items-center space-x-2">
              <Calendar size={20} color="#6b7280" />
              <Text className="text-base text-gray-600">
                {new Date(debt.due_date).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Acciones */}
          <View className="space-y-4 pt-4">
            {!debt.paid && !isCreditor && (
              <Button title="Registrar pago" onPress={() => setShowPaymentModal(true)} />
            )}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Button title="Editar" variant="secondary" onPress={handleEdit} />
              </View>
              <View className="flex-1">
                <Button title="Eliminar" variant="secondary" onPress={handleDelete} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <DebtPaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePayment}
        pendingAmount={debt.pending_amount}
      />
    </SafeAreaView>
  );
}
