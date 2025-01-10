import React, { useState } from 'react';
import { View } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PaymentMethodTypeSelector from './PaymentMethodTypeSelector';

interface PaymentMethodFormProps {
  initialValues?: {
    name?: string;
    type?: 'CASH' | 'CARD' | 'BANK_ACCOUNT';
    last_four_digits?: string;
  };
  onSubmit: (values: {
    name: string;
    type: 'CASH' | 'CARD' | 'BANK_ACCOUNT';
    last_four_digits?: string;
  }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function PaymentMethodForm({
  initialValues,
  onSubmit,
  isLoading,
  onCancel,
}: PaymentMethodFormProps) {
  const [values, setValues] = useState({
    name: initialValues?.name || '',
    type: initialValues?.type || 'CASH',
    last_four_digits: initialValues?.last_four_digits || '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    last_four_digits?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!values.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (values.type !== 'CASH' && !values.last_four_digits) {
      newErrors.last_four_digits = 'Los últimos 4 dígitos son requeridos';
    }

    if (values.last_four_digits && !/^\d{4}$/.test(values.last_four_digits)) {
      newErrors.last_four_digits = 'Debe contener exactamente 4 dígitos';
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
        label="Nombre"
        value={values.name}
        onChangeText={text => setValues({ ...values, name: text })}
        placeholder="Ej: Tarjeta principal"
        error={errors.name}
      />

      <PaymentMethodTypeSelector
        value={values.type}
        onChange={type => {
          setValues({ ...values, type, last_four_digits: '' });
          setErrors({});
        }}
      />

      {values.type !== 'CASH' && (
        <Input
          label="Últimos 4 dígitos"
          value={values.last_four_digits}
          onChangeText={text => {
            if (/^\d{0,4}$/.test(text)) {
              setValues({ ...values, last_four_digits: text });
              if (errors.last_four_digits) setErrors({ ...errors, last_four_digits: undefined });
            }
          }}
          placeholder="0000"
          keyboardType="numeric"
          maxLength={4}
          error={errors.last_four_digits}
        />
      )}

      <Button title="Guardar" onPress={handleSubmit} isLoading={isLoading} />
    </View>
  );
}
