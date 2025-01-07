import { Transaction, TransactionFilters } from '@/types/transactions';
import { request } from './api';

export const transactionsApi = {
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
};
