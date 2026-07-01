
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemMakerService } from '../../services/item-maker.service';

@Component({
  selector: 'app-item-maker-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './item-maker-list.component.html',
  styleUrl: './item-maker-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemMakerListComponent {
  private readonly makerService = inject(ItemMakerService);
  readonly makers = this.makerService.makers;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredMakers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.makers().filter(m => 
      m.makerName.toLowerCase().includes(term) || 
      m.shortName.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedMakers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredMakers().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredMakers().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredMakers().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredMakers().length));

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
    if(confirm('Are you sure you want to delete this maker?')) {
        this.makerService.deleteMaker(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.makerService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
