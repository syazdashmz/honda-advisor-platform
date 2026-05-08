export type InquiryStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'appointment_booked'
  | 'loan_processing'
  | 'won'
  | 'lost';

export type PreferredContactMethod =
  | 'whatsapp'
  | 'phone_call'
  | 'email';

export interface InquiryPayload {
  car_model_id?: number | null;
  full_name: string;
  phone_number: string;
  email?: string | null;
  budget_range?: string | null;
  monthly_budget?: string | null;
  buying_timeline?: string | null;
  needs_loan: boolean;
  has_trade_in: boolean;
  preferred_contact_method: PreferredContactMethod;
  message?: string | null;
  privacy_consent: boolean;
  lead_source: string;
}

export interface InquiryResult {
  id: number;
  car_model_id?: number | null;

  full_name: string;
  phone_number: string;
  email?: string | null;

  budget_range?: string | null;
  monthly_budget?: string | null;
  buying_timeline?: string | null;

  needs_loan: boolean;
  has_trade_in: boolean;

  preferred_contact_method: PreferredContactMethod;
  message?: string | null;

  privacy_consent: boolean;
  lead_source: string;

  status: InquiryStatus;

  car_model_name?: string | null;
  car_model_slug?: string | null;

  created_at?: string;
  updated_at?: string;
}