import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react-native';
import { Debt } from '@/types/debts';

interface DebtCardProps {
  debt: Debt;
  isCreditor?: boolean;
  onPress?: () => void;
}

export function DebtCard({ debt, isCreditor, onPress }: DebtCardProps) {
  return (
    <TouchableOpacity onPress={onPress} className="rounded-lg bg-white p-4 shadow">
      <View className="space-y-2">
        {/* Header con monto */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            <View className={`rounded-full p-2 ${isCreditor ? 'bg-green-100' : 'bg-red-100'}`}>
              {isCreditor ? (
                <ArrowUpRight size={24} color="#22c55e" />
              ) : (
                <ArrowDownLeft size={24} color="#ef4444" />
              )}
            </View>

            <View>
              <Text className="text-base font-medium text-gray-900">{debt.description}</Text>
              <Text className="text-sm text-gray-500">
                {debt.paid ? 'Pagada' : `Pendiente: $${debt.pending_amount}`}
              </Text>
            </View>
          </View>

          <Text
            className={`text-base font-semibold ${isCreditor ? 'text-green-600' : 'text-red-600'}`}
          >
            ${debt.original_amount}
          </Text>
        </View>

        {/* Footer con fecha */}
        <View className="flex-row items-center justify-between pt-2">
          <View className="flex-row items-center space-x-1 rounded-full bg-gray-100 px-2 py-1">
            <Calendar size={12} color="#6b7280" />
            <Text className="text-xs font-medium text-gray-600">
              Vence: {new Date(debt.due_date).toLocaleDateString()}
            </Text>
          </View>

          {debt.paid && (
            <View className="rounded-full bg-green-100 px-2 py-1">
              <Text className="text-xs font-medium text-green-600">Completada</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
