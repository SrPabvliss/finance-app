import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DebtStackParamList } from '@/navigation/DebtNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { debtsApi } from '@/api/services/debts-api';
import { Debt } from '@/types/debts';
import { DebtCard } from '@/components/debts/debt-card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';

type DebtScreenNavigationProp = NativeStackNavigationProp<DebtStackParamList, 'DebtsList'>;

type TabType = 'debts' | 'credits';

export default function DebtsScreen() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [credits, setCredits] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('debts');
  const { user } = useAuth();
  const navigation = useNavigation<DebtScreenNavigationProp>();

  const loadDebts = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [debtsData, creditsData] = await Promise.all([
        debtsApi.getDebts(user.id),
        debtsApi.getCredits(user.id),
      ]);
      setDebts(debtsData);
      setCredits(creditsData);
    } catch (error) {
      console.error('Error loading debts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDebts();

    const unsubscribe = navigation.addListener('focus', () => {
      loadDebts();
    });

    return unsubscribe;
  }, [navigation, loadDebts]);

  const handleNewDebt = () => {
    navigation.navigate('DebtForm', { mode: 'create' });
  };

  const handleDebtPress = (debt: Debt) => {
    navigation.navigate('DebtDetail', { debt });
  };

  if (isLoading) {
    return <Loading />;
  }

  const activeDebts = activeTab === 'debts' ? debts : credits;
  const totalAmount = activeDebts.reduce((sum, debt) => sum + Number(debt.pending_amount), 0);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header y botón nuevo */}
      <View className="p-4">
        <Button title="Nueva deuda" onPress={handleNewDebt} />
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => setActiveTab('debts')}
          className={`flex-1 border-b-2 p-4 ${
            activeTab === 'debts' ? 'border-blue-500' : 'border-transparent'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === 'debts' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            Debo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('credits')}
          className={`flex-1 border-b-2 p-4 ${
            activeTab === 'credits' ? 'border-blue-500' : 'border-transparent'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === 'credits' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            Me deben
          </Text>
        </TouchableOpacity>
      </View>

      {/* Total */}
      <View className="bg-white p-4">
        <Text className="text-center text-sm text-gray-600">Total pendiente</Text>
        <Text className="text-center text-2xl font-bold text-gray-900">
          ${totalAmount.toFixed(2)}
        </Text>
      </View>

      {/* Lista */}
      <FlatList
        data={activeDebts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View className="px-4 py-2">
            <DebtCard
              debt={item}
              isCreditor={activeTab === 'credits'}
              onPress={() => handleDebtPress(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">
              No hay {activeTab === 'debts' ? 'deudas' : 'créditos'} pendientes
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
