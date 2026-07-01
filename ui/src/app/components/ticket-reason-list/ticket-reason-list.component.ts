
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TicketReasonService } from '../../services/ticket-reason.service';

@Component({
  selector: 'app-ticket-reason-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket-reason-list.component.html',
  styleUrl: './ticket-reason-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketReasonListComponent {
  private readonly reasonService = inject(TicketReasonService);
  readonly reasons = this.reasonService.reasons;

  searchTerm = signal('');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredReasons = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.reasons().filter(r => 
      r.reasonName.toLowerCase().includes(term) || 
      r.shortName.toLowerCase().includes(term) ||
      r.id.toLowerCase().includes(term)
    );
  });

  readonly paginatedReasons = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredReasons().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredReasons().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredReasons().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredReasons().length));

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
    if(confirm('Are you sure you want to delete this reason?')) {
        this.reasonService.deleteReason(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.reasonService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
