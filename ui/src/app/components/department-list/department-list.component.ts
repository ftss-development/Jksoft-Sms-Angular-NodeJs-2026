
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../services/department.service';
import { DepartmentStatus } from '../../models/department.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentListComponent {
  private readonly departmentService = inject(DepartmentService);
  readonly departments = this.departmentService.departments;

  isGenerating = signal(false);
  searchTerm = signal('');
  
  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredDepartments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.departments().filter(d => 
        d.departmentName.toLowerCase().includes(term) || 
        d.id.toLowerCase().includes(term) ||
        d.shortName.toLowerCase().includes(term)
    );
  });

  readonly paginatedDepartments = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredDepartments().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredDepartments().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredDepartments().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredDepartments().length));

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
    if(confirm('Are you sure you want to delete this department?')) {
        this.departmentService.deleteDepartment(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.departmentService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
