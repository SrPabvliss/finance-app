import React from 'react';
import { View } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { TransactionFilters } from '@/types/transactions';

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

      <Button title="Aplicar filtros" onPress={onApply} />
    </View>
  );
}
