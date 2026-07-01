
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // For @if, @for, etc.

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContentComponent {
  // Any logic related to dashboard charts, stats can go here.
  // For now, it's just presenting the static layout.
}
