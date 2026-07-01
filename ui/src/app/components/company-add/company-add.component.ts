
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { CompanyStatus } from '../../models/company.model';

@Component({
  selector: 'app-company-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './company-add.component.html',
  styleUrl: './company-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly router: Router = inject(Router);

  currentStep = signal(1);
  isSubmitting = signal(false);

  // Form Group with nested steps
  companyForm = this.fb.group({
    general: this.fb.group({
      companyName: ['', Validators.required],
      shortName: ['', Validators.required],
      cin: ['', Validators.required],
      status: ['Active' as CompanyStatus, Validators.required],
      companyLevel: ['Holding Company', Validators.required],
      parentCompanyName: ['']
    }),
    contact: this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    }),
    legal: this.fb.group({
      gstNo: ['', Validators.required],
      panNo: ['', Validators.required],
      financialYearCycle: ['April to March', Validators.required],
      businessLicenseNo: ['', Validators.required]
    })
  });

  // Mock Dropdown Data
  levels = ['Holding Company', 'Subsidiary', 'Associate', 'Joint Venture'];
  countries = ['United States', 'Canada', 'United Kingdom', 'India', 'Australia'];
  states = ['New York', 'California', 'Texas', 'Florida', 'Illinois'];
  cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];
  cycles = ['April to March', 'January to December', 'July to June'];

  nextStep(): void {
    const currentGroup = this.getCurrentFormGroup();
    if (currentGroup.valid) {
      this.currentStep.update(s => Math.min(s + 1, 3));
    } else {
      currentGroup.markAllAsTouched();
    }
  }

  prevStep(): void {
    this.currentStep.update(s => Math.max(s - 1, 1));
  }

  getCurrentFormGroup(): FormGroup {
    if (this.currentStep() === 1) return this.companyForm.get('general') as FormGroup;
    if (this.currentStep() === 2) return this.companyForm.get('contact') as FormGroup;
    return this.companyForm.get('legal') as FormGroup;
  }

  async onSubmit(): Promise<void> {
    if (this.companyForm.valid) {
      this.isSubmitting.set(true);
      const val = this.companyForm.getRawValue();
      
      // Flatten the structure for the model
      try {
        await this.companyService.addCompany({
          // General
          companyName: val.general!.companyName!,
          shortName: val.general!.shortName!,
          cin: val.general!.cin!,
          status: val.general!.status as CompanyStatus,
          companyLevel: val.general!.companyLevel!,
          parentCompanyName: val.general!.parentCompanyName || undefined,
          
          // Contact
          addressLine1: val.contact!.addressLine1!,
          addressLine2: val.contact!.addressLine2 || undefined,
          country: val.contact!.country!,
          state: val.contact!.state!,
          city: val.contact!.city!,
          pinCode: val.contact!.pinCode!,
          email: val.contact!.email!,
          phone: val.contact!.phone!,

          // Legal
          gstNo: val.legal!.gstNo!,
          panNo: val.legal!.panNo!,
          financialYearCycle: val.legal!.financialYearCycle!,
          businessLicenseNo: val.legal!.businessLicenseNo!
        });
        this.router.navigate(['/companies']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/companies']);
  }
}
