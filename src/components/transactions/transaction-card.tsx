import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowDownRight, ArrowUpRight, Calendar, Users } from 'lucide-react-native';
import { Transaction } from '@/types/transactions';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isIncome = transaction.type === 'INCOME';

  return (
    <TouchableOpacity onPress={onPress} className="rounded-lg bg-white p-4 shadow">
      <View className="space-y-2">
        {/* Header con monto y tipo */}
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

          <Text
            className={`text-base font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}
          >
            {isIncome ? '+' : '-'}${transaction.amount}
          </Text>
        </View>

        {/* Footer con badges de programada/compartida */}
        <View className="flex-row items-center space-x-2 pt-2">
          {transaction.scheduled_transaction_id && (
            <View className="flex-row items-center space-x-1 rounded-full bg-blue-100 px-2 py-1">
              <Calendar size={12} color="#3b82f6" />
              <Text className="text-xs font-medium text-blue-600">Programada</Text>
            </View>
          )}

          {transaction.shared_with_id && (
            <View className="flex-row items-center space-x-1 rounded-full bg-purple-100 px-2 py-1">
              <Users size={12} color="#9333ea" />
              <Text className="text-xs font-medium text-purple-600">Compartida</Text>
            </View>
          )}

          <Text className="ml-auto text-xs text-gray-500">
            {new Date(transaction.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
