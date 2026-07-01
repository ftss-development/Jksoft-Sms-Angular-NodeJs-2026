
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TicketHeadService } from '../../services/ticket-head.service';
import { TicketHeadStatus, ServiceCategory } from '../../models/ticket-head.model';

@Component({
  selector: 'app-ticket-head-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './ticket-head-list.component.html',
  styleUrl: './ticket-head-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketHeadListComponent {
  private readonly headService = inject(TicketHeadService);
  readonly ticketHeads = this.headService.ticketHeads;

  searchTerm = signal('');
  categoryFilter = signal<string>('All Categories');
  statusFilter = signal<string>('All Statuses');
  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredHeads = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.categoryFilter();
    const status = this.statusFilter();

    return this.ticketHeads().filter(t => {
      const matchesTerm = t.name.toLowerCase().includes(term) || t.shortName.toLowerCase().includes(term);
      const matchesCategory = category === 'All Categories' || t.serviceCategory === category;
      const matchesStatus = status === 'All Statuses' || t.status === status;
      return matchesTerm && matchesCategory && matchesStatus;
    });
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

  getCategoryColor(category: string): string {
      switch(category) {
          case 'Infrastructure': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
          case 'Software': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
          case 'Hardware': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
          case 'Access Control': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
          default: return 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400';
      }
  }
  
  getCategoryDot(category: string): string {
      switch(category) {
          case 'Infrastructure': return 'bg-purple-500';
          case 'Software': return 'bg-blue-500';
          case 'Hardware': return 'bg-orange-500';
          case 'Access Control': return 'bg-red-500';
          default: return 'bg-slate-500';
      }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this ticket head?')) {
        this.headService.deleteTicketHead(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.headService.addDummyData();
    } catch (err) {
        console.error(err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
