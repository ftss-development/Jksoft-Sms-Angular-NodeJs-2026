
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParticularService } from '../../services/particular.service';

@Component({
  selector: 'app-particular-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './particular-list.component.html',
  styleUrl: './particular-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularListComponent {
  readonly particularService = inject(ParticularService);
  readonly particulars = this.particularService.particulars;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredParticulars = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.particulars().filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.shortName.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedParticulars = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredParticulars().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredParticulars().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredParticulars().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredParticulars().length));

  get pages() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this particular?')) {
        this.particularService.deleteParticular(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.particularService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
