
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StbSchemeService } from '../../services/stb-scheme.service';
import { SchemeStatus } from '../../models/stb-scheme.model';

@Component({
  selector: 'app-stb-scheme-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stb-scheme-list.component.html',
  styleUrl: './stb-scheme-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StbSchemeListComponent {
  private readonly schemeService = inject(StbSchemeService);
  readonly schemes = this.schemeService.schemes;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredSchemes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.schemes().filter(s => 
      s.schemeName.toLowerCase().includes(term) || 
      s.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedSchemes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredSchemes().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredSchemes().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredSchemes().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredSchemes().length));

  // Stats
  readonly activeCount = computed(() => this.schemes().filter(s => s.status === 'Active').length);

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

  getStatusClass(status: SchemeStatus): string {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Inactive': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      case 'Draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Deprecated': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-slate-100 text-slate-800';
    }
  }
  
  getStatusDot(status: SchemeStatus): string {
      switch(status) {
          case 'Active': return 'bg-emerald-500';
          case 'Draft': return 'bg-blue-500';
          default: return 'bg-slate-500';
      }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this scheme?')) {
        this.schemeService.deleteScheme(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.schemeService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
