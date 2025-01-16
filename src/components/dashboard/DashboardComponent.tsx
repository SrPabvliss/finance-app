import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { transactionsApi } from '@/api/services/transactions-api';
import { ArrowDownRight, ArrowUpRight, PiggyBank } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { DashboardData } from '@/types/dashboard';

const BalanceCard: React.FC<{
  title: string;
  value: number;
  type: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon?: React.ReactNode;
}> = ({ title, value, type, subtitle, icon }) => {
  const getColorClass = () => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <View className="rounded-lg bg-white p-4 shadow">
      <View className="flex-row items-center justify-between">
        <View className="space-y-1">
          <Text className="text-sm font-medium text-gray-500">{title}</Text>
          <Text className={`text-xl font-bold ${getColorClass()}`}>${value.toLocaleString()}</Text>
          {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
        </View>
        {icon && <View className="rounded-full bg-blue-100 p-2">{icon}</View>}
      </View>
    </View>
  );
};

const DashboardComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { user } = useAuth();
  const screenWidth = Dimensions.get('window').width;

  const loadDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Obtener el primer día del mes actual en formato YYYY-MM-DD
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const startDate = firstDayOfMonth.toISOString().split('T')[0];
      const endDate = lastDayOfMonth.toISOString().split('T')[0];

      const [balance, categories, trends] = await Promise.all([
        transactionsApi.getMonthlyBalance(user.id, startDate),
        transactionsApi.getCategoryTotals(user.id, startDate, endDate),
        transactionsApi.getMonthlyTrends(user.id),
      ]);

      setDashboardData({
        monthlyBalance: balance,
        categoryTotals: categories,
        monthlyTrends: trends,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData({
        monthlyBalance: {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
        },
        categoryTotals: [],
        monthlyTrends: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Usar useFocusEffect en lugar de useEffect para recargar cuando la pantalla recibe el foco
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [user])
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No hay datos disponibles</Text>
      </View>
    );
  }

  const { monthlyBalance, categoryTotals, monthlyTrends } = dashboardData;

  const chartData = {
    labels: monthlyTrends.map(trend => trend.month),
    datasets: [
      {
        data: monthlyTrends.map(trend => trend.income),
        color: () => '#22c55e', // Verde para ingresos
        strokeWidth: 2,
      },
      {
        data: monthlyTrends.map(trend => trend.expense),
        color: () => '#ef4444', // Rojo para gastos
        strokeWidth: 2,
      },
    ],
    legend: ['Ingresos', 'Gastos'],
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Cards de balance */}
      <View className="p-4 space-y-4">
        <BalanceCard
          title="Ingresos del mes"
          value={monthlyBalance.totalIncome}
          type="positive"
          icon={<ArrowUpRight size={24} color="#22c55e" />}
        />
        <BalanceCard
          title="Gastos del mes"
          value={monthlyBalance.totalExpense}
          type="negative"
          icon={<ArrowDownRight size={24} color="#ef4444" />}
        />
        <BalanceCard
          title="Balance mensual"
          value={monthlyBalance.balance}
          type={monthlyBalance.balance >= 0 ? 'positive' : 'negative'}
          subtitle={`${monthlyBalance.balance >= 0 ? '+' : ''}${(
            (monthlyBalance.balance / (monthlyBalance.totalIncome || 1)) *
            100
          ).toFixed(1)}% vs ingresos`}
          icon={<PiggyBank size={24} color="#3b82f6" />}
        />
      </View>

      {/* Gráfico de tendencias */}
      {monthlyTrends.length > 0 && (
        <View className="bg-white p-4">
          <Text className="mb-4 text-base font-medium text-gray-700">Tendencias mensuales</Text>
          <View className="h-64">
            <LineChart
              data={chartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
      )}

      {/* Distribución de gastos */}
      {categoryTotals.length > 0 && (
        <View className="bg-white p-4 mt-4">
          <Text className="mb-4 text-base font-medium text-gray-700">Distribución de gastos</Text>
          <View className="space-y-3">
            {categoryTotals.map((category, index) => (
              <View key={index} className="flex-row justify-between items-center">
                <Text className="text-gray-600">{category.category}</Text>
                <Text className="font-medium text-gray-900">
                  ${category.total.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default DashboardComponent;
