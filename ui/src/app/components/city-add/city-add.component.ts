
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-city-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './city-add.component.html',
  styleUrl: './city-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly router: Router = inject(Router);

  readonly countries = this.countryService.countries;
  readonly allStates = this.stateService.states;
  
  // To handle filtered states based on selected country
  selectedCountryId = signal<string>('');
  
  readonly filteredStates = computed(() => {
    const countryId = this.selectedCountryId();
    if (!countryId) return [];
    return this.allStates().filter(s => s.countryId === countryId);
  });

  isSubmitting = signal(false);

  cityForm = this.fb.group({
    cityName: ['', Validators.required],
    cityCode: ['', Validators.required],
    shortName: ['', Validators.required],
    countryId: ['', Validators.required],
    stateId: ['', Validators.required],
    isActive: [true]
  });

  // Update states when country changes
  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryId.set(select.value);
    this.cityForm.get('stateId')?.setValue(''); // Reset state selection
  }

  async onSubmit(): Promise<void> {
    if (this.cityForm.valid) {
      this.isSubmitting.set(true);
      const val = this.cityForm.getRawValue();
      try {
        await this.cityService.addCity({
            cityName: val.cityName!,
            cityCode: val.cityCode!,
            shortName: val.shortName!,
            stateId: val.stateId!,
            countryId: val.countryId!,
            isActive: val.isActive!
        });
        this.router.navigate(['/cities']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.cityForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/cities']);
  }
}
