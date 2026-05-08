export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string | null;
  status: 'active' | 'inactive' | 'suspended';
  role_name: 'customer' | 'admin' | 'super_admin';
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone_number?: string | null;
  password: string;
}