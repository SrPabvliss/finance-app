import { Goal } from '@/types/goals';
import { request } from './api';

export const goalsApi = {
  getAll: () => request<Goal[]>('/goals'),

  getById: (id: number) => request<Goal>(`/goals/${id}`),

  getByUser: (userId: number) => request<Goal[]>(`/users/${userId}/goals`),

  getShared: (userId: number) => request<Goal[]>(`/users/${userId}/shared-goals`),

  create: (data: Omit<Goal, 'id'>) =>
    request<Goal>('/goals', 'POST', {
      ...data,
      target_amount: Number(data.target_amount),
      current_amount: Number(data.current_amount || 0),
    }),

  update: (id: number, data: Partial<Goal>) =>
    request<Goal>(`/goals/${id}`, 'PATCH', {
      ...data,
      target_amount: data.target_amount ? Number(data.target_amount) : undefined,
      current_amount: data.current_amount ? Number(data.current_amount) : undefined,
    }),

  delete: (id: number) => request<{ deleted: boolean }>(`/goals/${id}`, 'DELETE'),

  updateProgress: (id: number, userId: number, amount: number) =>
    request<Goal>(`/goals/${id}/users/${userId}/progress`, 'POST', { amount }),
};
