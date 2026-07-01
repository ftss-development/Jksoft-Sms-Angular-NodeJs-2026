
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StbSchemeService } from '../../services/stb-scheme.service';

@Component({
  selector: 'app-stb-scheme-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './stb-scheme-add.component.html',
  styleUrl: './stb-scheme-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StbSchemeAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly schemeService = inject(StbSchemeService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  schemeForm = this.fb.group({
    schemeName: ['', [Validators.required, Validators.maxLength(45)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.schemeForm.valid) {
      this.isSubmitting.set(true);
      const val = this.schemeForm.getRawValue();
      try {
        await this.schemeService.addScheme({
            schemeName: val.schemeName!,
            status: val.isActive ? 'Active' : 'Inactive',
            isActive: val.isActive!,
            description: '',
            rentalRate: 0,
            securityDeposit: 0,
            billingCycle: 'Monthly',
            contractPeriod: '12 Months'
        });
        this.router.navigate(['/stb-schemes']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.schemeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/stb-schemes']);
  }
}
