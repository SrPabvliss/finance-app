import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertTriangle, Users } from 'lucide-react-native';
import { Budget } from '@/types/budegets';

interface BudgetCardProps {
  budget: Budget;
  onPress?: () => void;
}

export function BudgetCard({ budget, onPress }: BudgetCardProps) {
  const progress = (Number(budget.current_amount) / Number(budget.limit_amount)) * 100;
  const isExceeded = progress > 100;

  return (
    <TouchableOpacity onPress={onPress} className="rounded-lg bg-white p-4 shadow">
      <View className="space-y-2">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-medium text-gray-900">{budget.category}</Text>
            <Text className="text-sm text-gray-500">
              <Text className="text-sm text-gray-500">
                {new Intl.DateTimeFormat('es-ES', {
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(new Date(budget.month))}
              </Text>
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-base font-semibold text-blue-600">
              ${budget.current_amount} / ${budget.limit_amount}
            </Text>
            <Text
              className={`text-sm ${
                isExceeded ? 'text-red-500' : progress >= 80 ? 'text-yellow-500' : 'text-gray-500'
              }`}
            >
              {progress.toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <View
            className={`h-full ${
              isExceeded ? 'bg-red-500' : progress >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </View>

        {/* Indicators */}
        <View className="mt-2 flex-row items-center justify-between">
          {budget.shared_user_id && (
            <View className="flex-row items-center space-x-1 rounded-full bg-purple-100 px-2 py-1">
              <Users size={12} color="#9333ea" />
              <Text className="text-xs font-medium text-purple-600">Compartido</Text>
            </View>
          )}

          {isExceeded && (
            <View className="flex-row items-center space-x-1 rounded-full bg-red-100 px-2 py-1 ml-auto">
              <AlertTriangle size={12} color="#ef4444" />
              <Text className="text-xs font-medium text-red-600">Excedido</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
