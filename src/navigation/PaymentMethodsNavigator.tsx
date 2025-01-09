// src/navigation/PaymentMethodsNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaymentMethod } from '@/api/services/payment-methods-api';
import PaymentMethodsScreen from '@/screens/main/PaymentMethodsScreen';
import PaymentMethodFormScreen from '@/screens/main/PaymentMethosFormScreen';

export type PaymentMethodsStackParamList = {
  PaymentMethodsList: undefined;
  PaymentMethodForm: {
    mode: 'create' | 'edit';
    paymentMethod?: PaymentMethod;
  };
};

const Stack = createNativeStackNavigator<PaymentMethodsStackParamList>();

export default function PaymentMethodsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PaymentMethodsList"
        component={PaymentMethodsScreen}
        options={{ title: 'Métodos de Pago' }}
      />
      <Stack.Screen
        name="PaymentMethodForm"
        component={PaymentMethodFormScreen}
        options={({ route }) => ({
          title: route.params.mode === 'create' ? 'Nuevo Método de Pago' : 'Editar Método de Pago',
        })}
      />
    </Stack.Navigator>
  );
}
