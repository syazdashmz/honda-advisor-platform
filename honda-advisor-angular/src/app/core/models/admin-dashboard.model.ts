export interface AdminDashboardSummary {
  total_inquiries: number;
  total_appointments: number;
  pending_appointments: number;
  active_car_models: number;
  total_loan_calculations: number;
}

export interface AdminRecentInquiry {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string | null;
  budget_range?: string | null;
  monthly_budget?: string | null;
  buying_timeline?: string | null;
  preferred_contact_method: string;
  status: string;
  car_model_name?: string | null;
  created_at?: string;
}

export interface AdminRecentAppointment {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string | null;
  appointment_type: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  car_model_name?: string | null;
  created_at?: string;
}

export interface AdminDashboardData {
  summary: AdminDashboardSummary;
  recent_inquiries: AdminRecentInquiry[];
  recent_appointments: AdminRecentAppointment[];
}