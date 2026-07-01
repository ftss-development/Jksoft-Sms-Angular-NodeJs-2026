
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QualityService } from '../../services/quality.service';

@Component({
  selector: 'app-quality-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quality-list.component.html',
  styleUrl: './quality-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QualityListComponent {
  private readonly qualityService = inject(QualityService);
  readonly qualities = this.qualityService.qualities;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredQualities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.qualities().filter(q => 
      q.name.toLowerCase().includes(term) || 
      q.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedQualities = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredQualities().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredQualities().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredQualities().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredQualities().length));

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

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this classification?')) {
        this.qualityService.deleteQuality(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.qualityService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
