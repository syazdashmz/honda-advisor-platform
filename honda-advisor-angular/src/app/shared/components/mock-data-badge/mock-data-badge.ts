import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mock-data-badge',
  imports: [],
  templateUrl: './mock-data-badge.html',
  styleUrl: './mock-data-badge.scss',
})
export class MockDataBadge {
  @Input() label = 'Sample Data';
  @Input() status = 'Verify before publishing';
}
