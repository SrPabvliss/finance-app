// src/api/services/payment-methods-api.ts
import { request } from './api';

export interface PaymentMethod {
  id: number;
  user_id: number;
  name: string;
  type: 'CASH' | 'CARD' | 'BANK_ACCOUNT';
  last_four_digits?: string | null;
  shared_user_id?: number | null;
}

export type CreatePaymentMethodDTO = Omit<PaymentMethod, 'id'>;
export type UpdatePaymentMethodDTO = Partial<Omit<PaymentMethod, 'id' | 'user_id'>>;

export const paymentMethodsApi = {
  // Obtener todos los métodos de pago
  getAll: () => request<PaymentMethod[]>('/payment-methods'),

  // Obtener un método de pago específico
  getById: (id: number) => request<PaymentMethod>(`/payment-methods/${id}`),

  // Obtener métodos de pago de un usuario
  getByUser: (userId: number) => request<PaymentMethod[]>(`/users/${userId}/payment-methods`),

  // Obtener métodos de pago compartidos con un usuario
  getShared: (userId: number) =>
    request<PaymentMethod[]>(`/users/${userId}/shared-payment-methods`),

  // Crear un nuevo método de pago
  create: (data: CreatePaymentMethodDTO) =>
    request<PaymentMethod>('/payment-methods', 'POST', data),

  // Actualizar un método de pago existente
  update: (id: number, data: UpdatePaymentMethodDTO) =>
    request<PaymentMethod>(`/payment-methods/${id}`, 'PATCH', data),

  // Eliminar un método de pago
  delete: (id: number) => request<{ deleted: boolean }>(`/payment-methods/${id}`, 'DELETE'),

  // Compartir un método de pago con otro usuario
  share: (id: number, userId: number) =>
    request<PaymentMethod>(`/payment-methods/${id}`, 'PATCH', {
      shared_user_id: userId,
    }),

  // Dejar de compartir un método de pago
  unshare: (id: number) =>
    request<PaymentMethod>(`/payment-methods/${id}`, 'PATCH', {
      shared_user_id: null,
    }),
};
