
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserRole, UserStatus } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  readonly users = this.userService.users;

  isGenerating = signal(false);
  searchTerm = signal('');
  roleFilter = signal<string>('');
  statusFilter = signal<string>('');

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  // Filtered Users
  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const role = this.roleFilter();
    const status = this.statusFilter();

    return this.users().filter(u => {
        const matchesTerm = !term || 
            u.username.toLowerCase().includes(term) || 
            u.firstName.toLowerCase().includes(term) || 
            u.lastName.toLowerCase().includes(term) || 
            u.email.toLowerCase().includes(term);
        const matchesRole = !role || u.role === role;
        const matchesStatus = !status || u.status === status;

        return matchesTerm && matchesRole && matchesStatus;
    });
  });

  readonly paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.pageSize));
  readonly startItemIndex = computed(() => this.filteredUsers().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.filteredUsers().length));

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

  getRoleClass(role: UserRole): string {
      switch(role) {
          case 'Administrator': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
          case 'Manager': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
          case 'User': return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
          default: return 'bg-gray-100 text-gray-600';
      }
  }

  onDelete(id: string): void {
    if(confirm('Are you sure you want to delete this user?')) {
        this.userService.deleteUser(id);
    }
  }

  async onGenerateData(): Promise<void> {
    this.isGenerating.set(true);
    try {
        await this.userService.addDummyData();
    } catch (err) {
        console.error('Error generating data:', err);
    } finally {
        this.isGenerating.set(false);
    }
  }
}
