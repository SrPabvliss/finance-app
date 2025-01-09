import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { PaymentMethod, paymentMethodsApi } from '@/api/services/payment-methods-api';
import { TransactionFilters } from '@/types/transactions';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onApply: () => void;
}

export default function TransactionFilterComponent({
  filters,
  onFiltersChange,
  onApply,
}: TransactionFiltersProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!user) return;
      try {
        const data = await paymentMethodsApi.getByUser(user.id);
        setPaymentMethods(data);
      } catch (error) {
        console.error('Error loading payment methods:', error);
      }
    };

    loadPaymentMethods();
  }, [user]);

  return (
    <View className="space-y-4 p-4">
      <View className="flex-row space-x-4">
        <View className="flex-1">
          <Input
            label="Desde"
            value={filters.startDate}
            onChangeText={text => onFiltersChange({ ...filters, startDate: text })}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Hasta"
            value={filters.endDate}
            onChangeText={text => onFiltersChange({ ...filters, endDate: text })}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>

      <View className="flex-row space-x-4">
        <View className="flex-1">
          <Input
            label="Monto mínimo"
            value={filters.min_amount?.toString()}
            onChangeText={text =>
              onFiltersChange({ ...filters, min_amount: Number(text) || undefined })
            }
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Monto máximo"
            value={filters.max_amount?.toString()}
            onChangeText={text =>
              onFiltersChange({ ...filters, max_amount: Number(text) || undefined })
            }
            keyboardType="numeric"
            placeholder="1000"
          />
        </View>
      </View>

      {paymentMethods.length > 0 && (
        <View>
          <Text className="mb-2 text-sm font-medium text-gray-700">Método de pago</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row space-x-2"
          >
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                onPress={() =>
                  onFiltersChange({
                    ...filters,
                    payment_method_id:
                      filters.payment_method_id === method.id ? undefined : method.id,
                  })
                }
                className={`
                  flex-row items-center space-x-2 rounded-lg px-4 py-2
                  ${filters.payment_method_id === method.id ? 'bg-blue-100' : 'bg-gray-100'}
                `}
              >
                <Text
                  className={`
                  text-sm font-medium
                  ${filters.payment_method_id === method.id ? 'text-blue-600' : 'text-gray-600'}
                `}
                >
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <Button title="Aplicar filtros" onPress={onApply} />
    </View>
  );
}
