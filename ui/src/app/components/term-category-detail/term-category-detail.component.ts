
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TermCategoryService } from '../../services/term-category.service';
import { TermCategory } from '../../models/term-category.model';

@Component({
  selector: 'app-term-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './term-category-detail.component.html',
  styleUrl: './term-category-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermCategoryDetailComponent implements OnInit {
  private readonly termService = inject(TermCategoryService);
  private readonly route = inject(ActivatedRoute);

  category: TermCategory | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.category = this.termService.getCategoryById(id);
      }
  }
}
