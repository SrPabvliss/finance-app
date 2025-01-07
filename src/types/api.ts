export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type AuthResponse = {
  id: number;
  email: string;
  name: string;
  username: string;
  token: string;
};
