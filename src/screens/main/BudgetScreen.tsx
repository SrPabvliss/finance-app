import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BudgetStackParamList } from '@/navigation/BudgetNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { BudgetCard } from '@/components/budgets/budget-card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { budgetsApi } from '@/api/services/budget-api';
import { Budget } from '@/types/budegets';

type BudgetScreenNavigationProp = NativeStackNavigationProp<BudgetStackParamList, 'BudgetsList'>;

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user } = useAuth();
  const navigation = useNavigation<BudgetScreenNavigationProp>();

  const loadBudgets = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Formato YYYY-MM-DD requerido por la API
      const monthStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`;
      const data = await budgetsApi.getByUserAndMonth(user.id, monthStr);
      setBudgets(data);
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentMonth]);

  useEffect(() => {
    loadBudgets();

    const unsubscribe = navigation.addListener('focus', () => {
      loadBudgets();
    });

    return unsubscribe;
  }, [navigation, loadBudgets]);

  const handleNewBudget = () => {
    navigation.navigate('BudgetForm', { mode: 'create' });
  };

  const handleBudgetPress = (budget: Budget) => {
    navigation.navigate('BudgetDetail', { budget });
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  if (isLoading) {
    return <Loading />;
  }

  const totalLimit = budgets.reduce((sum, budget) => sum + Number(budget.limit_amount), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + Number(budget.current_amount), 0);
  const progress = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header con selector de mes */}
      <View className="border-b border-gray-200 bg-white p-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => changeMonth('prev')} className="p-2">
            <ChevronLeft size={24} color="#6b7280" />
          </TouchableOpacity>

          <Text className="text-lg font-semibold">
            {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </Text>

          <TouchableOpacity onPress={() => changeMonth('next')} className="p-2">
            <ChevronRight size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Resumen mensual */}
        <View className="mt-4 space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Total gastado</Text>
            <Text className="font-semibold text-gray-900">${totalSpent.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Límite total</Text>
            <Text className="font-semibold text-gray-900">${totalLimit.toFixed(2)}</Text>
          </View>

          {/* Barra de progreso general */}
          <View className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <View
              className={`h-full ${
                progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </View>
        </View>
      </View>

      {/* Botón nuevo presupuesto */}
      <View className="p-4">
        <Button title="Nuevo presupuesto" onPress={handleNewBudget} />
      </View>

      {/* Lista de presupuestos */}
      <FlatList
        data={budgets}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View className="px-4 py-2">
            <BudgetCard budget={item} onPress={() => handleBudgetPress(item)} />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">No hay presupuestos para este mes</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
