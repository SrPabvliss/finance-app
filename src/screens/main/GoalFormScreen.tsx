import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GoalsStackParamList } from '@/navigation/GoalsNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { goalsApi } from '@/api/services/goals-api';
import { GoalForm } from '@/components/goals/goal-form';

type Props = NativeStackScreenProps<GoalsStackParamList, 'GoalFormScreen'>;

export default function GoalFormScreen({ route, navigation }: Props) {
  const { mode, goal: editingGoal } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    target_amount: string;
    current_amount?: string;
    end_date: string;
  }) => {
    if (!user) return;

    try {
      setIsLoading(true);

      const data = {
        ...values,
        user_id: user.id,
      };

      if (mode === 'create') {
        await goalsApi.create({ ...data, current_amount: data.current_amount || '0' });
      } else if (editingGoal) {
        await goalsApi.update(editingGoal.id, data);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <GoalForm initialValues={editingGoal} onSubmit={handleSubmit} isLoading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
}
