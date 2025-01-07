import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';

interface TransactionTypeSelectorProps {
  value: 'INCOME' | 'EXPENSE';
  onChange: (type: 'INCOME' | 'EXPENSE') => void;
}

export default function TransactionTypeSelector({ value, onChange }: TransactionTypeSelectorProps) {
  return (
    <View className="flex-row space-x-4">
      <TouchableOpacity
        onPress={() => onChange('INCOME')}
        className={`flex-1 flex-row items-center justify-center space-x-2 rounded-lg p-4 ${
          value === 'INCOME' ? 'bg-green-100' : 'bg-gray-100'
        }`}
      >
        <ArrowUpRight size={24} color={value === 'INCOME' ? '#22c55e' : '#6b7280'} />
        <Text
          className={`text-base font-medium ${
            value === 'INCOME' ? 'text-green-600' : 'text-gray-600'
          }`}
        >
          Ingreso
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChange('EXPENSE')}
        className={`flex-1 flex-row items-center justify-center space-x-2 rounded-lg p-4 ${
          value === 'EXPENSE' ? 'bg-red-100' : 'bg-gray-100'
        }`}
      >
        <ArrowDownRight size={24} color={value === 'EXPENSE' ? '#ef4444' : '#6b7280'} />
        <Text
          className={`text-base font-medium ${
            value === 'EXPENSE' ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          Gasto
        </Text>
      </TouchableOpacity>
    </View>
  );
}
