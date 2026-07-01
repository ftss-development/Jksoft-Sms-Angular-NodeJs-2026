
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QualityService } from '../../services/quality.service';
import { Quality } from '../../models/quality.model';

@Component({
  selector: 'app-quality-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './quality-edit.component.html',
  styleUrl: './quality-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QualityEditComponent implements OnInit {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly qualityService = inject(QualityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  qualityId: string | undefined;
  quality: Quality | undefined;
  isSubmitting = signal(false);

  qualityForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: [''],
    isActive: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.qualityId = id;
          this.quality = this.qualityService.getQualityById(id);
          if (this.quality) {
              this.qualityForm.patchValue({
                  name: this.quality.name,
                  description: this.quality.description,
                  isActive: this.quality.status === 'Active'
              });
          } else {
              this.router.navigate(['/quality']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.qualityForm.valid && this.quality) {
      this.isSubmitting.set(true);
      const val = this.qualityForm.getRawValue();
      
      const updatedQuality: Quality = {
          ...this.quality,
          name: val.name!,
          description: val.description || '',
          status: val.isActive ? 'Active' : 'Inactive'
      };

      try {
        await this.qualityService.updateQuality(updatedQuality);
        this.router.navigate(['/quality']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/quality']);
  }
}
