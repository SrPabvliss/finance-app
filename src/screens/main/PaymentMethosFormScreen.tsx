import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import PaymentMethodForm from '@/components/payment-methods/PaymentMethodForm';
import { paymentMethodsApi } from '@/api/services/payment-methods-api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PaymentMethodsStackParamList } from '@/navigation/PaymentMethodsNavigator';

type PaymentMethodFormScreenNavigationProp = NativeStackNavigationProp<
  PaymentMethodsStackParamList,
  'PaymentMethodForm'
>;

export default function PaymentMethodFormScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: PaymentMethodFormScreenNavigationProp;
}) {
  const { mode, paymentMethod } = route.params;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = {
        ...values,
        user_id: user.id,
      };

      if (mode === 'create') {
        await paymentMethodsApi.create(data);
      } else {
        await paymentMethodsApi.update(paymentMethod.id, data);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <PaymentMethodForm
          initialValues={paymentMethod}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
