// screens/main/GoalDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GoalsStackParamList } from '@/navigation/GoalsNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { goalsApi } from '@/api/services/goals-api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/LoadingComponent';

type Props = NativeStackScreenProps<GoalsStackParamList, 'GoalDetail'>;

export default function GoalDetailScreen({ route, navigation }: Props) {
  const { goal } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(goal);
  const [progressAmount, setProgressAmount] = useState('');
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const handleEdit = () => {
    navigation.navigate('GoalFormScreen', {
      mode: 'edit',
      goal: currentGoal,
    });
  };

  const handleDelete = () => {
    Alert.alert('Eliminar meta', '¿Estás seguro de que deseas eliminar esta meta?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await goalsApi.delete(currentGoal.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la meta');
          }
        },
      },
    ]);
  };

  const handleUpdateProgress = async () => {
    if (!user || !progressAmount) return;

    try {
      setIsUpdatingProgress(true);
      const updatedGoal = await goalsApi.updateProgress(
        currentGoal.id,
        user.id,
        Number(progressAmount)
      );
      setCurrentGoal(updatedGoal);
      setProgressAmount('');
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'No se pudo actualizar el progreso');
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const loadGoal = async () => {
    try {
      setIsLoading(true);
      const updatedGoal = await goalsApi.getById(currentGoal.id);
      setCurrentGoal(updatedGoal);
    } catch (error) {
      console.error('Error loading goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadGoal();
    });

    return unsubscribe;
  }, [navigation]);

  if (isLoading) {
    return <Loading />;
  }

  const progress = (Number(currentGoal.current_amount) / Number(currentGoal.target_amount)) * 100;
  const remainingAmount = Number(currentGoal.target_amount) - Number(currentGoal.current_amount);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="space-y-6 p-4">
          {/* Header */}
          <View className="items-center space-y-2">
            <Text className="text-2xl font-bold text-gray-900">{currentGoal.name}</Text>
            <Text className="text-lg text-gray-600">
              Meta: ${Number(currentGoal.target_amount).toLocaleString()}
            </Text>
          </View>

          {/* Progress Section */}
          <View className="space-y-4 rounded-lg bg-gray-50 p-4">
            <View className="flex-row justify-between">
              <Text className="text-base font-medium text-gray-700">Progreso actual</Text>
              <Text className="text-base font-medium text-blue-600">
                ${Number(currentGoal.current_amount).toLocaleString()}
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <View
                className="h-full bg-blue-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">{progress.toFixed(1)}% completado</Text>
              <Text className="text-sm text-gray-600">
                Restante: ${remainingAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Date Section */}
          <View className="space-y-2">
            <Text className="text-base font-medium text-gray-700">Fecha límite</Text>
            <Text className="text-base text-gray-600">
              {new Date(currentGoal.end_date).toLocaleDateString()}
            </Text>
          </View>

          {/* Update Progress Section */}
          <View className="space-y-4">
            <Text className="text-base font-medium text-gray-700">Actualizar progreso</Text>
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Input
                  placeholder="Monto"
                  keyboardType="numeric"
                  value={progressAmount}
                  onChangeText={setProgressAmount}
                />
              </View>
              <Button
                title="Agregar"
                onPress={handleUpdateProgress}
                isLoading={isUpdatingProgress}
                disabled={!progressAmount}
              />
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Button title="Editar" onPress={handleEdit} />
            </View>
            <View className="flex-1">
              <Button title="Eliminar" variant="secondary" onPress={handleDelete} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
