import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Goal } from '@/types/goals';
import GoalsScreen from '@/screens/main/GoalsScreen';
import GoalFormScreen from '@/screens/main/GoalFormScreen';
import GoalDetailScreen from '@/screens/main/GoalDetailScreen';

export type GoalsStackParamList = {
  GoalsList: undefined;
  GoalFormScreen: {
    mode: 'create' | 'edit';
    goal?: Goal;
  };
  GoalDetail: {
    goal: Goal;
  };
};

const Stack = createNativeStackNavigator<GoalsStackParamList>();

export default function GoalsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GoalsList" component={GoalsScreen} options={{ title: 'Metas' }} />
      <Stack.Screen
        name="GoalFormScreen"
        component={GoalFormScreen}
        options={({ route }) => ({
          title: route.params.mode === 'create' ? 'Nueva Meta' : 'Editar Meta',
        })}
      />
      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{ title: 'Detalle de Meta' }}
      />
    </Stack.Navigator>
  );
}
