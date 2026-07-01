
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentHeadService } from '../../services/document-head.service';
import { DocumentCategoryService } from '../../services/document-category.service';

@Component({
  selector: 'app-document-head-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './document-head-list.component.html',
  styleUrl: './document-head-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeadListComponent {
  private readonly headService = inject(DocumentHeadService);
  private readonly categoryService = inject(DocumentCategoryService); // To resolve category names if needed dynamic
  
  readonly heads = this.headService.heads;

  searchTerm = signal('');
  isGenerating = signal(false);
  
  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredHeads = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.heads().filter(h => 
      h.headName.toLowerCase().includes(term) || 
      h.shortName.toLowerCase().includes(term) ||
      h.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedHeads = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredHeads().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredHeads().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredHeads().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredHeads().length));

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
    if(confirm('Are you sure you want to delete this document head?')) {
        this.headService.deleteHead(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.headService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
