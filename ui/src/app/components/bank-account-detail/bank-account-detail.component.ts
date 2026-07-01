
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BankAccountService } from '../../services/bank-account.service';
import { BankService } from '../../services/bank.service';
import { CompanyService } from '../../services/company.service';
import { BankAccount } from '../../models/bank-account.model';

@Component({
  selector: 'app-bank-account-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './bank-account-detail.component.html',
  styleUrl: './bank-account-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountDetailComponent implements OnInit {
  private readonly accountService = inject(BankAccountService);
  private readonly bankService = inject(BankService);
  private readonly companyService = inject(CompanyService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  account: BankAccount | undefined;
  bankName: string = '';
  companyName: string = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.account = this.accountService.getAccountById(idParam);
      if (this.account) {
        const bank = this.bankService.getBankById(this.account.bankId);
        this.bankName = bank ? bank.bankName : 'Unknown Bank';
        
        const company = this.companyService.getCompanyById(this.account.companyId);
        this.companyName = company ? company.companyName : 'Unknown Company';
      }
    }
  }

  getMaskedAccountNumber(accNum: string): string {
    if (!accNum || accNum.length < 4) return accNum;
    return `XXXX - XXXX - ${accNum.slice(-4)}`;
  }
}
