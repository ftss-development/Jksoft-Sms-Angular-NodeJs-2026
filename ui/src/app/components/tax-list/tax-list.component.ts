
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TaxService } from '../../services/tax.service';
import { TaxStatus } from '../../models/tax.model';

@Component({
  selector: 'app-tax-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './tax-list.component.html',
  styleUrl: './tax-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxListComponent {
  private readonly taxService = inject(TaxService);
  readonly taxes = this.taxService.taxes;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredTaxes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.taxes().filter(t => 
      t.taxName.toLowerCase().includes(term) || 
      t.id.toLowerCase().includes(term) ||
      t.shortName.toLowerCase().includes(term)
    );
  });

  readonly paginatedTaxes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredTaxes().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredTaxes().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredTaxes().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredTaxes().length));

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

  getStatusClass(status: TaxStatus): string {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Inactive': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      case 'Pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  getStatusDot(status: TaxStatus): string {
      switch(status) {
          case 'Active': return 'bg-emerald-500';
          case 'Pending': return 'bg-blue-500';
          default: return 'bg-slate-500';
      }
  }

  async onDelete(id: string): Promise<void> {
    if(confirm('Are you sure you want to delete this tax rule?')) {
        await this.taxService.deleteTax(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.taxService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
