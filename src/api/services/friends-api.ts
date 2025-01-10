// src/api/services/friends-api.ts
import { request } from './api';

export interface Friend {
  id: number;
  friend: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  user_id: number;
  connection_date: string;
}

export interface CreateFriendDTO {
  user_id: number;
  friend_email: string;
}

export const friendsApi = {
  // Obtener todos los amigos
  getAll: () => request<Friend[]>('/friends'),

  // Obtener un amigo específico
  getById: (id: number) => request<Friend>(`/friends/${id}`),

  // Obtener amigos de un usuario
  getByUser: (userId: number) => request<Friend[]>(`/users/${userId}/friends`),

  // Crear una nueva amistad
  create: (data: CreateFriendDTO) => request<Friend>('/friends', 'POST', data),

  // Eliminar una amistad
  delete: (id: number) => request<{ deleted: boolean }>(`/friends/${id}`, 'DELETE'),
};
