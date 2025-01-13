import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Debt } from '@/types/debts';
import DebtFormScreen from '@/screens/main/DebtFormScreen';
import DebtsScreen from '@/screens/main/DebtsScreen';
import DebtDetailScreen from '@/screens/main/DebtDetailScreen';

export type DebtStackParamList = {
  DebtsList: undefined;
  DebtForm: {
    mode: 'create' | 'edit';
    debt?: Debt;
  };
  DebtDetail: {
    debt: Debt;
  };
};

const Stack = createNativeStackNavigator<DebtStackParamList>();

export default function DebtNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DebtsList" component={DebtsScreen} options={{ title: 'Deudas' }} />
      <Stack.Screen
        name="DebtForm"
        component={DebtFormScreen}
        options={({ route }) => ({
          title: route.params.mode === 'create' ? 'Nueva Deuda' : 'Editar Deuda',
        })}
      />
      <Stack.Screen
        name="DebtDetail"
        component={DebtDetailScreen}
        options={{ title: 'Detalle de Deuda' }}
      />
    </Stack.Navigator>
  );
}
