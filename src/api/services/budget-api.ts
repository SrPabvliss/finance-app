import { Budget } from '@/types/budegets';
import { request } from './api';

export const budgetsApi = {
  // Obtener todos los presupuestos
  getAll: () => request<Budget[]>('/budgets'),

  // Obtener un presupuesto específico
  getById: (id: number) => request<Budget>(`/budgets/${id}`),

  // Obtener presupuestos de un usuario
  getByUser: (userId: number) => request<Budget[]>(`/users/${userId}/budgets`),

  // Obtener presupuestos por mes
  getByUserAndMonth: (userId: number, month: string) =>
    request<Budget[]>(`/users/${userId}/budgets/month?month=${month}`),

  // Obtener presupuestos compartidos con un usuario
  getSharedWithUser: (userId: number) => request<Budget[]>(`/users/${userId}/shared-budgets`),

  // Crear nuevo presupuesto
  create: (data: Omit<Budget, 'id' | 'current_amount'>) =>
    request<Budget>('/budgets', 'POST', {
      ...data,
      limit_amount: Number(data.limit_amount),
    }),

  // Actualizar presupuesto
  update: (id: number, data: Partial<Budget>) =>
    request<Budget>(`/budgets/${id}`, 'PATCH', {
      ...data,
      limit_amount: data.limit_amount ? Number(data.limit_amount) : undefined,
      current_amount: data.current_amount ? Number(data.current_amount) : undefined,
    }),

  // Eliminar presupuesto
  delete: (id: number) => request<{ deleted: boolean }>(`/budgets/${id}`, 'DELETE'),

  // Actualizar monto actual
  updateAmount: (id: number, userId: number, amount: number) =>
    request<Budget>(`/budgets/${id}/users/${userId}/amount`, 'POST', { amount }),
};
