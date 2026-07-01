
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-status-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusListComponent {
  private readonly statusService = inject(StatusService);
  readonly statuses = this.statusService.statuses;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredStatuses = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.statuses().filter(s => 
      s.statusName.toLowerCase().includes(term) || 
      s.statusFor.toLowerCase().includes(term) ||
      s.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedStatuses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredStatuses().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredStatuses().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredStatuses().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredStatuses().length));

  get pages() {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array(total).fill(0).map((x, i) => i + 1);
    
    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);
    if (end === total) start = Math.max(end - 4, 1);
    
    const p = [];
    for(let i = start; i <= end; i++) p.push(i);
    return p;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this status?')) {
        this.statusService.deleteStatus(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.statusService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }

  // Helper to determine badge style based on name (mock logic for visual variety)
  getBadgeClass(name: string): string {
      const n = name.toLowerCase();
      if (n.includes('active') || n.includes('approved') || n.includes('success')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      if (n.includes('pending') || n.includes('review')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      if (n.includes('suspended') || n.includes('warning')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      if (n.includes('closed') || n.includes('inactive') || n.includes('rejected')) return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
  }
}
