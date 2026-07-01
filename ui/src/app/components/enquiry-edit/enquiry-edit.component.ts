
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EnquiryService } from '../../services/enquiry.service';
import { Enquiry, EnquiryStatus } from '../../models/enquiry.model';

@Component({
  selector: 'app-enquiry-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './enquiry-edit.component.html',
  styleUrl: './enquiry-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly enquiryService = inject(EnquiryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  enquiryId: number | undefined;
  enquiry: Enquiry | undefined;

  enquiryForm = this.fb.group({
    customerName: ['', Validators.required],
    mobileNo: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    status: ['New' as EnquiryStatus, Validators.required],
    description: ['', Validators.required],
    assignedTo: [''],
    resolution: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.enquiryId = +idParam;
      this.enquiry = this.enquiryService.getEnquiryById(this.enquiryId);
      if (this.enquiry) {
        this.enquiryForm.patchValue({
          customerName: this.enquiry.customerName,
          mobileNo: this.enquiry.mobileNo,
          email: this.enquiry.email,
          status: this.enquiry.status,
          description: this.enquiry.description,
          assignedTo: this.enquiry.assignedTo,
          resolution: this.enquiry.resolution
        });
      } else {
        this.router.navigate(['/enquiries']);
      }
    }
  }

  onSubmit(): void {
    if (this.enquiryForm.valid && this.enquiry) {
      const val = this.enquiryForm.getRawValue();
      const updatedEnquiry: Enquiry = {
        ...this.enquiry,
        customerName: val.customerName!,
        mobileNo: val.mobileNo!,
        email: val.email!,
        status: val.status as EnquiryStatus,
        description: val.description!,
        assignedTo: val.assignedTo || undefined,
        resolution: val.resolution || undefined
      };
      this.enquiryService.updateEnquiry(updatedEnquiry);
      this.router.navigate(['/enquiries']);
    } else {
      this.enquiryForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/enquiries']);
  }
}
