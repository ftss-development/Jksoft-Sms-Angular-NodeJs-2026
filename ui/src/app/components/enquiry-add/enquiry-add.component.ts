
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EnquiryService } from '../../services/enquiry.service';
import { EnquiryStatus } from '../../models/enquiry.model';

@Component({
  selector: 'app-enquiry-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './enquiry-add.component.html',
  styleUrl: './enquiry-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly enquiryService = inject(EnquiryService);
  private readonly router: Router = inject(Router);

  enquiryForm = this.fb.group({
    customerName: ['', Validators.required],
    mobileNo: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    status: ['New' as EnquiryStatus, Validators.required],
    description: ['', Validators.required],
    assignedTo: ['']
  });

  onSubmit(): void {
    if (this.enquiryForm.valid) {
      const val = this.enquiryForm.getRawValue();
      this.enquiryService.addEnquiry({
        customerName: val.customerName!,
        mobileNo: val.mobileNo!,
        email: val.email!,
        status: val.status as EnquiryStatus,
        description: val.description!,
        assignedTo: val.assignedTo || undefined
      });
      this.router.navigate(['/enquiries']);
    } else {
      this.enquiryForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/enquiries']);
  }
}
