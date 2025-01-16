import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BudgetStackParamList } from '@/navigation/BudgetNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { BudgetForm } from '@/components/budgets/budget-form';
import { budgetsApi } from '@/api/services/budget-api';

type Props = NativeStackScreenProps<BudgetStackParamList, 'BudgetForm'>;

export default function BudgetFormScreen({ route, navigation }: Props) {
  const { mode, budget: editingBudget } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {
    category: string;
    limit_amount: string;
    month: string;
    shared_user_id?: number | null;
  }) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = {
        ...values,
        user_id: user.id,
      };

      if (mode === 'create') {
        await budgetsApi.create(data);
      } else if (editingBudget) {
        await budgetsApi.update(editingBudget.id, data);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <BudgetForm
          initialValues={{
            ...editingBudget,
            shared_user_id: editingBudget?.shared_user_id ?? undefined,
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
