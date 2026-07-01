
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BankAccountService } from '../../services/bank-account.service';
import { BankService } from '../../services/bank.service';
import { AccountType } from '../../models/bank-account.model';

@Component({
  selector: 'app-bank-account-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bank-account-list.component.html',
  styleUrl: './bank-account-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountListComponent {
  private readonly accountService = inject(BankAccountService);
  private readonly bankService = inject(BankService);

  readonly accounts = this.accountService.bankAccounts;
  readonly banks = this.bankService.banks;

  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedAccounts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.accounts().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.accounts().length / this.pageSize));
  readonly startItemIndex = computed(() => this.accounts().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.accounts().length));

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

  // Helpers
  getBankName(bankId: string): string {
    return this.banks().find(b => b.id === bankId)?.bankName || 'Unknown Bank';
  }

  getMaskedAccountNumber(accNum: string): string {
    if (!accNum || accNum.length < 4) return accNum;
    return `**** ${accNum.slice(-4)}`;
  }

  getTypeClass(type: AccountType): string {
    switch (type) {
        case 'Checking': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        case 'Savings': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'Investment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        case 'Escrow': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this bank account?')) {
        this.accountService.deleteBankAccount(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.accountService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
