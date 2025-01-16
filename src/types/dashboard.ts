// src/types/reports.ts

export interface MonthlyBalance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

// Tipos específicos para gráficos
export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  month: string;
  income: number;
  expense: number;
}

// Props para componentes
export interface BalanceCardProps {
  title: string;
  amount: number;
  type?: 'income' | 'expense' | 'balance';
  subtitle?: string;
  isLoading?: boolean;
}

export interface CategoryBreakdownProps {
  data: CategoryTotal[];
  isLoading?: boolean;
}

export interface TrendChartProps {
  data: MonthlyTrend[];
  isLoading?: boolean;
}

// Props para filtros
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

// Response types para la API
export interface DashboardData {
  monthlyBalance: MonthlyBalance;
  categoryTotals: CategoryTotal[];
  monthlyTrends: MonthlyTrend[];
}
