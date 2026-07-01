
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaxService } from '../../services/tax.service';
import { Tax } from '../../models/tax.model';

@Component({
  selector: 'app-tax-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './tax-edit.component.html',
  styleUrl: './tax-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxEditComponent implements OnInit {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly taxService = inject(TaxService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  taxId: string | undefined;
  tax = signal<Tax | undefined>(undefined);
  isSubmitting = signal(false);

  taxForm = this.fb.group({
    name: ['', Validators.required],
    shortName: ['', Validators.required],
    percentage: [0, [Validators.required, Validators.min(0)]],
    effectiveDate: ['', Validators.required]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.taxId = id;
          const foundTax = this.taxService.getTaxById(id);
          this.tax.set(foundTax);
          
          if (foundTax) {
              this.taxForm.patchValue({
                  name: foundTax.taxName,
                  shortName: foundTax.shortName,
                  percentage: foundTax.value,
                  effectiveDate: foundTax.effectiveDate.toISOString().substring(0, 10)
              });
          } else {
              this.router.navigate(['/taxes']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    const currentTax = this.tax();
    if (this.taxForm.valid && currentTax) {
      this.isSubmitting.set(true);
      const val = this.taxForm.getRawValue();
      
      const updatedTax: Tax = {
          ...currentTax,
          taxName: val.name!,
          shortName: val.shortName!,
          value: val.percentage!,
          effectiveDate: new Date(val.effectiveDate!)
      };

      try {
        await this.taxService.updateTax(updatedTax);
        this.router.navigate(['/taxes']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/taxes']);
  }
}
