import { CarModel, CarVariant } from './car.model';

export interface AdminCarModel extends CarModel {
  variant_count?: number;
}

export interface AdminCarDetail extends CarModel {
  variants: CarVariant[];
}