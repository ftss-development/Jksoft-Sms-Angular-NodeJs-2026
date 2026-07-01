
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BankService } from '../../services/bank.service';

@Component({
  selector: 'app-bank-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bank-add.component.html',
  styleUrl: './bank-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly bankService = inject(BankService);
  private readonly router: Router = inject(Router);

  isSubmitting = signal(false);

  bankForm = this.fb.group({
    bankName: ['', [Validators.required, Validators.maxLength(60)]],
    shortName: ['', [Validators.required, Validators.maxLength(3)]],
    code: ['', [Validators.maxLength(15)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.bankForm.valid) {
      this.isSubmitting.set(true);
      const val = this.bankForm.getRawValue();
      try {
        await this.bankService.addBank({
            bankName: val.bankName!,
            shortName: val.shortName!,
            code: val.code || '',
            isActive: val.isActive!
        });
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
