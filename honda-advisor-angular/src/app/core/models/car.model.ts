export interface CarModel {
  id: number;
  name: string;
  slug: string;
  category: 'sedan' | 'hatchback' | 'suv' | 'ev' | 'performance';
  fuel_type: 'petrol' | 'hybrid' | 'ev';
  estimated_price_from: number;
  short_description: string;
  best_for: string;
  hero_image_url: string;
  brochure_url?: string | null;
  is_featured: boolean;
  is_active: boolean;
  data_mode: 'mock' | 'verified' | 'archived';
  is_mock_data: boolean;
  data_status: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarVariant {
  id: number;
  car_model_id: number;
  variant_name: string;
  estimated_price: number;
  engine: string;
  transmission: string;
  fuel_type: 'petrol' | 'hybrid' | 'ev';
  key_highlights: string;
  recommended_for: string;
  sort_order: number;
  is_active: boolean;
  data_mode: 'mock' | 'verified' | 'archived';
  is_mock_data: boolean;
  data_status: string;
}

export interface CarImage {
  id: number;
  car_model_id: number;
  car_variant_id?: number | null;
  image_url: string;
  alt_text: string;
  image_type: string;
  sort_order: number;
  data_mode: 'mock' | 'verified' | 'archived';
  is_mock_data: boolean;
  data_status: string;
}

export interface CarFeature {
  id: number;
  car_model_id: number;
  feature_title: string;
  feature_description: string;
  feature_category: string;
  sort_order: number;
  data_mode: 'mock' | 'verified' | 'archived';
  is_mock_data: boolean;
  data_status: string;
}

export interface CarColor {
  id: number;
  car_model_id: number;
  color_name: string;
  color_hex: string;
  image_url: string;
  sort_order: number;
  data_mode: 'mock' | 'verified' | 'archived';
  is_mock_data: boolean;
  data_status: string;
}

export interface CarDetail extends CarModel {
  variants: CarVariant[];
  images: CarImage[];
  features: CarFeature[];
  colors: CarColor[];
}