
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DocumentHeadService } from '../../services/document-head.service';
import { DocumentCategoryService } from '../../services/document-category.service';

@Component({
  selector: 'app-document-head-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './document-head-add.component.html',
  styleUrl: './document-head-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeadAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly headService = inject(DocumentHeadService);
  private readonly categoryService = inject(DocumentCategoryService);
  private readonly router: Router = inject(Router);

  readonly categories = this.categoryService.categories;
  isSubmitting = signal(false);

  headForm = this.fb.group({
    parentCategoryId: ['', Validators.required],
    headName: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(50)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.headForm.valid) {
      this.isSubmitting.set(true);
      const val = this.headForm.getRawValue();
      const parentCat = this.categories().find(c => c.id === val.parentCategoryId);
      
      try {
        await this.headService.addHead({
            headName: val.headName!,
            shortName: val.shortName!,
            parentCategoryId: val.parentCategoryId!,
            parentCategoryName: parentCat?.categoryName,
            status: val.isActive ? 'Active' : 'Inactive',
            description: '' // Optional default
        });
        this.router.navigate(['/heads']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.headForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/heads']);
  }
}
