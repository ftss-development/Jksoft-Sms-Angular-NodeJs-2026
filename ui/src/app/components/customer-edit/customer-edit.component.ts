
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  customerId: string | undefined;
  customer: Customer | undefined;

  readonly salutations = this.customerService.mockSalutations;
  readonly subscriberTypes = this.customerService.mockSubscriberTypes;
  readonly companies = this.customerService.mockCompanies;
  readonly gstModes = this.customerService.mockGstModes;
  readonly connectionTypes = this.customerService.mockConnectionTypes;

  customerForm = this.fb.group({
    accountNo: ['', Validators.required],
    salutationId: [1, Validators.required],
    subscriberTypeId: [1, Validators.required],
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    mobileNo1: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    emailId1: ['', [Validators.required, Validators.email]],
    address1: ['', Validators.required],
    pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    companyId: [1, Validators.required],
    gstNo: [''],
    panNo: [''],
    aadhaarNo: [''],
    msoNo: [''],
    gstModeId: [1, Validators.required],
    connectionTypeId: [1, Validators.required],
    remark: [''],
    isActive: [true, Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.customerId = idParam;
      this.customer = this.customerService.getCustomerById(this.customerId);
      if (this.customer) {
        this.customerForm.patchValue({
          accountNo: this.customer.accountNo,
          salutationId: this.customer.salutationId,
          subscriberTypeId: this.customer.subscriberTypeId,
          firstName: this.customer.firstName,
          middleName: this.customer.middleName,
          lastName: this.customer.lastName,
          mobileNo1: this.customer.customersContact?.mobileNo1,
          emailId1: this.customer.customersContact?.emailId1,
          address1: this.customer.customersAddress?.address1,
          pinCode: this.customer.customersAddress?.pinCode,
          companyId: this.customer.companyId,
          gstNo: this.customer.gstNo,
          panNo: this.customer.panNo,
          aadhaarNo: this.customer.aadhaarNo,
          msoNo: this.customer.msoNo,
          gstModeId: this.customer.gstModeId,
          connectionTypeId: this.customer.connectionTypeId,
          remark: this.customer.remark,
          isActive: this.customer.statusId === 1,
        });
      }
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid && this.customer) {
      const formValue = this.customerForm.getRawValue();

      const updatedCustomer: Customer = {
        ...this.customer,
        accountNo: formValue.accountNo!,
        salutationId: formValue.salutationId!,
        subscriberTypeId: formValue.subscriberTypeId!,
        firstName: formValue.firstName!,
        middleName: formValue.middleName!,
        lastName: formValue.lastName!,
        gstNo: formValue.gstNo!,
        panNo: formValue.panNo!,
        aadhaarNo: formValue.aadhaarNo!,
        msoNo: formValue.msoNo!,
        companyId: formValue.companyId!,
        gstModeId: formValue.gstModeId!,
        connectionTypeId: formValue.connectionTypeId!,
        remark: formValue.remark!,
        statusId: formValue.isActive ? 1 : 2,
        customersAddress: {
          ...this.customer.customersAddress!,
          address1: formValue.address1!,
          pinCode: formValue.pinCode!,
        },
        customersContact: {
          ...this.customer.customersContact!,
          mobileNo1: formValue.mobileNo1!,
          emailId1: formValue.emailId1!,
        },
      };

      this.customerService.updateCustomer(updatedCustomer);
      this.router.navigate(['/customers']);
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }
}
