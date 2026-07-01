
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DesignationService } from '../../services/designation.service';

@Component({
  selector: 'app-designation-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './designation-add.component.html',
  styleUrl: './designation-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignationAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly designationService = inject(DesignationService);
  private readonly router: Router = inject(Router);

  isSubmitting = signal(false);

  designationForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    shortCode: ['', [Validators.required, Validators.maxLength(10)]],
    level: ['', Validators.required],
    isActive: [true]
  });

  async onSubmit(): Promise<void> {
    if (this.designationForm.valid) {
      this.isSubmitting.set(true);
      const val = this.designationForm.getRawValue();
      try {
        await this.designationService.addDesignation({
            name: val.name!,
            shortCode: val.shortCode!,
            level: val.level!,
            status: val.isActive ? 'Active' : 'Inactive'
        });
        this.router.navigate(['/designations']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.designationForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/designations']);
  }
}
