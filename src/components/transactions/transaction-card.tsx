import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import { Transaction } from '@/types/transactions';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isIncome = transaction.type === 'INCOME';

  return (
    <TouchableOpacity onPress={onPress} className="rounded-lg bg-white p-4 shadow">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3">
          <View className={`rounded-full p-2 ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
            {isIncome ? (
              <ArrowUpRight size={24} color="#22c55e" />
            ) : (
              <ArrowDownRight size={24} color="#ef4444" />
            )}
          </View>

          <View>
            <Text className="text-base font-medium text-gray-900">{transaction.category}</Text>
            {transaction.description && (
              <Text className="text-sm text-gray-500">{transaction.description}</Text>
            )}
          </View>
        </View>

        <Text className={`text-base font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}${transaction.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
