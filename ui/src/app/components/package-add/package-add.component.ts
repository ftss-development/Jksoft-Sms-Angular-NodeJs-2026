
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { PackageChannel } from '../../models/package.model';

@Component({
  selector: 'app-package-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './package-add.component.html',
  styleUrl: './package-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly packageService = inject(PackageService);
  private readonly router: Router = inject(Router);

  packageForm = this.fb.group({
    packageName: ['', Validators.required],
    packageShortName: ['', Validators.required],
    packageGrade: ['', Validators.required],
    description: [''],
    serviceCategoryType: ['', Validators.required],
    msoOrBroadcaster: ['', Validators.required],
    packageCreationDate: [new Date().toISOString().substring(0, 10), Validators.required],
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

  // Mock mapped channels for UI purposes since we don't have a channel picker implemented
  mappedChannels: PackageChannel[] = [];

  // Recalculate total amount when base rate or tax changes
  recalculateTotal() {
    const base = this.packageForm.get('baseRate')?.value || 0;
    const tax = this.packageForm.get('taxPercentage')?.value || 0;
    const total = base + (base * (tax / 100));
    this.packageForm.get('totalAmount')?.setValue(parseFloat(total.toFixed(2)));
  }

  addMockChannel() {
    // Simulate adding a channel
    const id = this.mappedChannels.length + 1;
    this.mappedChannels.push({
      id: id,
      name: `Demo Channel ${id}`,
      category: 'General',
      language: 'English'
    });
  }

  removeChannel(index: number) {
    this.mappedChannels.splice(index, 1);
  }

  onSubmit(): void {
    if (this.packageForm.valid) {
      const val = this.packageForm.getRawValue();
      this.packageService.addPackage({
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
      });
      this.router.navigate(['/packages']);
    } else {
      this.packageForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/packages']);
  }
}
