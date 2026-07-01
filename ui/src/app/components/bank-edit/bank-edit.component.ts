
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { Bank } from '../../models/bank.model';

@Component({
  selector: 'app-bank-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bank-edit.component.html',
  styleUrl: './bank-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly bankService = inject(BankService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  bankId: string | undefined;
  bank: Bank | undefined;
  isSubmitting = signal(false);

  bankForm = this.fb.group({
    bankName: ['', [Validators.required, Validators.maxLength(60)]],
    shortName: ['', [Validators.required, Validators.maxLength(3)]],
    code: ['', [Validators.maxLength(15)]],
    isActive: [true, Validators.required]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bankId = idParam;
      this.bank = this.bankService.getBankById(this.bankId);
      if (this.bank) {
        this.bankForm.patchValue({
          bankName: this.bank.bankName,
          shortName: this.bank.shortName,
          code: this.bank.code,
          isActive: this.bank.isActive
        });
      } else {
        this.router.navigate(['/banks']);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.bankForm.valid && this.bank) {
      this.isSubmitting.set(true);
      const val = this.bankForm.getRawValue();
      
      const updatedBank: Bank = {
        ...this.bank,
        bankName: val.bankName!,
        shortName: val.shortName!,
        code: val.code || '',
        isActive: val.isActive!
      };

      try {
        await this.bankService.updateBank(updatedBank);
        this.router.navigate(['/banks']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.bankForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/banks']);
  }
}
