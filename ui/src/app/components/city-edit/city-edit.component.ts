
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { City } from '../../models/city.model';

@Component({
  selector: 'app-city-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './city-edit.component.html',
  styleUrl: './city-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  cityId: string | undefined;
  city: City | undefined;
  
  readonly countries = this.countryService.countries;
  readonly allStates = this.stateService.states;
  
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
    isActive: [false]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cityId = idParam;
      this.city = this.cityService.getCityById(this.cityId);
      if (this.city) {
        this.selectedCountryId.set(this.city.countryId); // Set initial country for filtering
        this.cityForm.patchValue({
          cityName: this.city.cityName,
          cityCode: this.city.cityCode,
          shortName: this.city.shortName,
          countryId: this.city.countryId,
          stateId: this.city.stateId,
          isActive: this.city.isActive
        });
      } else {
        this.router.navigate(['/cities']);
      }
    }
  }

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryId.set(select.value);
    this.cityForm.get('stateId')?.setValue('');
  }

  async onSubmit(): Promise<void> {
    if (this.cityForm.valid && this.city) {
      this.isSubmitting.set(true);
      const val = this.cityForm.getRawValue();
      const updatedCity: City = {
        ...this.city,
        cityName: val.cityName!,
        cityCode: val.cityCode!,
        shortName: val.shortName!,
        stateId: val.stateId!,
        countryId: val.countryId!,
        isActive: val.isActive!
      };

      try {
        await this.cityService.updateCity(updatedCity);
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
