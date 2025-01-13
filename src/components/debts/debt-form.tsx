import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FriendSelector from '@/components/friends/FriendSelectorComponent';

interface DebtFormProps {
  initialValues?: Partial<{
    description: string;
    original_amount: string;
    due_date: string;
    creditor_id: number;
  }>;
  mode: 'create' | 'edit';
  onSubmit: (values: {
    description: string;
    original_amount: string;
    due_date: string;
    creditor_id?: number;
  }) => void;
  isLoading?: boolean;
}

export function DebtForm({ initialValues, mode, onSubmit, isLoading }: DebtFormProps) {
  const [values, setValues] = useState({
    description: initialValues?.description || '',
    original_amount: initialValues?.original_amount || '',
    due_date: initialValues?.due_date
      ? new Date(initialValues.due_date).toISOString().split('T')[0]
      : '',
    creditor_id: initialValues?.creditor_id,
  });

  const [errors, setErrors] = useState<{
    description?: string;
    original_amount?: string;
    due_date?: string;
    creditor_id?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!values.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!values.original_amount) {
      newErrors.original_amount = 'El monto es requerido';
    } else if (isNaN(Number(values.original_amount)) || Number(values.original_amount) <= 0) {
      newErrors.original_amount = 'El monto debe ser un número positivo';
    }

    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!values.due_date) {
      newErrors.due_date = 'La fecha de vencimiento es requerida';
    } else if (!dateRegex.test(values.due_date)) {
      newErrors.due_date = 'Formato inválido. Use YYYY-MM-DD';
    }

    if (mode === 'create' && !values.creditor_id) {
      newErrors.creditor_id = 'El acreedor es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <View className="space-y-4">
      <Input
        label="Descripción"
        value={values.description}
        onChangeText={text => setValues({ ...values, description: text })}
        placeholder="Ej: Préstamo para el auto"
        error={errors.description}
      />

      <Input
        label="Monto"
        value={values.original_amount}
        onChangeText={text => setValues({ ...values, original_amount: text })}
        placeholder="0.00"
        keyboardType="numeric"
        error={errors.original_amount}
      />

      <Input
        label="Fecha de vencimiento (YYYY-MM-DD)"
        value={values.due_date}
        onChangeText={text => {
          setValues({ ...values, due_date: text });
          setErrors(prev => ({ ...prev, due_date: undefined }));
        }}
        placeholder="YYYY-MM-DD"
        error={errors.due_date}
      />

      {mode === 'create' && (
        <View>
          <FriendSelector
            enabled={true}
            selectedFriendId={values.creditor_id}
            onToggle={() => {}}
            onFriendSelect={friendId => setValues({ ...values, creditor_id: friendId })}
            checkboxMessage="Añadir acreedor"
          />
          {errors.creditor_id && (
            <Text className="mt-1 text-sm text-red-500">{errors.creditor_id}</Text>
          )}
        </View>
      )}

      <Button
        title={mode === 'create' ? 'Crear' : 'Actualizar'}
        onPress={handleSubmit}
        isLoading={isLoading}
      />
    </View>
  );
}
