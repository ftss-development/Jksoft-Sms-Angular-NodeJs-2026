
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityListComponent {
  readonly cityService = inject(CityService);
  readonly stateService = inject(StateService);
  readonly countryService = inject(CountryService);
  
  readonly cities = this.cityService.cities;
  readonly states = this.stateService.states;
  readonly countries = this.countryService.countries;

  isGenerating = signal(false);

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedCities = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.cities().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.cities().length / this.pageSize));
  readonly startItemIndex = computed(() => this.cities().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.cities().length));

  get pages() {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array(total).fill(0).map((x, i) => i + 1);
    
    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);
    if (end === total) start = Math.max(end - 4, 1);
    
    const p = [];
    for(let i = start; i <= end; i++) p.push(i);
    return p;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getStateName(stateId: string): string {
    const state = this.states().find(s => s.id === stateId);
    return state ? state.stateName : 'Unknown State';
  }

  getCountryName(countryId: string): string {
    const country = this.countries().find(c => c.id === countryId);
    return country ? country.fullName : 'Unknown Country';
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this city?')) {
        this.cityService.deleteCity(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.cityService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
