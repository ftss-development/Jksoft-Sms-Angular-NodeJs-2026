
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { DistrictStatus } from '../../models/district.model';

@Component({
  selector: 'app-district-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './district-add.component.html',
  styleUrl: './district-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly districtService = inject(DistrictService);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly router: Router = inject(Router);

  // Data Sources
  readonly countries = this.countryService.countries;
  readonly allStates = this.stateService.states;
  readonly allCities = this.cityService.cities;

  // Selections for cascading logic
  selectedCountryId = signal<string>('');
  selectedStateId = signal<string>('');

  // Derived lists
  readonly filteredStates = computed(() => {
    const cid = this.selectedCountryId();
    if (!cid) return [];
    return this.allStates().filter(s => s.countryId === cid);
  });

  readonly filteredCities = computed(() => {
    const sid = this.selectedStateId();
    if (!sid) return [];
    return this.allCities().filter(c => c.stateId === sid);
  });

  isSubmitting = signal(false);

  districtForm = this.fb.group({
    name: ['', Validators.required],
    districtCode: ['', Validators.required],
    shortName: ['', Validators.required],
    countryId: ['', Validators.required],
    stateId: ['', Validators.required],
    cityId: ['', Validators.required],
    status: ['Active' as DistrictStatus, Validators.required]
  });

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryId.set(select.value);
    this.selectedStateId.set(''); // Reset State selection
    this.districtForm.get('stateId')?.setValue('');
    this.districtForm.get('cityId')?.setValue('');
  }

  onStateChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStateId.set(select.value);
    this.districtForm.get('cityId')?.setValue('');
  }

  async onSubmit(): Promise<void> {
    if (this.districtForm.valid) {
      this.isSubmitting.set(true);
      const val = this.districtForm.getRawValue();
      try {
        await this.districtService.addDistrict({
            name: val.name!,
            districtCode: val.districtCode!,
            shortName: val.shortName!,
            countryId: val.countryId!,
            stateId: val.stateId!,
            cityId: val.cityId!,
            status: val.status as DistrictStatus
        });
        this.router.navigate(['/districts']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.districtForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/districts']);
  }
}
