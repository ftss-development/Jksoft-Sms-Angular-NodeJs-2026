
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { District, DistrictStatus } from '../../models/district.model';

@Component({
  selector: 'app-district-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './district-edit.component.html',
  styleUrl: './district-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly districtService = inject(DistrictService);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  districtId: string | undefined;
  district: District | undefined;

  readonly countries = this.countryService.countries;
  readonly allStates = this.stateService.states;
  readonly allCities = this.cityService.cities;

  selectedCountryId = signal<string>('');
  selectedStateId = signal<string>('');

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

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.districtId = idParam;
      this.district = this.districtService.getDistrictById(this.districtId);
      if (this.district) {
        // Initialize cascading signals
        this.selectedCountryId.set(this.district.countryId);
        this.selectedStateId.set(this.district.stateId);

        this.districtForm.patchValue({
          name: this.district.name,
          districtCode: this.district.districtCode,
          shortName: this.district.shortName,
          countryId: this.district.countryId,
          stateId: this.district.stateId,
          cityId: this.district.cityId,
          status: this.district.status
        });
      } else {
        this.router.navigate(['/districts']);
      }
    }
  }

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryId.set(select.value);
    this.selectedStateId.set('');
    this.districtForm.get('stateId')?.setValue('');
    this.districtForm.get('cityId')?.setValue('');
  }

  onStateChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStateId.set(select.value);
    this.districtForm.get('cityId')?.setValue('');
  }

  async onSubmit(): Promise<void> {
    if (this.districtForm.valid && this.district) {
      this.isSubmitting.set(true);
      const val = this.districtForm.getRawValue();
      const updatedDistrict: District = {
        ...this.district,
        name: val.name!,
        districtCode: val.districtCode!,
        shortName: val.shortName!,
        countryId: val.countryId!,
        stateId: val.stateId!,
        cityId: val.cityId!,
        status: val.status as DistrictStatus
      };

      try {
        await this.districtService.updateDistrict(updatedDistrict);
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
