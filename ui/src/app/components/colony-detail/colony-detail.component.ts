
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ColonyService } from '../../services/colony.service';
import { AreaService } from '../../services/area.service';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { Colony } from '../../models/colony.model';

@Component({
  selector: 'app-colony-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './colony-detail.component.html',
  styleUrl: './colony-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColonyDetailComponent implements OnInit {
  private readonly colonyService = inject(ColonyService);
  private readonly areaService = inject(AreaService);
  private readonly districtService = inject(DistrictService);
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  colony: Colony | undefined;
  areaName: string = '';
  districtName: string = '';
  cityName: string = '';
  stateName: string = '';
  countryName: string = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.colony = this.colonyService.getColonyById(idParam);
      if (this.colony) {
        const area = this.areaService.areas().find(a => a.id === this.colony?.areaId);
        this.areaName = area ? area.name : 'Unknown';

        const district = this.districtService.districts().find(d => d.id === this.colony?.districtId);
        this.districtName = district ? district.name : 'Unknown';

        const city = this.cityService.cities().find(c => c.id === this.colony?.cityId);
        this.cityName = city ? city.cityName : 'Unknown';

        const state = this.stateService.states().find(s => s.id === this.colony?.stateId);
        this.stateName = state ? state.stateName : 'Unknown';

        const country = this.countryService.countries().find(c => c.id === this.colony?.countryId);
        this.countryName = country ? country.fullName : 'Unknown';
      }
    }
  }
}
