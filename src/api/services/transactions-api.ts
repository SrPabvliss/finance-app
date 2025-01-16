import { ScheduledTransaction, Transaction, TransactionFilters } from '@/types/transactions';
import { request } from './api';
import { CategoryTotal, MonthlyBalance, MonthlyTrend } from '@/types/dashboard';

export const transactionsApi = {
  // Endpoints existentes actualizados
  getAll: () => request<Transaction[]>('/transactions'),

  getById: (id: number) => request<Transaction>(`/transactions/${id}`),

  getByUser: (userId: number) => request<Transaction[]>(`/users/${userId}/transactions`),

  filter: (userId: number, filters: TransactionFilters) => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `/users/${userId}/transactions/filter${queryString ? `?${queryString}` : ''}`;

    return request<Transaction[]>(url);
  },

  create: (data: Omit<Transaction, 'id' | 'date'>) =>
    request<Transaction>('/transactions', 'POST', { ...data, amount: Number(data.amount) }),

  update: (id: number, data: Partial<Transaction>) =>
    request<Transaction>(`/transactions/${id}`, 'PATCH', {
      ...data,
      amount: data.amount ? Number(data.amount) : undefined,
    }),

  delete: (id: number) => request<{ deleted: boolean }>(`/transactions/${id}`, 'DELETE'),

  // Nuevos endpoints para transacciones programadas
  getScheduled: () => request<ScheduledTransaction[]>('/scheduled-transactions'),

  getScheduledById: (id: number) => request<ScheduledTransaction>(`/scheduled-transactions/${id}`),

  getScheduledByUser: (userId: number) =>
    request<ScheduledTransaction[]>(`/users/${userId}/scheduled-transactions`),

  createScheduled: (data: Omit<ScheduledTransaction, 'id'>) =>
    request<ScheduledTransaction>('/scheduled-transactions', 'POST', {
      ...data,
      amount: Number(data.amount),
    }),

  updateScheduled: (id: number, data: Partial<ScheduledTransaction>) =>
    request<ScheduledTransaction>(`/scheduled-transactions/${id}`, 'PATCH', {
      ...data,
      amount: data.amount ? Number(data.amount) : undefined,
    }),

  deleteScheduled: (id: number) =>
    request<{ deleted: boolean }>(`/scheduled-transactions/${id}`, 'DELETE'),

  // Endpoint para ejecutar manualmente transacciones programadas pendientes
  executePendingScheduled: () =>
    request<{ executed_count: number }>('/scheduled-transactions/pending', 'POST'),

  getMonthlyBalance: (userId: number, month: string) =>
    request<MonthlyBalance>(`/users/${userId}/balance/monthly?month=${month}`),

  getCategoryTotals: (userId: number, startDate: string, endDate: string) =>
    request<CategoryTotal[]>(
      `/users/${userId}/totals/category?startDate=${startDate}&endDate=${endDate}`
    ),

  getMonthlyTrends: (userId: number) => request<MonthlyTrend[]>(`/users/${userId}/trends/monthly`),
};
