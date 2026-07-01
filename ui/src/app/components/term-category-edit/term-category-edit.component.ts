
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TermCategoryService } from '../../services/term-category.service';
import { TermCategory } from '../../models/term-category.model';

@Component({
  selector: 'app-term-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './term-category-edit.component.html',
  styleUrl: './term-category-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermCategoryEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly termService = inject(TermCategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  categoryId: string | undefined;
  category: TermCategory | undefined;
  isSubmitting = signal(false);

  categoryForm = this.fb.group({
    categoryName: ['', Validators.required],
    categoryCode: [{value: '', disabled: true}],
    description: [''],
    isActive: [false],
    // System Config
    enableAutoRenewal: [false],
    requireLegalApproval: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.categoryId = id;
          this.category = this.termService.getCategoryById(id);
          if (this.category) {
              this.categoryForm.patchValue({
                  categoryName: this.category.categoryName,
                  categoryCode: this.category.categoryCode,
                  description: this.category.description,
                  isActive: this.category.isActive,
                  enableAutoRenewal: this.category.enableAutoRenewal,
                  requireLegalApproval: this.category.requireLegalApproval
              });
          } else {
              this.router.navigate(['/term-categories']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.categoryForm.valid && this.category) {
      this.isSubmitting.set(true);
      const val = this.categoryForm.getRawValue();
      
      const updatedCategory: TermCategory = {
          ...this.category,
          categoryName: val.categoryName!,
          description: val.description || '',
          isActive: val.isActive!,
          enableAutoRenewal: val.enableAutoRenewal || false,
          requireLegalApproval: val.requireLegalApproval || false
      };

      try {
        await this.termService.updateCategory(updatedCategory);
        this.router.navigate(['/term-categories']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/term-categories']);
  }
}
