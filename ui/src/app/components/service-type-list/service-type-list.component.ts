
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiceTypeService } from '../../services/service-type.service';
import { ServiceTypeStatus } from '../../models/service-type.model';

@Component({
  selector: 'app-service-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-type-list.component.html',
  styleUrl: './service-type-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceTypeListComponent {
  private readonly serviceTypeService = inject(ServiceTypeService);
  readonly serviceTypes = this.serviceTypeService.serviceTypes;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredServices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.serviceTypes().filter(s => 
      s.serviceName.toLowerCase().includes(term) || 
      s.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedServices = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredServices().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredServices().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredServices().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredServices().length));

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

  getStatusClass(status: ServiceTypeStatus): string {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Inactive': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      case 'Draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Deprecated': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusDot(status: ServiceTypeStatus): string {
      switch(status) {
          case 'Active': return 'bg-emerald-500';
          case 'Draft': return 'bg-blue-500';
          case 'Deprecated': return 'bg-amber-500';
          case 'Inactive': return 'bg-slate-500';
          default: return 'bg-slate-500';
      }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this service type?')) {
        this.serviceTypeService.deleteServiceType(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.serviceTypeService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
