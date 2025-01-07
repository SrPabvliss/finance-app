import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionStackParamList } from '@/types/navigation';
import TransactionFormScreen from '@/screens/main/TransactionFormScreen';
import TransactionDetailScreen from '@/screens/main/TransactionDetailScreen';
import TransactionsScreen from '@/screens/main/TransactionsScreen';

const Stack = createNativeStackNavigator<TransactionStackParamList>();

export default function TransactionNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="TransactionList"
        component={TransactionsScreen}
        options={{ title: 'Transacciones' }}
      />
      <Stack.Screen
        name="TransactionForm"
        component={TransactionFormScreen}
        options={({ route }) => ({
          title: route.params.mode === 'create' ? 'Nueva Transacción' : 'Editar Transacción',
        })}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: 'Detalle de Transacción' }}
      />
    </Stack.Navigator>
  );
}
