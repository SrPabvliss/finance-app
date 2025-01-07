import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Transaction } from '@/types/transactions';
import TransactionCard from './transaction-card';

interface TransactionListProps {
  transactions: Transaction[];
  onItemPress?: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onItemPress }: TransactionListProps) {
  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionCard transaction={item} onPress={() => onItemPress?.(item)} />
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      className="flex-1"
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-gray-500">No hay transacciones</Text>
        </View>
      )}
    />
  );
}
