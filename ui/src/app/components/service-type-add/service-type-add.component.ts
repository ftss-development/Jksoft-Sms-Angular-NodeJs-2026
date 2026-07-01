
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServiceTypeService } from '../../services/service-type.service';

@Component({
  selector: 'app-service-type-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './service-type-add.component.html',
  styleUrl: './service-type-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceTypeAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly serviceTypeService = inject(ServiceTypeService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  serviceForm = this.fb.group({
    serviceName: ['', [Validators.required, Validators.maxLength(50)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.serviceForm.valid) {
      this.isSubmitting.set(true);
      const val = this.serviceForm.getRawValue();
      try {
        await this.serviceTypeService.addServiceType({
            serviceName: val.serviceName!,
            status: val.isActive ? 'Active' : 'Inactive',
            // Default values for new service
            category: 'Uncategorized',
            slaTier: 'Standard',
            description: ''
        });
        this.router.navigate(['/service-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.serviceForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/service-types']);
  }
}
