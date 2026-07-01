
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocumentCategoryService } from '../../services/document-category.service';
import { DocumentCategory, CategoryStatus, SecurityLevel } from '../../models/document-category.model';

@Component({
  selector: 'app-document-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './document-category-edit.component.html',
  styleUrl: './document-category-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCategoryEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly categoryService = inject(DocumentCategoryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  categoryId: string | undefined;
  category: DocumentCategory | undefined;
  isSubmitting = signal(false);

  categoryForm = this.fb.group({
    categoryName: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(500)]],
    securityLevel: ['Restricted' as SecurityLevel],
    isActive: [true]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.categoryId = id;
          this.category = this.categoryService.getCategoryById(id);
          if (this.category) {
              this.categoryForm.patchValue({
                  categoryName: this.category.categoryName,
                  shortName: this.category.shortName,
                  description: this.category.description,
                  securityLevel: this.category.securityLevel,
                  isActive: this.category.status === 'Active'
              });
          } else {
              this.router.navigate(['/categories']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.categoryForm.valid && this.category) {
      this.isSubmitting.set(true);
      const val = this.categoryForm.getRawValue();
      
      const updatedCategory: DocumentCategory = {
          ...this.category,
          categoryName: val.categoryName!,
          shortName: val.shortName!,
          description: val.description || '',
          status: val.isActive ? 'Active' : 'Inactive',
          securityLevel: val.securityLevel as SecurityLevel
      };

      try {
        await this.categoryService.updateCategory(updatedCategory, 'Updated via Edit Form');
        this.router.navigate(['/categories']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }
}
