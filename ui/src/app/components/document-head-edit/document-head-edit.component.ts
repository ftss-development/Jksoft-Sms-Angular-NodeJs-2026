
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocumentHeadService } from '../../services/document-head.service';
import { DocumentCategoryService } from '../../services/document-category.service';
import { DocumentHead, HeadStatus } from '../../models/document-head.model';

@Component({
  selector: 'app-document-head-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './document-head-edit.component.html',
  styleUrl: './document-head-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeadEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly headService = inject(DocumentHeadService);
  private readonly categoryService = inject(DocumentCategoryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  headId: string | undefined;
  head: DocumentHead | undefined;
  readonly categories = this.categoryService.categories;
  isSubmitting = signal(false);

  headForm = this.fb.group({
    parentCategoryId: ['', Validators.required],
    status: ['Active' as HeadStatus, Validators.required],
    headName: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['']
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.headId = id;
          this.head = this.headService.getHeadById(id);
          if (this.head) {
              this.headForm.patchValue({
                  parentCategoryId: this.head.parentCategoryId,
                  status: this.head.status,
                  headName: this.head.headName,
                  shortName: this.head.shortName,
                  description: this.head.description
              });
          } else {
              this.router.navigate(['/heads']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.headForm.valid && this.head) {
      this.isSubmitting.set(true);
      const val = this.headForm.getRawValue();
      const parentCat = this.categories().find(c => c.id === val.parentCategoryId);
      
      const updatedHead: DocumentHead = {
          ...this.head,
          headName: val.headName!,
          shortName: val.shortName!,
          parentCategoryId: val.parentCategoryId!,
          parentCategoryName: parentCat?.categoryName,
          status: val.status as HeadStatus,
          description: val.description || ''
      };

      try {
        await this.headService.updateHead(updatedHead);
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
