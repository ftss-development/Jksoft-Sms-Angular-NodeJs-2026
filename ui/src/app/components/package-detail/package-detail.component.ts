
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { Package } from '../../models/package.model';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe, DecimalPipe],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageDetailComponent implements OnInit {
  private readonly packageService = inject(PackageService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  package: Package | undefined;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.package = this.packageService.getPackageById(+idParam);
    }
  }
}
