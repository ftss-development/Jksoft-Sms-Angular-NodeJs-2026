
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TaxService } from '../../services/tax.service';
import { Tax } from '../../models/tax.model';

@Component({
  selector: 'app-tax-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './tax-detail.component.html',
  styleUrl: './tax-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxDetailComponent implements OnInit {
  private readonly taxService = inject(TaxService);
  private readonly route = inject(ActivatedRoute);

  tax: Tax | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.tax = this.taxService.getTaxById(id);
      }
  }
}
