
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Language, LanguageStatus } from '../../models/language.model';

@Component({
  selector: 'app-language-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './language-edit.component.html',
  styleUrl: './language-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  languageId: string | undefined;
  language: Language | undefined;
  isSubmitting = signal(false);

  languageForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(10)]],
    isActive: [true]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.languageId = id;
          this.language = this.languageService.getLanguageById(id);
          if (this.language) {
              this.languageForm.patchValue({
                  name: this.language.name,
                  shortName: this.language.shortName,
                  isActive: this.language.status === 'Active'
              });
          } else {
              this.router.navigate(['/languages']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.languageForm.valid && this.language) {
      this.isSubmitting.set(true);
      const val = this.languageForm.getRawValue();
      
      const updatedLanguage: Language = {
          ...this.language,
          name: val.name!,
          shortName: val.shortName!,
          status: val.isActive ? 'Active' : 'Inactive'
      };

      try {
        await this.languageService.updateLanguage(updatedLanguage);
        this.router.navigate(['/languages']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/languages']);
  }
}
