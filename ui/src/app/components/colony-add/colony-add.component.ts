
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ColonyService } from '../../services/colony.service';
import { AreaService } from '../../services/area.service';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-colony-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './colony-add.component.html',
  styleUrl: './colony-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColonyAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly colonyService = inject(ColonyService);
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
  readonly allAreas = this.areaService.areas;

  // Selections for cascading logic
  selectedCountryId = signal<string>('');
  selectedStateId = signal<string>('');
  selectedCityId = signal<string>('');
  selectedDistrictId = signal<string>('');

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

  readonly filteredAreas = computed(() => {
    const did = this.selectedDistrictId();
    if (!did) return [];
    return this.allAreas().filter(a => a.districtId === did);
  });

  isSubmitting = signal(false);

  colonyForm = this.fb.group({
    name: ['', Validators.required],
    shortName: ['', Validators.required],
    countryId: ['', Validators.required],
    stateId: ['', Validators.required],
    cityId: ['', Validators.required],
    districtId: ['', Validators.required],
    areaId: ['', Validators.required],
    isActive: [true]
  });

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryId.set(select.value);
    
    // Reset downward
    this.selectedStateId.set('');
    this.selectedCityId.set('');
    this.selectedDistrictId.set('');
    this.colonyForm.get('stateId')?.setValue('');
    this.colonyForm.get('cityId')?.setValue('');
    this.colonyForm.get('districtId')?.setValue('');
    this.colonyForm.get('areaId')?.setValue('');
  }

  onStateChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStateId.set(select.value);
    
    // Reset downward
    this.selectedCityId.set('');
    this.selectedDistrictId.set('');
    this.colonyForm.get('cityId')?.setValue('');
    this.colonyForm.get('districtId')?.setValue('');
    this.colonyForm.get('areaId')?.setValue('');
  }

  onCityChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCityId.set(select.value);
    
    // Reset downward
    this.selectedDistrictId.set('');
    this.colonyForm.get('districtId')?.setValue('');
    this.colonyForm.get('areaId')?.setValue('');
  }

  onDistrictChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedDistrictId.set(select.value);
    
    // Reset downward
    this.colonyForm.get('areaId')?.setValue('');
  }

  async onSubmit(): Promise<void> {
    if (this.colonyForm.valid) {
      this.isSubmitting.set(true);
      const val = this.colonyForm.getRawValue();
      try {
        await this.colonyService.addColony({
            name: val.name!,
            shortName: val.shortName!,
            countryId: val.countryId!,
            stateId: val.stateId!,
            cityId: val.cityId!,
            districtId: val.districtId!,
            areaId: val.areaId!,
            isActive: val.isActive!
        });
        this.router.navigate(['/colonies']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.colonyForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/colonies']);
  }
}
