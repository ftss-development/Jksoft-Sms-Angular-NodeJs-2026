
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { BankAccountService } from '../../services/bank-account.service';
import { Bank } from '../../models/bank.model';
import { BankAccount } from '../../models/bank-account.model';

@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './bank-detail.component.html',
  styleUrl: './bank-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankDetailComponent implements OnInit {
  private readonly bankService = inject(BankService);
  private readonly accountService = inject(BankAccountService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  bank: Bank | undefined;
  accounts = signal<BankAccount[]>([]);
  
  activeTab = signal<'accounts' | 'compliance' | 'contacts'>('accounts');

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bank = this.bankService.getBankById(idParam);
      if (this.bank) {
          // Fetch accounts associated with this bank
          const bankAccounts = this.accountService.getAccountsByBankId(this.bank.id);
          this.accounts.set(bankAccounts);
      }
    }
  }

  setActiveTab(tab: 'accounts' | 'compliance' | 'contacts') {
      this.activeTab.set(tab);
  }

  getMaskedAccountNumber(accNum: string): string {
    if (!accNum || accNum.length < 4) return accNum;
    return `**** ${accNum.slice(-4)}`;
  }
}
