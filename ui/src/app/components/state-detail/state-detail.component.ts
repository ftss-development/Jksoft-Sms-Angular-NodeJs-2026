
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { State } from '../../models/state.model';

@Component({
  selector: 'app-state-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './state-detail.component.html',
  styleUrl: './state-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateDetailComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  state: State | undefined;
  countryName: string = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.state = this.stateService.getStateById(idParam);
      if (this.state) {
        const country = this.countryService.countries().find(c => c.id === this.state?.countryId);
        this.countryName = country ? country.fullName : 'Unknown Country';
      }
    }
  }
}
