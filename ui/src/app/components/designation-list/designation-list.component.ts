
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DesignationService } from '../../services/designation.service';

@Component({
  selector: 'app-designation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './designation-list.component.html',
  styleUrl: './designation-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignationListComponent {
  private readonly designationService = inject(DesignationService);
  readonly designations = this.designationService.designations;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredDesignations = computed(() => {
      const term = this.searchTerm().toLowerCase();
      return this.designations().filter(d => 
        d.name.toLowerCase().includes(term) || 
        d.shortCode.toLowerCase().includes(term) ||
        d.level.toLowerCase().includes(term)
      );
  });

  readonly paginatedDesignations = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredDesignations().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredDesignations().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredDesignations().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredDesignations().length));

  // Summary Stats
  readonly totalRoles = computed(() => this.designations().length);
  readonly activeRoles = computed(() => this.designations().filter(d => d.status === 'Active').length);
  readonly orgLevels = computed(() => {
      const levels = new Set(this.designations().map(d => d.level));
      return levels.size;
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

  onDelete(id: string): void {
      if(confirm('Are you sure you want to delete this designation?')) {
          this.designationService.deleteDesignation(id);
      }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.designationService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
