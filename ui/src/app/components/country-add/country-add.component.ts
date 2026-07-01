
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-country-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './country-add.component.html',
  styleUrl: './country-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly countryService = inject(CountryService);
  private readonly router: Router = inject(Router);
  
  isSubmitting = signal(false);

  countryForm = this.fb.group({
    fullName: ['', Validators.required],
    shortName: ['', Validators.required],
    code: ['', Validators.required],
    isActive: [true, Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.countryForm.valid) {
      this.isSubmitting.set(true);
      const formValue = this.countryForm.getRawValue();
      try {
        await this.countryService.addCountry({
          fullName: formValue.fullName!,
          shortName: formValue.shortName!,
          code: formValue.code!,
          statusId: formValue.isActive ? 1 : 2,
        });
        this.router.navigate(['/countries']);
      } catch (error) {
        console.error('Failed to add country', error);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.countryForm.markAllAsTouched();
      console.log('Form is invalid', this.countryForm.errors);
    }
  }

  onCancel(): void {
    this.router.navigate(['/countries']);
  }
}
