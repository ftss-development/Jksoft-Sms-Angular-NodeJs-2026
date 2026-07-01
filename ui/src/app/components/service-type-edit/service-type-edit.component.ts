
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceTypeService } from '../../services/service-type.service';
import { ServiceType } from '../../models/service-type.model';

@Component({
  selector: 'app-service-type-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './service-type-edit.component.html',
  styleUrl: './service-type-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceTypeEditComponent implements OnInit {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly serviceService = inject(ServiceTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  serviceId: string | undefined;
  serviceType: ServiceType | undefined;
  isSubmitting = signal(false);

  // Mock Dropdown Options
  readonly categories = ['Professional Services', 'Cloud Storage', 'Consulting', 'Support', 'Installation', 'Internet Services', 'Infrastructure'];
  readonly tiers = ['Tier 1 - Standard', 'Tier 1 - Premium Response', 'Tier 2 - Business', 'Tier 3 - Critical', 'Gold', 'Silver'];

  serviceForm = this.fb.group({
    serviceName: ['', [Validators.required, Validators.maxLength(50)]],
    category: ['', Validators.required],
    slaTier: ['', Validators.required],
    description: [''],
    isActive: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.serviceId = id;
          this.serviceType = this.serviceService.getServiceTypeById(id);
          if (this.serviceType) {
              this.serviceForm.patchValue({
                  serviceName: this.serviceType.serviceName,
                  category: this.serviceType.category,
                  slaTier: this.serviceType.slaTier,
                  description: this.serviceType.description,
                  isActive: this.serviceType.status === 'Active'
              });
          } else {
              this.router.navigate(['/service-types']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.valid && this.serviceType) {
      this.isSubmitting.set(true);
      const val = this.serviceForm.getRawValue();
      
      const updatedService: ServiceType = {
          ...this.serviceType,
          serviceName: val.serviceName!,
          category: val.category!,
          slaTier: val.slaTier!,
          description: val.description || '',
          status: val.isActive ? 'Active' : 'Inactive'
      };

      try {
        await this.serviceService.updateServiceType(updatedService);
        this.router.navigate(['/service-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/service-types']);
  }
}
