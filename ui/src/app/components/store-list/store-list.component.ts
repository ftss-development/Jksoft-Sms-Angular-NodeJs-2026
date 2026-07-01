
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { StoreStatus } from '../../models/store.model';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreListComponent {
  private readonly storeService = inject(StoreService);
  readonly stores = this.storeService.stores;

  searchTerm = signal('');
  statusFilter = signal<string>('All Statuses');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredStores = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    
    return this.stores().filter(s => {
        const matchesTerm = s.storeName.toLowerCase().includes(term) || s.id.toLowerCase().includes(term) || s.location.toLowerCase().includes(term);
        const matchesStatus = status === 'All Statuses' || s.status === status;
        return matchesTerm && matchesStatus;
    });
  });

  readonly paginatedStores = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredStores().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredStores().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredStores().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredStores().length));

  // Stats
  readonly totalStores = computed(() => this.stores().length);
  readonly activeCount = computed(() => this.stores().filter(s => s.status === 'Active').length);
  readonly maintenanceCount = computed(() => this.stores().filter(s => s.status === 'Maintenance').length);

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

  getStatusClass(status: StoreStatus): string {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Inactive': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      case 'Maintenance': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  getStatusDot(status: StoreStatus): string {
      switch(status) {
          case 'Active': return 'bg-emerald-500';
          case 'Maintenance': return 'bg-amber-500';
          default: return 'bg-slate-500';
      }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this store?')) {
        this.storeService.deleteStore(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.storeService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
