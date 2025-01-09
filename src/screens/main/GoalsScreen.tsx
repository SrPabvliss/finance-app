import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { Goal } from '@/types/goals';
import { goalsApi } from '@/api/services/goals-api';
import { GoalList } from '@/components/goals/goal-list';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/LoadingComponent';
import { GoalsStackParamList } from '@/navigation/GoalsNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type GoalNavigationProp = NativeStackNavigationProp<GoalsStackParamList>;

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation<GoalNavigationProp>();

  const loadGoals = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await goalsApi.getByUser(user.id);
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadGoals();

    const unsubscribe = navigation.addListener('focus', () => {
      loadGoals();
    });

    return unsubscribe;
  }, [navigation, loadGoals]);

  const handleNewGoal = () => {
    navigation.navigate('GoalFormScreen', {
      mode: 'create',
    });
  };

  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetail', {
      goal,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Button title="Nueva meta" onPress={handleNewGoal} />
      </View>

      <GoalList goals={goals} onItemPress={handleGoalPress} />
    </SafeAreaView>
  );
}
