
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { Country, CountryStatusType } from '../../models/country.model';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailComponent implements OnInit {
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  country: Country | undefined;
  readonly countryStatusType = CountryStatusType;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.country = this.countryService.getCountryById(idParam);
    }
  }

  getStatusType(statusId: number): CountryStatusType | undefined {
    return this.countryService.getStatusType(statusId);
  }
}
