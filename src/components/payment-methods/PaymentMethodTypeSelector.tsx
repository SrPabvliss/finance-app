import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CreditCard, Landmark, Wallet } from 'lucide-react-native';

const PAYMENT_TYPES = [
  {
    value: 'CASH',
    label: 'Efectivo',
    Icon: Wallet,
  },
  {
    value: 'CARD',
    label: 'Tarjeta',
    Icon: CreditCard,
  },
  {
    value: 'BANK_ACCOUNT',
    label: 'Cuenta',
    Icon: Landmark,
  },
] as const;

interface PaymentMethodTypeSelectorProps {
  value: 'CASH' | 'CARD' | 'BANK_ACCOUNT';
  onChange: (type: 'CASH' | 'CARD' | 'BANK_ACCOUNT') => void;
}

export default function PaymentMethodTypeSelector({
  value,
  onChange,
}: PaymentMethodTypeSelectorProps) {
  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-gray-700">Tipo de método de pago</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
        {PAYMENT_TYPES.map(type => {
          const isSelected = value === type.value;
          const Icon = type.Icon;

          return (
            <TouchableOpacity
              key={type.value}
              onPress={() => onChange(type.value)}
              className={`
                flex-row items-center space-x-2 rounded-lg px-4 py-2
                ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
              `}
            >
              <Icon size={20} color={isSelected ? '#3b82f6' : '#6b7280'} />
              <Text
                className={`
                  text-sm font-medium
                  ${isSelected ? 'text-blue-600' : 'text-gray-600'}
                `}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
