
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { StbSchemeService } from '../../services/stb-scheme.service';
import { StbScheme } from '../../models/stb-scheme.model';

@Component({
  selector: 'app-stb-scheme-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './stb-scheme-detail.component.html',
  styleUrl: './stb-scheme-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StbSchemeDetailComponent implements OnInit {
  private readonly schemeService = inject(StbSchemeService);
  private readonly route = inject(ActivatedRoute);

  scheme: StbScheme | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.scheme = this.schemeService.getSchemeById(id);
      }
  }
}
