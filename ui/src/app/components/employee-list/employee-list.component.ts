
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);
  readonly employees = this.employeeService.employees;

  isGenerating = signal(false);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedEmployees = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.employees().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.employees().length / this.pageSize));
  readonly startItemIndex = computed(() => this.employees().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.employees().length));

  get pages() {
    // Show a limited window of pages if there are too many (e.g., more than 5)
    const total = this.totalPages();
    const current = this.currentPage();
    
    if (total <= 7) {
        return Array(total).fill(0).map((x, i) => i + 1);
    }

    // Simple sliding window
    let start = Math.max(current - 2, 1);
    let end = Math.min(start + 4, total);
    
    if (end === total) {
        start = Math.max(end - 4, 1);
    }

    const p = [];
    for(let i = start; i <= end; i++) {
        p.push(i);
    }
    return p;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getReportingManagerName(managerId: string | undefined): string {
    if (!managerId) return '-';
    const manager = this.employees().find(e => e.id === managerId);
    return manager ? `${manager.firstName} ${manager.lastName}` : 'Unknown';
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this employee record?')) {
        this.employeeService.deleteEmployee(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.employeeService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
