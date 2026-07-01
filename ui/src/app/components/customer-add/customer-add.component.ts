
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
// Add FormBuilder to imports for explicit typing
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model'; // Import Customer for type hinting

@Component({
  selector: 'app-customer-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-add.component.html',
  styleUrl: './customer-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly router: Router = inject(Router);

  // Mock data for dropdowns
  readonly salutations = this.customerService.mockSalutations;
  readonly subscriberTypes = this.customerService.mockSubscriberTypes;
  readonly companies = this.customerService.mockCompanies;
  readonly gstModes = this.customerService.mockGstModes;
  readonly connectionTypes = this.customerService.mockConnectionTypes;
  // Expose mockStatuses to get default statusId
  readonly statuses = this.customerService.mockStatuses;


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
    // Changed from statusId to isActive
    isActive: [true, Validators.required], // Default to Active
  });

  onSubmit(): void {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.getRawValue();

      // Ensure newCustomer adheres to Omit<Customer, 'customerId'> type by including statusId
      const newCustomer: Omit<Customer, 'customerId' | 'salutation' | 'subscriberType' | 'company' | 'gstMode' | 'connectionType' | 'status' | 'technicalInCharge' | 'collectionInCharge' | 'createdBy' | 'createdDate' | 'updatedBy' | 'lastUpdated'> = {
        accountNo: formValue.accountNo!,
        salutationId: formValue.salutationId!,
        subscriberTypeId: formValue.subscriberTypeId!,
        firstName: formValue.firstName!,
        middleName: formValue.middleName!,
        lastName: formValue.lastName!,
        areInstallationBillingAddressSame: true, // Simplified
        dateOfInstallation: new Date(), // Simplified
        gstNo: formValue.gstNo!,
        panNo: formValue.panNo!,
        aadhaarNo: formValue.aadhaarNo!,
        msoNo: formValue.msoNo!,
        companyId: formValue.companyId!,
        gstModeId: formValue.gstModeId!,
        connectionTypeId: formValue.connectionTypeId!,
        remark: formValue.remark!,
        statusId: formValue.isActive ? 1 : 2, // Map boolean back to statusId (1 for Active, 2 for Inactive)
        customersAddress: {
          address1: formValue.address1!,
          pinCode: formValue.pinCode!,
          customersAddressId: 0, // Will be set by service
          areaId: 0, districtId: 0, colonyId: 0, cityId: 0, stateId: 0, // Simplified
          address2: '', address3: '', statusId: 0, // Simplified. StatusId will be set by service.
        },
        customersContact: {
          mobileNo1: formValue.mobileNo1!,
          emailId1: formValue.emailId1!,
          customersContactId: 0, // Will be set by service
          telephoneNo1: '', telephoneNo2: '', telephoneNo3: '', // Simplified
          mobileNo2: '', mobileNo3: '', emailId2: '', statusId: 0, // Simplified. StatusId will be set by service.
        },
      };

      this.customerService.addCustomer(newCustomer);
      this.router.navigate(['/customers']);
    } else {
      this.customerForm.markAllAsTouched();
      console.log('Form is invalid', this.customerForm.errors);
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }
}
