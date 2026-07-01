
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DocumentCategoryService } from '../../services/document-category.service';
import { DocumentCategory } from '../../models/document-category.model';

@Component({
  selector: 'app-document-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './document-category-detail.component.html',
  styleUrl: './document-category-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCategoryDetailComponent implements OnInit {
  private readonly categoryService = inject(DocumentCategoryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  category: DocumentCategory | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.category = this.categoryService.getCategoryById(id);
      }
  }
}
