// src/screens/main/DashboardScreen.tsx

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardComponent from '@/components/dashboard/DashboardComponent';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '@/types/types';

type Props = NativeStackScreenProps<MainTabParamList, 'Home'>;

export default function DashboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <DashboardComponent />
    </SafeAreaView>
  );
}
