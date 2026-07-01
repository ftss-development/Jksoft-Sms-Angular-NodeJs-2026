
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParticularTypeService } from '../../services/particular-type.service';
import { ParticularTypeStatus } from '../../models/particular-type.model';

@Component({
  selector: 'app-particular-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './particular-type-list.component.html',
  styleUrl: './particular-type-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularTypeListComponent {
  private readonly ptService = inject(ParticularTypeService);
  readonly particularTypes = this.ptService.particularTypes;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredTypes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.particularTypes().filter(pt => 
      pt.typeName.toLowerCase().includes(term) || 
      pt.typeCode.toLowerCase().includes(term) ||
      pt.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedTypes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredTypes().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredTypes().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredTypes().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredTypes().length));

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

  getStatusClass(status: ParticularTypeStatus): string {
    switch (status) {
      case 'Active': 
      case 'Production Active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Inactive': 
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusDot(status: ParticularTypeStatus): string {
      return (status === 'Active' || status === 'Production Active') ? 'bg-emerald-500' : 'bg-slate-500';
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this particular type?')) {
        this.ptService.deleteParticularType(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.ptService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
