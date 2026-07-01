
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { City } from '../../models/city.model';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './city-detail.component.html',
  styleUrl: './city-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityDetailComponent implements OnInit {
  private readonly cityService = inject(CityService);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  city: City | undefined;
  stateName: string = '';
  countryName: string = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.city = this.cityService.getCityById(idParam);
      if (this.city) {
        const state = this.stateService.states().find(s => s.id === this.city?.stateId);
        this.stateName = state ? state.stateName : 'Unknown State';
        
        const country = this.countryService.countries().find(c => c.id === this.city?.countryId);
        this.countryName = country ? country.fullName : 'Unknown Country';
      }
    }
  }
}
