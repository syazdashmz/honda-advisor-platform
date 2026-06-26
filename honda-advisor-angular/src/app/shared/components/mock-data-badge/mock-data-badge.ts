import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mock-data-badge',
  imports: [],
  templateUrl: './mock-data-badge.html',
  styleUrl: './mock-data-badge.scss',
})
export class MockDataBadge {
  @Input() label = 'Needs Review';
  @Input() status = 'Verify before publishing';
}
