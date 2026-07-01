
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { QualityService } from '../../services/quality.service';
import { Quality } from '../../models/quality.model';

@Component({
  selector: 'app-quality-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './quality-detail.component.html',
  styleUrl: './quality-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QualityDetailComponent implements OnInit {
  private readonly qualityService = inject(QualityService);
  private readonly route = inject(ActivatedRoute);

  quality: Quality | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.quality = this.qualityService.getQualityById(id);
      }
  }
}
