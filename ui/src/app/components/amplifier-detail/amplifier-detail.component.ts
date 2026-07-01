
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AmplifierService } from '../../services/amplifier.service';
import { Amplifier, AmplifierStatus } from '../../models/amplifier.model';

@Component({
  selector: 'app-amplifier-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './amplifier-detail.component.html',
  styleUrl: './amplifier-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmplifierDetailComponent implements OnInit {
  private readonly amplifierService = inject(AmplifierService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  amplifier: Amplifier | undefined;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.amplifier = this.amplifierService.getAmplifierById(+idParam);
    }
  }

  getStatusColor(status: AmplifierStatus): string {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
