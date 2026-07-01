
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BankAccountService } from '../../services/bank-account.service';
import { BankService } from '../../services/bank.service';
import { CompanyService } from '../../services/company.service';
import { AccountType, BankAccount } from '../../models/bank-account.model';

@Component({
  selector: 'app-bank-account-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './bank-account-edit.component.html',
  styleUrl: './bank-account-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly accountService = inject(BankAccountService);
  private readonly bankService = inject(BankService);
  private readonly companyService = inject(CompanyService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  accountId: string | undefined;
  account: BankAccount | undefined;
  
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
    ifscCode: ['', Validators.required],
    swiftCode: [''],
    micrCode: [''],
    merchantName: [''],
    isActive: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.accountId = idParam;
      this.account = this.accountService.getAccountById(this.accountId);
      if (this.account) {
        this.accountForm.patchValue({
          accountName: this.account.accountName,
          accountNumber: this.account.accountNumber,
          bankId: this.account.bankId,
          branchName: this.account.branchName,
          accountType: this.account.accountType,
          companyId: this.account.companyId,
          isDefault: this.account.isDefault,
          ifscCode: this.account.ifscCode,
          swiftCode: this.account.swiftCode,
          micrCode: this.account.micrCode,
          merchantName: this.account.merchantName,
          isActive: this.account.isActive
        });
      } else {
        this.router.navigate(['/bank-accounts']);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.accountForm.valid && this.account) {
      this.isSubmitting.set(true);
      const val = this.accountForm.getRawValue();
      
      const updatedAccount: BankAccount = {
        ...this.account,
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
        merchantName: val.merchantName || ''
      };

      try {
        await this.accountService.updateBankAccount(updatedAccount);
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
