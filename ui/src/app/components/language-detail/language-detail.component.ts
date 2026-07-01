
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/language.model';

@Component({
  selector: 'app-language-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './language-detail.component.html',
  styleUrl: './language-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageDetailComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  language: Language | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.language = this.languageService.getLanguageById(id);
      }
  }
}
