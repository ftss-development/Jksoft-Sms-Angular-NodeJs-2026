
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BankAccountService } from '../../services/bank-account.service';
import { BankService } from '../../services/bank.service';
import { CompanyService } from '../../services/company.service';
import { AccountType } from '../../models/bank-account.model';

@Component({
  selector: 'app-bank-account-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './bank-account-add.component.html',
  styleUrl: './bank-account-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly accountService = inject(BankAccountService);
  private readonly bankService = inject(BankService);
  private readonly companyService = inject(CompanyService);
  private readonly router: Router = inject(Router);

  // Dropdown data sources
  readonly banks = this.bankService.banks;
  readonly companies = this.companyService.companies;
  readonly accountTypes: AccountType[] = ['Checking', 'Savings', 'Investment', 'Escrow', 'Overdraft'];

  isSubmitting = signal(false);

  accountForm = this.fb.group({
    accountName: ['', Validators.required],
    accountNumber: ['', [Validators.required, Validators.maxLength(18), Validators.pattern(/^\d+$/)]],
    bankId: ['', Validators.required],
    branchName: ['', Validators.required],
    accountType: ['', Validators.required],
    companyId: ['', Validators.required],
    isDefault: [false],
    // Identifiers
    ifscCode: ['', Validators.required],
    swiftCode: [''],
    micrCode: [''],
    merchantName: [''],
    isActive: [true]
  });

  async onSubmit(): Promise<void> {
    if (this.accountForm.valid) {
      this.isSubmitting.set(true);
      const val = this.accountForm.getRawValue();
      try {
        await this.accountService.addBankAccount({
            accountName: val.accountName!,
            accountNumber: val.accountNumber!,
            bankId: val.bankId!,
            branchName: val.branchName!,
            accountType: val.accountType as AccountType,
            companyId: val.companyId!,
            isDefault: val.isDefault!,
            isActive: val.isActive!,
            ifscCode: val.ifscCode!,
            swiftCode: val.swiftCode || '',
            micrCode: val.micrCode || '',
            merchantName: val.merchantName || '',
            currency: 'USD' // Default
        });
        this.router.navigate(['/bank-accounts']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.accountForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/bank-accounts']);
  }
}
