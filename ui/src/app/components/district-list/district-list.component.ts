
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-district-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './district-list.component.html',
  styleUrl: './district-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictListComponent {
  readonly districtService = inject(DistrictService);
  readonly cityService = inject(CityService);
  readonly stateService = inject(StateService);

  readonly districts = this.districtService.districts;
  readonly cities = this.cityService.cities;
  readonly states = this.stateService.states;

  isGenerating = signal(false);

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedDistricts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.districts().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.districts().length / this.pageSize));
  readonly startItemIndex = computed(() => this.districts().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.districts().length));

  // Stats for the bottom panel
  readonly totalDistricts = computed(() => this.districts().length);
  readonly pendingCount = computed(() => this.districts().filter(d => d.status === 'Pending').length);
  readonly archivedCount = computed(() => this.districts().filter(d => d.status === 'Archived').length);

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

  getCityName(cityId: string): string {
    const city = this.cities().find(c => c.id === cityId);
    return city ? city.cityName : 'Unknown City';
  }

  getStateName(stateId: string): string {
    const state = this.states().find(s => s.id === stateId);
    return state ? state.stateName : 'Unknown State';
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this district?')) {
        this.districtService.deleteDistrict(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.districtService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
