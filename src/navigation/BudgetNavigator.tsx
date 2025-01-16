import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Budget } from '@/types/budegets';
import BudgetsScreen from '@/screens/main/BudgetScreen';
import BudgetFormScreen from '@/screens/main/BudgetFormScreen';
import BudgetDetailScreen from '@/screens/main/BudgetDetailScreen';

export type BudgetStackParamList = {
  BudgetsList: undefined;
  BudgetForm: {
    mode: 'create' | 'edit';
    budget?: Budget;
  };
  BudgetDetail: {
    budget: Budget;
  };
};

const Stack = createNativeStackNavigator<BudgetStackParamList>();

export default function BudgetNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BudgetsList"
        component={BudgetsScreen}
        options={{ title: 'Presupuestos' }}
      />
      <Stack.Screen
        name="BudgetForm"
        component={BudgetFormScreen}
        options={({ route }) => ({
          title: route.params.mode === 'create' ? 'Nuevo Presupuesto' : 'Editar Presupuesto',
        })}
      />
      <Stack.Screen
        name="BudgetDetail"
        component={BudgetDetailScreen}
        options={{ title: 'Detalle de Presupuesto' }}
      />
    </Stack.Navigator>
  );
}
