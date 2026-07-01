
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ColonyService } from '../../services/colony.service';
import { AreaService } from '../../services/area.service';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { Colony } from '../../models/colony.model';

@Component({
  selector: 'app-colony-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './colony-edit.component.html',
  styleUrl: './colony-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColonyEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly colonyService = inject(ColonyService);
  private readonly areaService = inject(AreaService);
  private readonly districtService = inject(DistrictService);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  colonyId: string | undefined;
  colony: Colony | undefined;

  // Data Sources
  readonly countries = this.countryService.countries;
  readonly allStates = this.stateService.states;
  readonly allCities = this.cityService.cities;
  readonly allDistricts = this.districtService.districts;
  readonly allAreas = this.areaService.areas;

  selectedCountryId = signal<string>('');
  selectedStateId = signal<string>('');
  selectedCityId = signal<string>('');
  selectedDistrictId = signal<string>('');

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
    isActive: [false]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.colonyId = idParam;
      this.colony = this.colonyService.getColonyById(this.colonyId);
      if (this.colony) {
        this.selectedCountryId.set(this.colony.countryId);
        this.selectedStateId.set(this.colony.stateId);
        this.selectedCityId.set(this.colony.cityId);
        this.selectedDistrictId.set(this.colony.districtId);

        this.colonyForm.patchValue({
          name: this.colony.name,
          shortName: this.colony.shortName,
          countryId: this.colony.countryId,
          stateId: this.colony.stateId,
          cityId: this.colony.cityId,
          districtId: this.colony.districtId,
          areaId: this.colony.areaId,
          isActive: this.colony.isActive
        });
      } else {
        this.router.navigate(['/colonies']);
      }
    }
  }

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryId.set(select.value);
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
    this.selectedCityId.set('');
    this.selectedDistrictId.set('');
    this.colonyForm.get('cityId')?.setValue('');
    this.colonyForm.get('districtId')?.setValue('');
    this.colonyForm.get('areaId')?.setValue('');
  }

  onCityChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCityId.set(select.value);
    this.selectedDistrictId.set('');
    this.colonyForm.get('districtId')?.setValue('');
    this.colonyForm.get('areaId')?.setValue('');
  }

  onDistrictChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedDistrictId.set(select.value);
    this.colonyForm.get('areaId')?.setValue('');
  }

  async onSubmit(): Promise<void> {
    if (this.colonyForm.valid && this.colony) {
      this.isSubmitting.set(true);
      const val = this.colonyForm.getRawValue();
      const updatedColony: Colony = {
        ...this.colony,
        name: val.name!,
        shortName: val.shortName!,
        countryId: val.countryId!,
        stateId: val.stateId!,
        cityId: val.cityId!,
        districtId: val.districtId!,
        areaId: val.areaId!,
        isActive: val.isActive!
      };

      try {
        await this.colonyService.updateColony(updatedColony);
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
