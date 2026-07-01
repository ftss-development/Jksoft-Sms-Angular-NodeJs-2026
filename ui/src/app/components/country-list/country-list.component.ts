
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // For @if, @for, etc.
import { CountryService } from '../../services/country.service';
import { CountryStatusType } from '../../models/country.model';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent {
  readonly countryService = inject(CountryService);
  readonly countries = this.countryService.countries;
  readonly countryStatusType = CountryStatusType; // Expose enum to template

  isGenerating = signal(false);

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedCountries = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.countries().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.countries().length / this.pageSize));
  readonly startItemIndex = computed(() => this.countries().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.countries().length));

  get pages() {
    // Show a limited window of pages if there are too many (e.g., more than 5)
    const total = this.totalPages();
    const current = this.currentPage();
    
    if (total <= 7) {
        return Array(total).fill(0).map((x, i) => i + 1);
    }

    // Simple sliding window
    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);
    
    if (end === total) {
        start = Math.max(end - 4, 1);
    }

    const p = [];
    for(let i = start; i <= end; i++) {
        p.push(i);
    }
    return p;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getStatusType(statusId: number): CountryStatusType | undefined {
    return this.countryService.getStatusType(statusId);
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this country?')) {
        this.countryService.deleteCountry(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.countryService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
