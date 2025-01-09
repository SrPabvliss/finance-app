import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentMethod, paymentMethodsApi } from '@/api/services/payment-methods-api';
import { CreditCard, Landmark, Wallet } from 'lucide-react-native';
import Loading from '@/components/ui/LoadingComponent';

const PAYMENT_METHOD_ICONS = {
  CASH: Wallet,
  CARD: CreditCard,
  BANK_ACCOUNT: Landmark,
};

interface PaymentMethodSelectorProps {
  value?: number;
  onChange: (paymentMethodId: number | undefined) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!user) return;

      try {
        const data = await paymentMethodsApi.getByUser(user.id);
        setPaymentMethods(data);
      } catch (error) {
        console.error('Error loading payment methods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentMethods();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  if (paymentMethods.length === 0) {
    return (
      <View className="rounded-lg bg-gray-50 p-4">
        <Text className="text-center text-gray-500">No hay métodos de pago disponibles</Text>
      </View>
    );
  }

  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-gray-700">Método de pago</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
        {paymentMethods.map(method => {
          const isSelected = value === method.id;
          const Icon = PAYMENT_METHOD_ICONS[method.type];

          return (
            <TouchableOpacity
              key={method.id}
              onPress={() => onChange(method.id)}
              className={`
                flex-row items-center space-x-2 rounded-lg p-3
                ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
              `}
            >
              <Icon size={20} color={isSelected ? '#3b82f6' : '#6b7280'} />
              <View>
                <Text
                  className={`
                    text-sm font-medium
                    ${isSelected ? 'text-blue-600' : 'text-gray-600'}
                  `}
                >
                  {method.name}
                </Text>
                {method.last_four_digits && (
                  <Text className="text-xs text-gray-500">**** {method.last_four_digits}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
