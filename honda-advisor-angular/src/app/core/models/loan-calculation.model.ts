export interface LoanCalculationPayload {
  user_id?: number | null;
  car_model_id?: number | null;
  car_variant_id?: number | null;
  car_price: number;
  down_payment: number;
  interest_rate: number;
  loan_years: number;
  trade_in_value: number;
}

export interface LoanCalculationResult {
  id?: number;
  user_id?: number | null;
  car_model_id?: number | null;
  car_variant_id?: number | null;

  car_price: number;
  down_payment: number;
  interest_rate: number;
  loan_years: number;
  trade_in_value: number;

  loan_amount: number;
  total_interest: number;
  estimated_monthly_payment: number;
  advisor_note: string;

  car_model_name?: string | null;
  car_variant_name?: string | null;
  disclaimer?: string;

  created_at?: string;
  updated_at?: string;
}