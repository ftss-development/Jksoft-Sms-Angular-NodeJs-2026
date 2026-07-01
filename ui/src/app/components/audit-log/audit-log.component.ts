
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuditService } from '../../services/audit.service';
import { AuditSeverity } from '../../models/audit.model';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogComponent {
  private readonly auditService = inject(AuditService);
  readonly logs = this.auditService.logs;

  searchTerm = signal('');
  categoryFilter = signal('');
  
  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 15;

  readonly filteredLogs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const cat = this.categoryFilter();

    return this.logs().filter(l => {
      const matchesTerm = l.action.toLowerCase().includes(term) || 
                          l.actorName.toLowerCase().includes(term) || 
                          l.description.toLowerCase().includes(term);
      const matchesCat = cat ? l.category === cat : true;
      return matchesTerm && matchesCat;
    });
  });

  readonly paginatedLogs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredLogs().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredLogs().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredLogs().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredLogs().length));

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

  getSeverityClass(severity: AuditSeverity): string {
    switch (severity) {
      case 'Critical': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-900';
      case 'Medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
    }
  }
}
