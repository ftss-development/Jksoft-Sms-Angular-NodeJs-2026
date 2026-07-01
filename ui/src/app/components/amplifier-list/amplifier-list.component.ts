
import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AmplifierService } from '../../services/amplifier.service';
import { AmplifierStatus } from '../../models/amplifier.model';

@Component({
  selector: 'app-amplifier-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './amplifier-list.component.html',
  styleUrl: './amplifier-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmplifierListComponent {
  readonly amplifierService = inject(AmplifierService);
  readonly amplifiers = this.amplifierService.amplifiers;

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedAmplifiers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.amplifiers().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.amplifiers().length / this.pageSize));
  readonly startItemIndex = computed(() => this.amplifiers().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.amplifiers().length));

  get pages() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Computed stats
  readonly onlineCount = computed(() => this.amplifiers().filter(a => a.status === 'Active').length);
  readonly maintenanceCount = computed(() => this.amplifiers().filter(a => a.status === 'Maintenance').length);

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

  onDelete(id: number): void {
    this.amplifierService.deleteAmplifier(id);
  }
}
