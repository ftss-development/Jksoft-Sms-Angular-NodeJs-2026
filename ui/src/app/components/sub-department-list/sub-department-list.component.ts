
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubDepartmentService } from '../../services/sub-department.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-sub-department-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sub-department-list.component.html',
  styleUrl: './sub-department-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubDepartmentListComponent {
  private readonly subDeptService = inject(SubDepartmentService);
  private readonly deptService = inject(DepartmentService);

  readonly subDepartments = this.subDeptService.subDepartments;
  readonly departments = this.deptService.departments;
  
  searchTerm = signal('');
  isGenerating = signal(false);
  
  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly filteredSubs = computed(() => {
      const term = this.searchTerm().toLowerCase();
      return this.subDepartments().filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.shortName.toLowerCase().includes(term) ||
        this.getDepartmentName(s.parentDepartmentId).toLowerCase().includes(term)
      );
  });

  readonly paginatedSubs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredSubs().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredSubs().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredSubs().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredSubs().length));

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

  getDepartmentName(parentId: string): string {
      const dept = this.departments().find(d => d.id === parentId);
      return dept ? dept.departmentName : 'Unknown Department';
  }

  onDelete(id: string): void {
      if(confirm('Are you sure you want to delete this sub-department?')) {
          this.subDeptService.deleteSubDepartment(id);
      }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.subDeptService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
