
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnquiryService } from '../../services/enquiry.service';
import { EnquiryStatus } from '../../models/enquiry.model';

@Component({
  selector: 'app-enquiry-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './enquiry-list.component.html',
  styleUrl: './enquiry-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryListComponent {
  readonly enquiryService = inject(EnquiryService);
  readonly enquiries = this.enquiryService.enquiries;

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedEnquiries = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.enquiries().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.enquiries().length / this.pageSize));
  readonly startItemIndex = computed(() => this.enquiries().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.enquiries().length));

  get pages() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getStatusColor(status: EnquiryStatus): string {
    switch (status) {
      case 'New':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  onDelete(id: number): void {
    this.enquiryService.deleteEnquiry(id);
  }
}
