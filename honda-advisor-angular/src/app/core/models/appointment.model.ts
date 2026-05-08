export type AppointmentType =
  | 'showroom_visit'
  | 'test_drive'
  | 'loan_consultation'
  | 'trade_in_valuation'
  | 'model_comparison'
  | 'delivery_discussion';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'declined'
  | 'cancelled'
  | 'completed'
  | 'rescheduled';

export interface AppointmentPayload {
  inquiry_id?: number | null;
  car_model_id?: number | null;
  full_name: string;
  phone_number: string;
  email?: string | null;
  appointment_type: AppointmentType;
  preferred_date: string;
  preferred_time: string;
  message?: string | null;
}

export interface AppointmentResult {
  id: number;
  user_id?: number | null;
  inquiry_id?: number | null;
  car_model_id?: number | null;

  full_name: string;
  phone_number: string;
  email?: string | null;

  appointment_type: AppointmentType;
  preferred_date: string;
  preferred_time: string;
  message?: string | null;

  status: AppointmentStatus;

  car_model_name?: string | null;
  car_model_slug?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;

  created_at?: string;
  updated_at?: string;
}

export interface AppointmentAvailability {
  date: string;
  unavailable_slots: string[];
}