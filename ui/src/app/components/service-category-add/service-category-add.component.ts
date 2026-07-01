
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServiceCategoryService } from '../../services/service-category.service';

@Component({
  selector: 'app-service-category-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './service-category-add.component.html',
  styleUrl: './service-category-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCategoryAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly categoryService = inject(ServiceCategoryService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  categoryForm = this.fb.group({
    categoryName: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(30)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.categoryForm.valid) {
      this.isSubmitting.set(true);
      const val = this.categoryForm.getRawValue();
      try {
        await this.categoryService.addCategory({
            categoryName: val.categoryName!,
            shortName: val.shortName!,
            description: '', // Default empty for this quick form
            isActive: val.isActive!
        });
        this.router.navigate(['/service-categories']);
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
    this.router.navigate(['/service-categories']);
  }
}
