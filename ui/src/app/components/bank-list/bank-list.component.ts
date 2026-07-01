
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BankService } from '../../services/bank.service';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bank-list.component.html',
  styleUrl: './bank-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankListComponent {
  private readonly bankService = inject(BankService);
  readonly banks = this.bankService.banks;

  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedBanks = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.banks().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.banks().length / this.pageSize));
  readonly startItemIndex = computed(() => this.banks().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.banks().length));

  // Statistics
  readonly totalCount = computed(() => this.banks().length);
  readonly activeCount = computed(() => this.banks().filter(b => b.isActive).length);
  readonly inactiveCount = computed(() => this.banks().filter(b => !b.isActive).length);

  get pages() {
    // Limit visible pages for better UX if lots of pages
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
    if(confirm('Are you sure you want to delete this bank?')) {
        this.bankService.deleteBank(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.bankService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
