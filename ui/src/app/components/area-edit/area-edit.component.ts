
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AreaService } from '../../services/area.service';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { Area } from '../../models/area.model';

@Component({
  selector: 'app-area-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './area-edit.component.html',
  styleUrl: './area-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly areaService = inject(AreaService);
  private readonly districtService = inject(DistrictService);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  areaId: string | undefined;
  area: Area | undefined;

  // Data Sources
  readonly countries = this.countryService.countries;
  readonly allStates = this.stateService.states;
  readonly allCities = this.cityService.cities;
  readonly allDistricts = this.districtService.districts;

  selectedCountryId = signal<string>('');
  selectedStateId = signal<string>('');
  selectedCityId = signal<string>('');

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
    isActive: [false]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.areaId = idParam;
      this.area = this.areaService.getAreaById(this.areaId);
      if (this.area) {
        // Initialize cascading signals based on current data
        this.selectedCountryId.set(this.area.countryId);
        this.selectedStateId.set(this.area.stateId);
        this.selectedCityId.set(this.area.cityId);

        this.areaForm.patchValue({
          name: this.area.name,
          shortName: this.area.shortName,
          pinCode: this.area.pinCode,
          countryId: this.area.countryId,
          stateId: this.area.stateId,
          cityId: this.area.cityId,
          districtId: this.area.districtId,
          isActive: this.area.isActive
        });
      } else {
        this.router.navigate(['/areas']);
      }
    }
  }

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryId.set(select.value);
    this.selectedStateId.set('');
    this.selectedCityId.set('');
    this.areaForm.get('stateId')?.setValue('');
    this.areaForm.get('cityId')?.setValue('');
    this.areaForm.get('districtId')?.setValue('');
  }

  onStateChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStateId.set(select.value);
    this.selectedCityId.set('');
    this.areaForm.get('cityId')?.setValue('');
    this.areaForm.get('districtId')?.setValue('');
  }

  onCityChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCityId.set(select.value);
    this.areaForm.get('districtId')?.setValue('');
  }

  async onSubmit(): Promise<void> {
    if (this.areaForm.valid && this.area) {
      this.isSubmitting.set(true);
      const val = this.areaForm.getRawValue();
      const updatedArea: Area = {
        ...this.area,
        name: val.name!,
        shortName: val.shortName!,
        pinCode: val.pinCode!,
        countryId: val.countryId!,
        stateId: val.stateId!,
        cityId: val.cityId!,
        districtId: val.districtId!,
        isActive: val.isActive!
      };

      try {
        await this.areaService.updateArea(updatedArea);
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
