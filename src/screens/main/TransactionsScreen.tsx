import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Transaction, TransactionFilters } from '@/types/transactions';
import { transactionsApi } from '@/api/services/transactions-api';
import TransactionList from '@/components/transactions/transaction-list';
import FilterComponent from '@/components/transactions/transaction-filters';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainTabParamList } from '@/types/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TransactionStackParamList } from '@/types/navigation';
import Loading from '@/components/ui/LoadingComponent';

type TransactionScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Transactions'>,
  NativeStackNavigationProp<TransactionStackParamList>
>;

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation<TransactionScreenNavigationProp>();

  const loadTransactions = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await transactionsApi.filter(user.id, filters);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    loadTransactions();

    const unsubscribe = navigation.addListener('focus', () => {
      loadTransactions();
    });

    return unsubscribe;
  }, [navigation, loadTransactions]);

  const handleNewTransaction = () => {
    console.log('New transaction');
    navigation.navigate('TransactionForm', {
      mode: 'create',
    });
  };

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail', {
      transaction,
    });
  };

  const handleFiltersApply = () => {
    setShowFilters(false);
    loadTransactions();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between p-4">
        <Button
          title={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          variant="secondary"
          onPress={() => setShowFilters(!showFilters)}
        />
        <Button
          title="Nueva transacción"
          onPress={() => {
            handleNewTransaction();
          }}
        />
      </View>

      {showFilters && (
        <FilterComponent
          filters={filters}
          onFiltersChange={setFilters}
          onApply={handleFiltersApply}
        />
      )}

      <TransactionList transactions={transactions} onItemPress={handleTransactionPress} />
    </SafeAreaView>
  );
}
