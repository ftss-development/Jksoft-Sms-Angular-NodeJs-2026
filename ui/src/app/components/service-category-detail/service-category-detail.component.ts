
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ServiceCategoryService } from '../../services/service-category.service';
import { ServiceCategory } from '../../models/service-category.model';

@Component({
  selector: 'app-service-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './service-category-detail.component.html',
  styleUrl: './service-category-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCategoryDetailComponent implements OnInit {
  private readonly categoryService = inject(ServiceCategoryService);
  private readonly route = inject(ActivatedRoute);

  category: ServiceCategory | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.category = this.categoryService.getCategoryById(id);
      }
  }
}
