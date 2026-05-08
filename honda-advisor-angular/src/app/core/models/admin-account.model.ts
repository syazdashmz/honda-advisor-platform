export interface AdminProfileUpdatePayload {
  full_name: string;
  email: string;
  phone_number?: string | null;
}

export interface AdminPasswordUpdatePayload {
  current_password: string;
  new_password: string;
}

export interface CreateAdminPayload {
  full_name: string;
  email: string;
  phone_number?: string | null;
  password: string;
  role_name: 'admin' | 'super_admin';
}