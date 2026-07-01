
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { SignalTypeService } from '../../services/signal-type.service';
import { SignalType } from '../../models/signal-type.model';

@Component({
  selector: 'app-signal-type-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './signal-type-detail.component.html',
  styleUrl: './signal-type-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalTypeDetailComponent implements OnInit {
  private readonly signalService = inject(SignalTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  signalType: SignalType | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.signalType = this.signalService.getSignalTypeById(id);
      }
  }

  onDelete(): void {
      if (this.signalType && confirm('Are you sure you want to delete this signal type? This action cannot be undone.')) {
          this.signalService.deleteSignalType(this.signalType.id);
          this.router.navigate(['/signal-types']);
      }
  }
}
