
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TermCategoryService } from '../../services/term-category.service';

@Component({
  selector: 'app-term-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './term-category-list.component.html',
  styleUrl: './term-category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermCategoryListComponent {
  private readonly termService = inject(TermCategoryService);
  readonly categories = this.termService.categories;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.categories().filter(c => 
      c.categoryName.toLowerCase().includes(term) || 
      c.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedCategories = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredCategories().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredCategories().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredCategories().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredCategories().length));

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
    if(confirm('Are you sure you want to delete this category?')) {
        this.termService.deleteCategory(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.termService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
