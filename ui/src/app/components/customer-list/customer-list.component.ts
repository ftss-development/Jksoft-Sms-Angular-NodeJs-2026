
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListComponent {
  readonly customerService = inject(CustomerService);
  readonly customers = this.customerService.customers;

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.customers().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.customers().length / this.pageSize));
  
  readonly startItemIndex = computed(() => this.customers().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.customers().length));

  get pages() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Mock data for dropdowns (status and company) for display purposes
  readonly statuses = this.customerService.mockStatuses;
  readonly companies = this.customerService.mockCompanies;

  getStatusType(statusId: number): string {
    return this.statuses.find(s => s.statusId === statusId)?.type || 'Unknown';
  }

  getCompanyName(companyId: number): string {
    return this.companies.find(c => c.id === companyId)?.companyName || 'Unknown';
  }

  onDelete(id: string): void {
    this.customerService.deleteCustomer(id);
  }
}
