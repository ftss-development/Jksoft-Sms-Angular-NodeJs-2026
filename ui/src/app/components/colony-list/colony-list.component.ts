
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ColonyService } from '../../services/colony.service';
import { AreaService } from '../../services/area.service';
import { DistrictService } from '../../services/district.service';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-colony-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './colony-list.component.html',
  styleUrl: './colony-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColonyListComponent {
  readonly colonyService = inject(ColonyService);
  readonly areaService = inject(AreaService);
  readonly districtService = inject(DistrictService);
  readonly cityService = inject(CityService);

  readonly colonies = this.colonyService.colonies;
  readonly areas = this.areaService.areas;
  readonly districts = this.districtService.districts;
  readonly cities = this.cityService.cities;

  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedColonies = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.colonies().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.colonies().length / this.pageSize));
  readonly startItemIndex = computed(() => this.colonies().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.colonies().length));

  // Stats for bottom panel
  readonly districtsCoveredCount = computed(() => {
    const uniqueDistricts = new Set(this.colonies().map(c => c.districtId));
    return uniqueDistricts.size;
  });
  
  // Mock high growth calculation
  readonly highGrowthCount = computed(() => Math.floor(this.colonies().length / 3));

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
  getAreaName(id: string): string {
    return this.areas().find(a => a.id === id)?.name || 'Unknown Area';
  }

  getDistrictName(id: string): string {
    return this.districts().find(d => d.id === id)?.name || 'Unknown District';
  }

  getCityName(id: string): string {
    return this.cities().find(c => c.id === id)?.cityName || 'Unknown City';
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this colony?')) {
        this.colonyService.deleteColony(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.colonyService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
