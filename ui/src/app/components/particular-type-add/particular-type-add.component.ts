
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ParticularTypeService } from '../../services/particular-type.service';
import { ParticularTypeStatus } from '../../models/particular-type.model';

@Component({
  selector: 'app-particular-type-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './particular-type-add.component.html',
  styleUrl: './particular-type-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularTypeAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly ptService = inject(ParticularTypeService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  // Form matching screenshot
  typeForm = this.fb.group({
    typeName: ['', Validators.required],
    description: [''], // Implied by standard forms and detail view
    isActive: [true, Validators.required],
    // Additional fields for detail view
    category: ['Operating Expenses'],
    defaultGlGroup: [''],
    taxEligibility: ['Subject to Standard VAT']
  });

  async onSubmit(): Promise<void> {
    if (this.typeForm.valid) {
      this.isSubmitting.set(true);
      const val = this.typeForm.getRawValue();
      try {
        await this.ptService.addParticularType({
            typeName: val.typeName!,
            description: val.description || '',
            status: val.isActive ? 'Active' : 'Inactive',
            category: val.category!,
            defaultGlGroup: val.defaultGlGroup || 'UNASSIGNED',
            taxEligibility: val.taxEligibility!
        });
        this.router.navigate(['/particular-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.typeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/particular-types']);
  }
}
