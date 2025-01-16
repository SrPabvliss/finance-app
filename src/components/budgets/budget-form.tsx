import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FriendSelector from '@/components/friends/FriendSelectorComponent';

const BUDGET_CATEGORIES = [
  'FOOD',
  'TRANSPORT',
  'UTILITIES',
  'ENTERTAINMENT',
  'HEALTHCARE',
  'EDUCATION',
  'SHOPPING',
  'HOUSING',
  'OTHER',
] as const;

interface BudgetFormProps {
  initialValues?: Partial<{
    category: string;
    limit_amount: string;
    month: string;
    shared_user_id?: number;
  }>;
  onSubmit: (values: {
    category: string;
    limit_amount: string;
    month: string;
    shared_user_id?: number;
  }) => void;
  isLoading?: boolean;
}

export function BudgetForm({ initialValues, onSubmit, isLoading }: BudgetFormProps) {
  const [values, setValues] = useState({
    category: initialValues?.category || '',
    limit_amount: initialValues?.limit_amount || '',
    month: initialValues?.month ? new Date(initialValues.month).toISOString().split('T')[0] : '',
    is_shared: !!initialValues?.shared_user_id,
    shared_user_id: initialValues?.shared_user_id,
  });

  const [errors, setErrors] = useState<{
    category?: string;
    limit_amount?: string;
    month?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!values.category) {
      newErrors.category = 'La categoría es requerida';
    } else if (!BUDGET_CATEGORIES.includes(values.category as any)) {
      newErrors.category = 'Categoría inválida';
    }

    if (!values.limit_amount) {
      newErrors.limit_amount = 'El límite es requerido';
    } else if (isNaN(Number(values.limit_amount)) || Number(values.limit_amount) <= 0) {
      newErrors.limit_amount = 'El límite debe ser un número positivo';
    }

    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;
    if (!values.month) {
      newErrors.month = 'El mes es requerido';
    } else if (!monthRegex.test(values.month)) {
      newErrors.month = 'Formato inválido. Use YYYY-MM';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...values,
        shared_user_id: values.is_shared ? values.shared_user_id : undefined,
      });
    }
  };

  return (
    <View className="space-y-4">
      {/* Category Selector - Could be extracted to a separate component */}
      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">Categoría</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row space-x-2"
        >
          {BUDGET_CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => setValues({ ...values, category })}
              className={`rounded-full px-4 py-2 ${
                values.category === category ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  values.category === category ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.category && <Text className="mt-1 text-sm text-red-500">{errors.category}</Text>}
      </View>

      <Input
        label="Límite mensual"
        value={values.limit_amount}
        onChangeText={text => setValues({ ...values, limit_amount: text })}
        placeholder="0.00"
        keyboardType="numeric"
        error={errors.limit_amount}
      />

      <Input
        label="Mes (YYYY-MM)"
        value={values.month}
        onChangeText={text => {
          setValues({ ...values, month: text });
          setErrors(prev => ({ ...prev, month: undefined }));
        }}
        placeholder="YYYY-MM"
        error={errors.month}
      />

      <FriendSelector
        enabled={values.is_shared}
        selectedFriendId={values.shared_user_id}
        onToggle={() =>
          setValues({
            ...values,
            is_shared: !values.is_shared,
            shared_user_id: !values.is_shared ? values.shared_user_id : undefined,
          })
        }
        onFriendSelect={friendId => setValues({ ...values, shared_user_id: friendId })}
      />

      <Button title="Guardar" onPress={handleSubmit} isLoading={isLoading} />
    </View>
  );
}
