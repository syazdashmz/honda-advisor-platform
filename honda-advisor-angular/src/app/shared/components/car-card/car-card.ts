import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CarModel } from '../../../core/models/car.model';

@Component({
  selector: 'app-car-card',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './car-card.html',
  styleUrl: './car-card.scss',
})
export class CarCard {
  @Input({ required: true }) car!: CarModel;
}
