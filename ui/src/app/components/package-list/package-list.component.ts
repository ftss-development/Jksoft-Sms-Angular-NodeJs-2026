
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './package-list.component.html',
  styleUrl: './package-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageListComponent {
  readonly packageService = inject(PackageService);
  readonly packages = this.packageService.packages;

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedPackages = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.packages().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.packages().length / this.pageSize));
  readonly startItemIndex = computed(() => this.packages().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.packages().length));

  get pages() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onDelete(id: number): void {
    this.packageService.deletePackage(id);
  }
}
