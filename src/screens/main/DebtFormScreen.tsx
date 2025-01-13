import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DebtStackParamList } from '@/navigation/DebtNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { debtsApi } from '@/api/services/debts-api';
import { DebtForm } from '@/components/debts/debt-form';

type Props = NativeStackScreenProps<DebtStackParamList, 'DebtForm'>;

export default function DebtFormScreen({ route, navigation }: Props) {
  const { mode, debt: editingDebt } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {
    description: string;
    original_amount: string;
    due_date: string;
    creditor_id?: number;
  }) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = {
        ...values,
        user_id: user.id,
      };

      if (mode === 'create') {
        await debtsApi.create({
          ...data,
          creditor_id: data.creditor_id || 0,
        });
      } else if (editingDebt) {
        await debtsApi.update(editingDebt.id, data);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving debt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <DebtForm
          mode={mode}
          initialValues={editingDebt}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
