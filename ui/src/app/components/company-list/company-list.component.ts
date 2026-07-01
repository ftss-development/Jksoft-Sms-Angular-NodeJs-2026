
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { CompanyStatus } from '../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyListComponent {
  private readonly companyService = inject(CompanyService);
  readonly companies = this.companyService.companies;

  isGenerating = signal(false);

  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedCompanies = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.companies().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.companies().length / this.pageSize));
  readonly startItemIndex = computed(() => this.companies().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.companies().length));

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

  getStatusClass(status: CompanyStatus): string {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Inactive': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this company?')) {
        this.companyService.deleteCompany(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.companyService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
