import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Goal } from '@/types/goals';
import { Target, Users } from 'lucide-react-native';

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;

  return (
    <TouchableOpacity onPress={onPress} className="rounded-lg bg-white p-4 shadow">
      {goal.shared_user_id && (
        <View className="my-2 flex-row items-center">
          <View className="flex-row items-center space-x-1 rounded-full bg-purple-100 px-2 py-1">
            <Users size={12} color="#9333ea" />
            <Text className="text-xs font-medium text-purple-600">Compartida</Text>
          </View>
        </View>
      )}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3">
          <View className="rounded-full bg-blue-100 p-2">
            <Target size={24} color="#3b82f6" />
          </View>

          <View>
            <Text className="text-base font-medium text-gray-900">{goal.name}</Text>
            <Text className="text-sm text-gray-500">Meta: ${goal.target_amount}</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-base font-semibold text-blue-600">${goal.current_amount}</Text>
          <Text className="text-sm text-gray-500">{progress.toFixed(0)}%</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <View className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
      </View>
    </TouchableOpacity>
  );
}
