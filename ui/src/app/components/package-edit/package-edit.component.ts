
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { Package, PackageChannel } from '../../models/package.model';

@Component({
  selector: 'app-package-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './package-edit.component.html',
  styleUrl: './package-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly packageService = inject(PackageService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  packageId: number | undefined;
  package: Package | undefined;
  mappedChannels: PackageChannel[] = [];

  packageForm = this.fb.group({
    packageName: ['', Validators.required],
    packageShortName: ['', Validators.required],
    packageGrade: ['', Validators.required],
    description: [''],
    serviceCategoryType: ['', Validators.required],
    msoOrBroadcaster: ['', Validators.required],
    packageCreationDate: ['', Validators.required],
    packageInactiveFrom: [''],
    isActive: [true],
    
    // Pricing
    isTaxInclusive: [false],
    baseRate: [0, [Validators.required, Validators.min(0)]],
    taxPercentage: [0, [Validators.required, Validators.min(0)]],
    totalAmount: [{value: 0, disabled: true}],
    drp: [0, [Validators.required, Validators.min(0)]],
    mrp: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.packageId = +idParam;
      this.package = this.packageService.getPackageById(this.packageId);
      if (this.package) {
        this.mappedChannels = [...this.package.mappedChannels];
        
        // Format date for input
        const creationDate = this.package.packageCreationDate ? new Date(this.package.packageCreationDate).toISOString().substring(0, 10) : '';
        const inactiveDate = this.package.packageInactiveFrom ? new Date(this.package.packageInactiveFrom).toISOString().substring(0, 10) : '';

        this.packageForm.patchValue({
          packageName: this.package.packageName,
          packageShortName: this.package.packageShortName,
          packageGrade: this.package.packageGrade,
          description: this.package.description,
          serviceCategoryType: this.package.serviceCategoryType,
          msoOrBroadcaster: this.package.msoOrBroadcaster,
          packageCreationDate: creationDate,
          packageInactiveFrom: inactiveDate,
          isActive: this.package.isActive,
          isTaxInclusive: this.package.isTaxInclusive,
          baseRate: this.package.baseRate,
          taxPercentage: this.package.taxPercentage,
          totalAmount: this.package.totalAmount,
          drp: this.package.drp,
          mrp: this.package.mrp,
        });
      } else {
        this.router.navigate(['/packages']);
      }
    }
  }

  recalculateTotal() {
    const base = this.packageForm.get('baseRate')?.value || 0;
    const tax = this.packageForm.get('taxPercentage')?.value || 0;
    const total = base + (base * (tax / 100));
    this.packageForm.get('totalAmount')?.setValue(parseFloat(total.toFixed(2)));
  }

  addMockChannel() {
    const id = Math.floor(Math.random() * 1000) + 10;
    this.mappedChannels.push({
      id: id,
      name: `New Channel ${id}`,
      category: 'General',
      language: 'English'
    });
  }

  removeChannel(index: number) {
    this.mappedChannels.splice(index, 1);
  }

  onSubmit(): void {
    if (this.packageForm.valid && this.package) {
      const val = this.packageForm.getRawValue();
      const updatedPackage: Package = {
        ...this.package,
        packageName: val.packageName!,
        packageShortName: val.packageShortName!,
        packageGrade: val.packageGrade!,
        description: val.description!,
        serviceCategoryType: val.serviceCategoryType!,
        msoOrBroadcaster: val.msoOrBroadcaster!,
        packageCreationDate: new Date(val.packageCreationDate!),
        packageInactiveFrom: val.packageInactiveFrom ? new Date(val.packageInactiveFrom) : undefined,
        isActive: val.isActive!,
        isTaxInclusive: val.isTaxInclusive!,
        baseRate: +val.baseRate!,
        taxPercentage: +val.taxPercentage!,
        totalAmount: +this.packageForm.get('totalAmount')?.value!,
        drp: +val.drp!,
        mrp: +val.mrp!,
        mappedChannels: this.mappedChannels
      };
      
      this.packageService.updatePackage(updatedPackage);
      this.router.navigate(['/packages']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/packages']);
  }
}
