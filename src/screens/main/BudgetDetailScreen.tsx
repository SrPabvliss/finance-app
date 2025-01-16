import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BudgetStackParamList } from '@/navigation/BudgetNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { friendsApi } from '@/api/services/friends-api';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import { BudgetAmountModal } from '@/components/budgets/budget-amount-modal';
import { AlertTriangle, Users } from 'lucide-react-native';
import { budgetsApi } from '@/api/services/budget-api';

type Props = NativeStackScreenProps<BudgetStackParamList, 'BudgetDetail'>;

export default function BudgetDetailScreen({ route, navigation }: Props) {
  const { budget: initialBudget } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState(initialBudget);
  const [sharedUser, setSharedUser] = useState<any>(null);
  const [showAmountModal, setShowAmountModal] = useState(false);

  const progress = (Number(budget.current_amount) / Number(budget.limit_amount)) * 100;
  const isExceeded = progress > 100;
  const remainingAmount = Math.max(Number(budget.limit_amount) - Number(budget.current_amount), 0);

  const loadBudgetDetails = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedBudget = await budgetsApi.getById(budget.id);
      setBudget(updatedBudget);

      if (updatedBudget.shared_user_id) {
        const friends = await friendsApi.getByUser(user.id);
        const friend = friends.find(f => f.friend.id === updatedBudget.shared_user_id);
        if (friend) {
          setSharedUser(friend.friend);
        }
      }
    } catch (error) {
      console.error('Error loading budget details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetDetails();
  }, []);

  const handleEdit = () => {
    navigation.navigate('BudgetForm', {
      mode: 'edit',
      budget,
    });
  };

  const handleDelete = () => {
    Alert.alert('Eliminar presupuesto', '¿Estás seguro de que deseas eliminar este presupuesto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await budgetsApi.delete(budget.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el presupuesto');
          }
        },
      },
    ]);
  };

  const handleAmountUpdate = async (amount: number) => {
    if (!user) return;
    try {
      const updatedBudget = await budgetsApi.updateAmount(budget.id, user.id, amount);
      setBudget(updatedBudget);
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
          {/* Header */}
          <View className="items-center space-y-2">
            <Text className="text-2xl font-bold text-gray-900">{budget.category}</Text>
            <Text className="text-lg text-gray-600">
              {new Date(budget.month).toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>

          {/* Progreso */}
          <View className="space-y-4 rounded-lg bg-gray-50 p-4">
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-600">Gastado</Text>
              <Text className="text-base font-medium text-gray-900">${budget.current_amount}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-base text-gray-600">Límite</Text>
              <Text className="text-base font-medium text-gray-900">${budget.limit_amount}</Text>
            </View>

            <View className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <View
                className={`h-full ${
                  isExceeded ? 'bg-red-500' : progress >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </View>

            <Text
              className={`text-center text-sm font-medium ${
                isExceeded ? 'text-red-600' : progress >= 80 ? 'text-yellow-600' : 'text-blue-600'
              }`}
            >
              {progress.toFixed(1)}% utilizado
            </Text>

            {isExceeded && (
              <View className="flex-row items-center justify-center space-x-2 rounded-lg bg-red-100 p-2">
                <AlertTriangle size={16} color="#ef4444" />
                <Text className="text-sm font-medium text-red-600">Presupuesto excedido</Text>
              </View>
            )}
          </View>

          {/* Usuario compartido */}
          {sharedUser && (
            <View className="space-y-2">
              <Text className="text-base font-medium text-gray-700">Compartido con</Text>
              <View className="rounded-lg bg-purple-50 p-4 flex-row items-center space-x-2">
                <Users size={20} color="#9333ea" />
                <View>
                  <Text className="text-base text-purple-600">{sharedUser.name}</Text>
                  <Text className="text-sm text-gray-600">@{sharedUser.username}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Acciones */}
          <View className="space-y-4 pt-4">
            <Button title="Registrar gasto" onPress={() => setShowAmountModal(true)} />
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

      <BudgetAmountModal
        visible={showAmountModal}
        onClose={() => setShowAmountModal(false)}
        onSubmit={handleAmountUpdate}
        remainingAmount={remainingAmount.toString()}
      />
    </SafeAreaView>
  );
}
