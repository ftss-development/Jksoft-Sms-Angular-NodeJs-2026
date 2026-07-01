
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StbTypeService } from '../../services/stb-type.service';

@Component({
  selector: 'app-stb-type-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './stb-type-add.component.html',
  styleUrl: './stb-type-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StbTypeAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly stbService = inject(StbTypeService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  stbForm = this.fb.group({
    typeName: ['', [Validators.required, Validators.maxLength(45)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.stbForm.valid) {
      this.isSubmitting.set(true);
      const val = this.stbForm.getRawValue();
      try {
        // FIX: Removed `description` property as it is not part of the form. The service provides a default.
        await this.stbService.addStbType({
            typeName: val.typeName!,
            status: val.isActive ? 'Active' : 'Inactive',
            description: '',
        });
        this.router.navigate(['/stb-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.stbForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/stb-types']);
  }
}