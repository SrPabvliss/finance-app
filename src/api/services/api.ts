import ENV from '@/config/env';
import { ApiResponse, AuthResponse } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function request<T>(
  endpoint: string,
  method: RequestMethod = 'GET',
  data?: any
): Promise<T> {
  const token = await AsyncStorage.getItem('@token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  console.log('[API Request]', {
    url: `${ENV.API_URL}${endpoint}`,
    method,
    headers,
    body: data,
  });

  try {
    const response = await fetch(`${ENV.API_URL}${endpoint}`, config);

    console.log('[API Raw Response]', {
      status: response.status,
      statusText: response.statusText,
      headers: Array.from(response.headers.entries()),
    });

    const json = (await response.json()) as ApiResponse<T>;

    console.log('[API JSON Response]', json);

    if (!response.ok) {
      // Mostrar toast en caso de error
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: json.message || 'Ha ocurrido un error',
      });
      throw new Error(json.message || `HTTP ${response.status} ${response.statusText}`);
    }

    // Mostrar toast en caso de éxito
    if (json.message) {
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: json.message,
      });
    }

    return json.data;
  } catch (error) {
    console.error('[API Error]', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Mostrar toast genérico si el error no es manejado por la API
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error instanceof Error ? error.message : 'Error desconocido',
    });

    throw error;
  }
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', 'POST', credentials),

    register: (data: { email: string; password: string; name: string; username: string }) =>
      request<AuthResponse>('/auth/register', 'POST', data),
  },
};
