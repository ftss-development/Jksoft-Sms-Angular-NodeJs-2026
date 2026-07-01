
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company, CompanyStatus } from '../../models/company.model';

@Component({
  selector: 'app-company-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './company-edit.component.html',
  styleUrl: './company-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  companyId: string | undefined;
  company: Company | undefined;
  
  // State
  currentStep = signal(1);
  isSubmitting = signal(false);
  isAdmin = signal(true); // Role simulation

  // Nested form structure to match Add Component
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
      financialYearCycle: ['', Validators.required],
      businessLicenseNo: ['', Validators.required]
    })
  });

  // Mock data
  levels = ['Holding Company', 'Subsidiary', 'Associate', 'Joint Venture'];
  countries = ['United States', 'Canada', 'United Kingdom', 'India', 'Australia'];
  states = ['New York', 'California', 'Texas', 'Florida', 'Illinois'];
  cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];
  cycles = ['April to March', 'January to December', 'July to June'];

  // Computed properties for UI logic
  totalSteps = computed(() => this.isAdmin() ? 3 : 2);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.companyId = idParam;
      this.company = this.companyService.getCompanyById(this.companyId);
      if (this.company) {
        // Patch values into the nested structure
        this.companyForm.patchValue({
          general: {
            companyName: this.company.companyName,
            shortName: this.company.shortName,
            cin: this.company.cin,
            status: this.company.status,
            companyLevel: this.company.companyLevel,
            parentCompanyName: this.company.parentCompanyName,
          },
          contact: {
            addressLine1: this.company.addressLine1,
            addressLine2: this.company.addressLine2,
            country: this.company.country,
            state: this.company.state,
            city: this.company.city,
            pinCode: this.company.pinCode,
            email: this.company.email,
            phone: this.company.phone,
          },
          legal: {
            gstNo: this.company.gstNo,
            panNo: this.company.panNo,
            financialYearCycle: this.company.financialYearCycle,
            businessLicenseNo: this.company.businessLicenseNo
          }
        });
      } else {
        this.router.navigate(['/companies']);
      }
    }
  }

  toggleRole() {
    this.isAdmin.update(val => !val);
    // If we toggle off admin while on step 3, go back to step 2
    if (!this.isAdmin() && this.currentStep() === 3) {
        this.currentStep.set(2);
    }
  }

  nextStep(): void {
    const currentGroup = this.getCurrentFormGroup();
    if (currentGroup.valid) {
      this.currentStep.update(s => Math.min(s + 1, this.totalSteps()));
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
    // We only validate the parts of the form the user can see/access
    const isGeneralValid = this.companyForm.get('general')?.valid;
    const isContactValid = this.companyForm.get('contact')?.valid;
    const isLegalValid = this.isAdmin() ? this.companyForm.get('legal')?.valid : true;

    if (isGeneralValid && isContactValid && isLegalValid && this.company) {
      this.isSubmitting.set(true);
      const val = this.companyForm.getRawValue();
      
      const updatedCompany: Company = {
        ...this.company,
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

        // Legal (retain existing values if user is not admin and didn't touch them, 
        // effectively form values are preserved if initialized, so getting raw value is fine)
        gstNo: val.legal!.gstNo!,
        panNo: val.legal!.panNo!,
        financialYearCycle: val.legal!.financialYearCycle!,
        businessLicenseNo: val.legal!.businessLicenseNo!
      };

      try {
        await this.companyService.updateCompany(updatedCompany);
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
