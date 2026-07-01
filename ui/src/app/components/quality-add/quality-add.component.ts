
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QualityService } from '../../services/quality.service';
import { QualityStatus } from '../../models/quality.model';

@Component({
  selector: 'app-quality-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './quality-add.component.html',
  styleUrl: './quality-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QualityAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly qualityService = inject(QualityService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  qualityForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: [''],
    isActive: [true, Validators.required],
    level: [''],
    department: ['']
  });

  async onSubmit(): Promise<void> {
    if (this.qualityForm.valid) {
      this.isSubmitting.set(true);
      const val = this.qualityForm.getRawValue();
      try {
        await this.qualityService.addQuality({
            name: val.name!,
            description: val.description || '',
            status: val.isActive ? 'Active' : 'Inactive',
            level: val.level || 'Standard',
            department: val.department || 'General'
        });
        this.router.navigate(['/quality']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.qualityForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/quality']);
  }
}
