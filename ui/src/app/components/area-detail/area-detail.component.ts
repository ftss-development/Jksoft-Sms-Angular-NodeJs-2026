
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AreaService } from '../../services/area.service';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { Area } from '../../models/area.model';

@Component({
  selector: 'app-area-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './area-detail.component.html',
  styleUrl: './area-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaDetailComponent implements OnInit {
  private readonly areaService = inject(AreaService);
  private readonly districtService = inject(DistrictService);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  area: Area | undefined;
  districtName: string = '';
  cityName: string = '';
  stateName: string = '';
  countryName: string = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.area = this.areaService.getAreaById(idParam);
      if (this.area) {
        const district = this.districtService.districts().find(d => d.id === this.area?.districtId);
        this.districtName = district ? district.name : 'Unknown';

        const city = this.cityService.cities().find(c => c.id === this.area?.cityId);
        this.cityName = city ? city.cityName : 'Unknown';

        const state = this.stateService.states().find(s => s.id === this.area?.stateId);
        this.stateName = state ? state.stateName : 'Unknown';

        const country = this.countryService.countries().find(c => c.id === this.area?.countryId);
        this.countryName = country ? country.fullName : 'Unknown';
      }
    }
  }
}
