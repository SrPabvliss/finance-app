import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Goal } from '@/types/goals';
import { GoalCard } from './goal-card';

interface GoalListProps {
  goals: Goal[];
  onItemPress?: (goal: Goal) => void;
}

export function GoalList({ goals, onItemPress }: GoalListProps) {
  const renderItem = ({ item }: { item: Goal }) => (
    <GoalCard goal={item} onPress={() => onItemPress?.(item)} />
  );

  return (
    <FlatList
      data={goals}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      className="flex-1"
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-gray-500">No hay metas financieras</Text>
        </View>
      )}
    />
  );
}
