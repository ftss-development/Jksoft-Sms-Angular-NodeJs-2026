import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DocumentHeadService } from '../../services/document-head.service';
import { DocumentHead } from '../../models/document-head.model';

@Component({
  selector: 'app-document-head-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './document-head-detail.component.html',
  styleUrl: './document-head-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeadDetailComponent implements OnInit {
  private readonly headService = inject(DocumentHeadService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  head: DocumentHead | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.head = this.headService.getHeadById(id);
      }
  }
}