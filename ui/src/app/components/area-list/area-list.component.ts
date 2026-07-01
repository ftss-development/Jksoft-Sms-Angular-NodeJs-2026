
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AreaService } from '../../services/area.service';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-area-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './area-list.component.html',
  styleUrl: './area-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaListComponent {
  readonly areaService = inject(AreaService);
  readonly districtService = inject(DistrictService);
  readonly cityService = inject(CityService);
  readonly stateService = inject(StateService);

  readonly areas = this.areaService.areas;
  readonly districts = this.districtService.districts;
  readonly cities = this.cityService.cities;
  readonly states = this.stateService.states;

  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedAreas = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.areas().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.areas().length / this.pageSize));
  readonly startItemIndex = computed(() => this.areas().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.areas().length));

  // Stats Logic for Bottom Cards
  readonly totalAreas = computed(() => this.areas().length);
  readonly activeDistrictsCount = computed(() => {
    const uniqueDistricts = new Set(this.areas().map(a => a.districtId));
    return uniqueDistricts.size;
  });
  readonly statesCoveredCount = computed(() => {
    const uniqueStates = new Set(this.areas().map(a => a.stateId));
    return uniqueStates.size;
  });

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

  // Helpers for displaying parent names
  getDistrictName(id: string): string {
    return this.districts().find(d => d.id === id)?.name || 'Unknown District';
  }

  getCityName(id: string): string {
    return this.cities().find(c => c.id === id)?.cityName || 'Unknown City';
  }

  getStateCode(id: string): string {
    return this.states().find(s => s.id === id)?.stateCode || 'N/A';
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this area?')) {
        this.areaService.deleteArea(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.areaService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
