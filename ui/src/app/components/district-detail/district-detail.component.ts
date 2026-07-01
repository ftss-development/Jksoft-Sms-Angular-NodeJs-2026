
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { District } from '../../models/district.model';

@Component({
  selector: 'app-district-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './district-detail.component.html',
  styleUrl: './district-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictDetailComponent implements OnInit {
  private readonly districtService = inject(DistrictService);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  district: District | undefined;
  cityName: string = '';
  stateName: string = '';
  countryName: string = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.district = this.districtService.getDistrictById(idParam);
      if (this.district) {
        const city = this.cityService.cities().find(c => c.id === this.district?.cityId);
        this.cityName = city ? city.cityName : 'Unknown';

        const state = this.stateService.states().find(s => s.id === this.district?.stateId);
        this.stateName = state ? state.stateName : 'Unknown';

        const country = this.countryService.countries().find(c => c.id === this.district?.countryId);
        this.countryName = country ? country.fullName : 'Unknown';
      }
    }
  }
}
