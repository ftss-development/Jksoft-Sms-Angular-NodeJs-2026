
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoteTypeService } from '../../services/note-type.service';

@Component({
  selector: 'app-note-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './note-type-list.component.html',
  styleUrl: './note-type-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteTypeListComponent {
  private readonly noteTypeService = inject(NoteTypeService);
  readonly noteTypes = this.noteTypeService.noteTypes;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredTypes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.noteTypes().filter(nt => 
      nt.typeName.toLowerCase().includes(term) || 
      nt.id.toLowerCase().includes(term)
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

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this note type?')) {
        this.noteTypeService.deleteNoteType(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.noteTypeService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
