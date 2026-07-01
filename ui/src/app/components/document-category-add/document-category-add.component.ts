
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DocumentCategoryService } from '../../services/document-category.service';
import { CategoryStatus, SecurityLevel } from '../../models/document-category.model';

@Component({
  selector: 'app-document-category-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './document-category-add.component.html',
  styleUrl: './document-category-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCategoryAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly categoryService = inject(DocumentCategoryService);
  private readonly router: Router = inject(Router);

  isSubmitting = signal(false);

  categoryForm = this.fb.group({
    categoryName: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(200)]],
    securityLevel: ['Restricted' as SecurityLevel, Validators.required],
    isActive: [true]
  });

  async onSubmit(): Promise<void> {
    if (this.categoryForm.valid) {
      this.isSubmitting.set(true);
      const val = this.categoryForm.getRawValue();
      try {
        await this.categoryService.addCategory({
            categoryName: val.categoryName!,
            shortName: val.shortName!,
            description: val.description || '',
            status: val.isActive ? 'Active' : 'Inactive',
            securityLevel: val.securityLevel as SecurityLevel
        });
        this.router.navigate(['/categories']);
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
    this.router.navigate(['/categories']);
  }
}
