
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-country-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './country-edit.component.html',
  styleUrl: './country-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  countryId: string | undefined;
  country: Country | undefined;
  isSubmitting = signal(false);

  countryForm = this.fb.group({
    fullName: ['', Validators.required],
    shortName: ['', Validators.required],
    code: ['', Validators.required],
    isActive: [true, Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.countryId = idParam;
      this.country = this.countryService.getCountryById(this.countryId);
      if (this.country) {
        this.countryForm.patchValue({
          fullName: this.country.fullName,
          shortName: this.country.shortName,
          code: this.country.code,
          isActive: this.country.statusId === 1,
        });
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.countryForm.valid && this.country) {
      this.isSubmitting.set(true);
      const formValue = this.countryForm.getRawValue();

      const updatedCountry: Country = {
        ...this.country,
        fullName: formValue.fullName!,
        shortName: formValue.shortName!,
        code: formValue.code!,
        statusId: formValue.isActive ? 1 : 2,
      };

      try {
        await this.countryService.updateCountry(updatedCountry);
        this.router.navigate(['/countries']);
      } catch (error) {
        console.error("Failed to update country", error);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.countryForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/countries']);
  }
}
