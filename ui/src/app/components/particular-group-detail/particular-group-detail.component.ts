
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ParticularGroupService } from '../../services/particular-group.service';
import { ParticularService } from '../../services/particular.service';
import { ParticularGroup } from '../../models/particular-group.model';
import { Particular } from '../../models/particular.model';

@Component({
  selector: 'app-particular-group-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './particular-group-detail.component.html',
  styleUrl: './particular-group-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularGroupDetailComponent implements OnInit {
  private readonly groupService = inject(ParticularGroupService);
  private readonly particularService = inject(ParticularService);
  private readonly route = inject(ActivatedRoute);

  group = signal<ParticularGroup | undefined>(undefined);
  assignedParticulars = signal<Particular[]>([]);

  // Computed Stats
  totalValue = computed(() => {
      return this.assignedParticulars().reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0);
  });

  lastMonthValue = computed(() => {
      // Mock logic: randomly simpler value for demo calculation
      return this.totalValue() * 0.95; 
  });

  valueChangePercent = computed(() => {
      const current = this.totalValue();
      const last = this.lastMonthValue();
      if (last === 0) return 0;
      return ((current - last) / last) * 100;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          const foundGroup = this.groupService.getGroupById(+idParam);
          this.group.set(foundGroup);
          
          if (foundGroup) {
            // Fetch full particular objects based on IDs
            const allParticulars = this.particularService.particulars();
            const filtered = allParticulars.filter(p => foundGroup.assignedParticularIds.includes(p.id));
            this.assignedParticulars.set(filtered);
          }
        }
    });
  }

  getRiskColor(level: string | undefined): string {
      switch(level) {
          case 'High': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
          case 'Medium': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
          default: return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20';
      }
  }

  getRiskIcon(level: string | undefined): string {
      switch(level) {
          case 'High': return 'warning';
          case 'Medium': return 'error_outline';
          default: return 'verified_user';
      }
  }
}
