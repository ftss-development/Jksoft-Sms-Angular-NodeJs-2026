
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AreaService } from '../../services/area.service';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-area-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './area-add.component.html',
  styleUrl: './area-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly areaService = inject(AreaService);
  private readonly districtService = inject(DistrictService);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly router: Router = inject(Router);

  // Data Sources
  readonly countries = this.countryService.countries;
  readonly allStates = this.stateService.states;
  readonly allCities = this.cityService.cities;
  readonly allDistricts = this.districtService.districts;

  // Selections for cascading logic
  selectedCountryId = signal<string>('');
  selectedStateId = signal<string>('');
  selectedCityId = signal<string>('');

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

  readonly filteredDistricts = computed(() => {
    const cid = this.selectedCityId();
    if (!cid) return [];
    return this.allDistricts().filter(d => d.cityId === cid);
  });

  isSubmitting = signal(false);

  areaForm = this.fb.group({
    name: ['', Validators.required],
    shortName: ['', Validators.required],
    pinCode: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    countryId: ['', Validators.required],
    stateId: ['', Validators.required],
    cityId: ['', Validators.required],
    districtId: ['', Validators.required],
    isActive: [true]
  });

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryId.set(select.value);
    
    // Reset downward
    this.selectedStateId.set('');
    this.selectedCityId.set('');
    this.areaForm.get('stateId')?.setValue('');
    this.areaForm.get('cityId')?.setValue('');
    this.areaForm.get('districtId')?.setValue('');
  }

  onStateChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStateId.set(select.value);
    
    // Reset downward
    this.selectedCityId.set('');
    this.areaForm.get('cityId')?.setValue('');
    this.areaForm.get('districtId')?.setValue('');
  }

  onCityChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCityId.set(select.value);
    
    // Reset downward
    this.areaForm.get('districtId')?.setValue('');
  }

  async onSubmit(): Promise<void> {
    if (this.areaForm.valid) {
      this.isSubmitting.set(true);
      const val = this.areaForm.getRawValue();
      try {
        await this.areaService.addArea({
            name: val.name!,
            shortName: val.shortName!,
            pinCode: val.pinCode!,
            countryId: val.countryId!,
            stateId: val.stateId!,
            cityId: val.cityId!,
            districtId: val.districtId!,
            isActive: val.isActive!
        });
        this.router.navigate(['/areas']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.areaForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/areas']);
  }
}
