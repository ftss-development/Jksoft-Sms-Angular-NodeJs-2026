
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './language-add.component.html',
  styleUrl: './language-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly router: Router = inject(Router);

  isSubmitting = signal(false);

  languageForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(10)]],
    description: [''],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.languageForm.valid) {
      this.isSubmitting.set(true);
      const val = this.languageForm.getRawValue();
      try {
        await this.languageService.addLanguage({
            name: val.name!,
            shortName: val.shortName!,
            description: val.description || '',
            status: val.isActive ? 'Active' : 'Inactive'
        });
        this.router.navigate(['/languages']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.languageForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/languages']);
  }
}
