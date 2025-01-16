// src/navigation/MainNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/types';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import TransactionNavigator from './TransactionNavigator';
import GoalsNavigator from './GoalsNavigator';
import { DollarSign, Home, PiggyBank, Receipt, User, Wallet } from 'lucide-react-native';
import DebtNavigator from './DebtNavigator';
import BudgetNavigator from './BudgetNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionNavigator}
        options={{
          title: 'Transacciones',
          tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsNavigator}
        options={{
          title: 'Metas',
          tabBarIcon: ({ color, size }) => <PiggyBank color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Debts"
        component={DebtNavigator}
        options={{
          title: 'Deudas',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Budgets"
        component={BudgetNavigator}
        options={{
          title: 'Presupuestos',
          tabBarIcon: ({ color, size }) => <DollarSign color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
