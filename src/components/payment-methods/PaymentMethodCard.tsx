import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreditCard, Landmark, Wallet } from 'lucide-react-native';

const PAYMENT_METHOD_ICONS = {
  CASH: Wallet,
  CARD: CreditCard,
  BANK_ACCOUNT: Landmark,
};

interface PaymentMethodCardProps {
  id: number;
  name: string;
  type: 'CASH' | 'CARD' | 'BANK_ACCOUNT';
  last_four_digits?: string | null;
  onPress?: () => void;
}

export default function PaymentMethodCard({
  name,
  type,
  last_four_digits,
  onPress,
}: PaymentMethodCardProps) {
  const Icon = PAYMENT_METHOD_ICONS[type];

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between rounded-lg bg-white p-4 shadow"
    >
      <View className="flex-row items-center space-x-3">
        <View className="rounded-full bg-blue-100 p-2">
          <Icon size={24} color="#3b82f6" />
        </View>

        <View>
          <Text className="text-base font-medium text-gray-900">{name}</Text>
          {last_four_digits && (
            <Text className="text-sm text-gray-500">**** {last_four_digits}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}