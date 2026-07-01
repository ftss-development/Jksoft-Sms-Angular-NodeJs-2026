
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParticularGroupService } from '../../services/particular-group.service';

@Component({
  selector: 'app-particular-group-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './particular-group-list.component.html',
  styleUrl: './particular-group-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularGroupListComponent {
  private readonly groupService = inject(ParticularGroupService);
  readonly groups = this.groupService.particularGroups;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredGroups = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.groups().filter(g => 
        g.groupName.toLowerCase().includes(term) || 
        g.shortName.toLowerCase().includes(term) ||
        g.id.toString().includes(term)
    );
  });

  readonly paginatedGroups = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredGroups().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredGroups().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredGroups().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredGroups().length));

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

  onDelete(id: number): void {
    if(confirm('Are you sure you want to delete this particular group?')) {
        this.groupService.deleteGroup(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.groupService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
