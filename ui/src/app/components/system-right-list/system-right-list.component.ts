
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SystemRightService } from '../../services/system-right.service';

@Component({
  selector: 'app-system-right-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './system-right-list.component.html',
  styleUrl: './system-right-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemRightListComponent {
  private readonly rightService = inject(SystemRightService);
  readonly rights = this.rightService.rights;

  searchTerm = signal('');
  moduleFilter = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  // Derive unique modules for filter dropdown
  readonly modules = computed(() => {
      const mods = new Set(this.rights().map(r => r.module));
      return Array.from(mods).sort();
  });

  readonly filteredRights = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const mod = this.moduleFilter();
    return this.rights().filter(r => {
        const matchesTerm = r.name.toLowerCase().includes(term) || r.code.toLowerCase().includes(term);
        const matchesMod = mod ? r.module === mod : true;
        return matchesTerm && matchesMod;
    });
  });

  readonly paginatedRights = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredRights().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredRights().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredRights().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredRights().length));

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
    if(confirm('Are you sure? This may affect roles that use this right.')) {
        this.rightService.deleteRight(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.rightService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
