import React, { useEffect } from 'react';
import { View } from 'react-native';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FriendSelector from '@/components/friends/FriendSelectorComponent';

interface GoalFormProps {
  initialValues?: Partial<{
    name: string;
    target_amount: string;
    current_amount: string;
    end_date: string;
    shared_user_id?: number | null;
  }>;
  onSubmit: (values: {
    name: string;
    target_amount: string;
    current_amount?: string;
    end_date: string;
    shared_user_id?: number;
  }) => void;
  isLoading?: boolean;
}

export function GoalForm({ initialValues, onSubmit, isLoading }: GoalFormProps) {
  const [values, setValues] = React.useState({
    name: initialValues?.name || '',
    target_amount: initialValues?.target_amount || '',
    current_amount: initialValues?.current_amount || '',
    end_date: initialValues?.end_date || '',
    is_shared: !!initialValues?.shared_user_id,
    shared_user_id: initialValues?.shared_user_id,
  });

  const [errors, setErrors] = React.useState<{
    name?: string;
    target_amount?: string;
    end_date?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!values.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!values.target_amount) {
      newErrors.target_amount = 'El monto objetivo es requerido';
    } else if (isNaN(Number(values.target_amount)) || Number(values.target_amount) <= 0) {
      newErrors.target_amount = 'El monto objetivo debe ser un número positivo';
    }

    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!values.end_date) {
      newErrors.end_date = 'La fecha límite es requerida';
    } else if (!dateRegex.test(values.end_date)) {
      newErrors.end_date = 'Formato inválido. Use YYYY-MM-DD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...values,
        shared_user_id:
          values.is_shared && values.shared_user_id !== null ? values.shared_user_id : undefined,
      });
    }
  };

  useEffect(() => {
    if (initialValues?.end_date) {
      setValues(prev => ({
        ...prev,
        end_date: initialValues.end_date
          ? new Date(initialValues.end_date).toISOString().split('T')[0]
          : '',
      }));
    }
  }, [initialValues]);

  return (
    <View className="space-y-4">
      <Input
        label="Nombre de la meta"
        value={values.name}
        onChangeText={text => setValues({ ...values, name: text })}
        placeholder="Ej: Nuevo auto"
      />

      <Input
        label="Monto objetivo"
        value={values.target_amount}
        onChangeText={text => setValues({ ...values, target_amount: text })}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Input
        label="Monto inicial (opcional)"
        value={values.current_amount}
        onChangeText={text => setValues({ ...values, current_amount: text })}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Input
        label="Fecha límite (YYYY-MM-DD)"
        value={values.end_date}
        onChangeText={text => {
          setValues({ ...values, end_date: text });
          setErrors(prev => ({ ...prev, end_date: undefined }));
        }}
        placeholder="YYYY-MM-DD"
        error={errors.end_date}
      />

      <FriendSelector
        enabled={values.is_shared}
        selectedFriendId={values.shared_user_id ?? undefined}
        onToggle={() =>
          setValues({
            ...values,
            is_shared: !values.is_shared,
            shared_user_id: !values.is_shared ? values.shared_user_id : undefined,
          })
        }
        onFriendSelect={friendId => setValues({ ...values, shared_user_id: friendId })}
        checkboxMessage="Compartir meta"
      />

      <Button title="Guardar" onPress={handleSubmit} isLoading={isLoading} />
    </View>
  );
}
