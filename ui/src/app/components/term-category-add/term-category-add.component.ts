
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TermCategoryService } from '../../services/term-category.service';

@Component({
  selector: 'app-term-category-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './term-category-add.component.html',
  styleUrl: './term-category-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermCategoryAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly termService = inject(TermCategoryService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  categoryForm = this.fb.group({
    categoryName: ['', [Validators.required, Validators.maxLength(50)]],
    description: [''],
    isActive: [true]
  });

  async onSubmit(): Promise<void> {
    if (this.categoryForm.valid) {
      this.isSubmitting.set(true);
      const val = this.categoryForm.getRawValue();
      try {
        await this.termService.addCategory({
            categoryName: val.categoryName!,
            description: val.description || '',
            isActive: val.isActive!,
            // Defaults for new simple add
            enableAutoRenewal: false,
            requireLegalApproval: true,
            department: 'General',
            globalEnforcement: 'Regional Only'
        });
        this.router.navigate(['/term-categories']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/term-categories']);
  }
}
