
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceCategoryService } from '../../services/service-category.service';
import { ServiceCategory } from '../../models/service-category.model';

@Component({
  selector: 'app-service-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './service-category-edit.component.html',
  styleUrl: './service-category-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCategoryEditComponent implements OnInit {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly categoryService = inject(ServiceCategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  categoryId: string | undefined;
  category: ServiceCategory | undefined;
  isSubmitting = signal(false);

  categoryForm = this.fb.group({
    categoryName: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(30)]],
    description: [''],
    isActive: [false]
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
                  isActive: this.category.isActive
              });
          } else {
              this.router.navigate(['/service-categories']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.categoryForm.valid && this.category) {
      this.isSubmitting.set(true);
      const val = this.categoryForm.getRawValue();
      
      const updatedCategory: ServiceCategory = {
          ...this.category,
          categoryName: val.categoryName!,
          shortName: val.shortName!,
          description: val.description || '',
          isActive: val.isActive!
      };

      try {
        await this.categoryService.updateCategory(updatedCategory);
        this.router.navigate(['/service-categories']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/service-categories']);
  }
}
