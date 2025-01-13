// src/api/services/debts-api.ts
import { request } from './api';
import { Debt } from '@/types/debts';

export const debtsApi = {
  // Obtener todas las deudas
  getAll: () => request<Debt[]>('/debts'),

  // Obtener una deuda específica
  getById: (id: number) => request<Debt>(`/debts/${id}`),

  // Obtener deudas donde el usuario es el deudor
  getDebts: (userId: number) => request<Debt[]>(`/users/${userId}/debts`),

  // Obtener deudas donde el usuario es el acreedor
  getCredits: (userId: number) => request<Debt[]>(`/users/${userId}/credits`),

  // Crear nueva deuda
  create: (data: Omit<Debt, 'id' | 'paid' | 'pending_amount'>) =>
    request<Debt>('/debts', 'POST', {
      ...data,
      original_amount: Number(data.original_amount),
      creditor_id: data.creditor_id === 0 ? undefined : data.creditor_id,
      pending_amount: Number(data.original_amount),
    }),

  // Actualizar deuda
  update: (id: number, data: Partial<Debt>) =>
    request<Debt>(`/debts/${id}`, 'PATCH', {
      ...data,
      original_amount: data.original_amount ? Number(data.original_amount) : undefined,
      pending_amount: data.pending_amount ? Number(data.pending_amount) : undefined,
    }),

  // Eliminar deuda
  delete: (id: number) => request<{ deleted: boolean }>(`/debts/${id}`, 'DELETE'),

  // Registrar pago de deuda
  registerPayment: (id: number, userId: number, amount: number) =>
    request<Debt>(`/debts/${id}/users/${userId}/pay`, 'POST', { amount }),
};
