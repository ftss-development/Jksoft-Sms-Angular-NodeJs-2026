
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaxService } from '../../services/tax.service';
import { TaxStatus } from '../../models/tax.model';

@Component({
  selector: 'app-tax-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tax-add.component.html',
  styleUrl: './tax-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly taxService = inject(TaxService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  taxForm = this.fb.group({
    taxName: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(30)]],
    value: [0.00, [Validators.required, Validators.min(0), Validators.max(100)]],
    effectiveDate: ['', Validators.required],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.taxForm.valid) {
      this.isSubmitting.set(true);
      const val = this.taxForm.getRawValue();
      try {
        // FIX: Removed properties not in the Omit type.
        await this.taxService.addTax({
            taxName: val.taxName!,
            shortName: val.shortName!,
            value: val.value!,
            effectiveDate: new Date(val.effectiveDate!),
            status: val.isActive ? 'Active' : 'Inactive',
        });
        this.router.navigate(['/taxes']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.taxForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/taxes']);
  }
}