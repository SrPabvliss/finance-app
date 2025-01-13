import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';

const FREQUENCIES = [
  { value: 'DAILY', label: 'Diario' },
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensual' },
  { value: 'YEARLY', label: 'Anual' },
] as const;

interface TransactionScheduleSelectorProps {
  enabled: boolean;
  frequency?: (typeof FREQUENCIES)[number]['value'];
  nextExecutionDate?: string;
  onToggle: () => void;
  onFrequencyChange: (frequency: (typeof FREQUENCIES)[number]['value']) => void;
  onDateChange: (date: string) => void;
}

export default function TransactionScheduleSelector({
  enabled,
  frequency,
  nextExecutionDate,
  onToggle,
  onFrequencyChange,
  onDateChange,
}: TransactionScheduleSelectorProps) {
  return (
    <View className="space-y-4">
      <TouchableOpacity onPress={onToggle} className="flex-row items-center space-x-2">
        <View
          className={`h-6 w-6 items-center justify-center rounded-md border ${enabled ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
        >
          <View className={`h-3 w-3 rounded-sm ${enabled ? 'bg-white' : 'bg-transparent'}`} />
        </View>
        <Text className="text-base text-gray-700">Programar transacción</Text>
      </TouchableOpacity>

      {enabled && (
        <View className="space-y-4">
          <View>
            <Text className="mb-2 text-sm font-medium text-gray-700">Frecuencia</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row space-x-2"
            >
              {FREQUENCIES.map(freq => (
                <TouchableOpacity
                  key={freq.value}
                  onPress={() => onFrequencyChange(freq.value)}
                  className={`
                    flex-row items-center space-x-2 rounded-lg px-4 py-2
                    ${frequency === freq.value ? 'bg-blue-100' : 'bg-gray-100'}
                  `}
                >
                  <Clock size={20} color={frequency === freq.value ? '#3b82f6' : '#6b7280'} />
                  <Text
                    className={`
                      text-sm font-medium
                      ${frequency === freq.value ? 'text-blue-600' : 'text-gray-600'}
                    `}
                  >
                    {freq.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-gray-700">Fecha de inicio</Text>
            <TouchableOpacity
              onPress={() => {
                // Por ahora solo actualizamos con la fecha actual
                // TODO: Implementar selector de fecha
                const today = new Date().toISOString().split('T')[0];
                onDateChange(today);
              }}
              className="flex-row items-center space-x-2 rounded-lg bg-gray-100 px-4 py-3"
            >
              <Calendar size={20} color="#6b7280" />
              <Text className="text-base text-gray-700">
                {nextExecutionDate || 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
