
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StbSchemeService } from '../../services/stb-scheme.service';
import { StbScheme } from '../../models/stb-scheme.model';

@Component({
  selector: 'app-stb-scheme-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './stb-scheme-edit.component.html',
  styleUrl: './stb-scheme-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StbSchemeEditComponent implements OnInit {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly schemeService = inject(StbSchemeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  schemeId: string | undefined;
  scheme: StbScheme | undefined;
  isSubmitting = signal(false);

  schemeForm = this.fb.group({
    schemeName: ['', Validators.required],
    description: [''],
    rentalRate: [0, [Validators.required, Validators.min(0)]],
    securityDeposit: [0, [Validators.required, Validators.min(0)]],
    isActive: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.schemeId = id;
          this.scheme = this.schemeService.getSchemeById(id);
          if (this.scheme) {
              this.schemeForm.patchValue({
                  schemeName: this.scheme.schemeName,
                  description: this.scheme.description,
                  rentalRate: this.scheme.rentalRate,
                  securityDeposit: this.scheme.securityDeposit,
                  isActive: this.scheme.isActive
              });
          } else {
              this.router.navigate(['/stb-schemes']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.schemeForm.valid && this.scheme) {
      this.isSubmitting.set(true);
      const val = this.schemeForm.getRawValue();
      
      const updatedScheme: StbScheme = {
          ...this.scheme,
          schemeName: val.schemeName!,
          description: val.description || '',
          rentalRate: val.rentalRate || 0,
          securityDeposit: val.securityDeposit || 0,
          isActive: val.isActive!,
          status: val.isActive ? 'Active' : 'Inactive'
      };

      try {
        await this.schemeService.updateScheme(updatedScheme);
        this.router.navigate(['/stb-schemes']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/stb-schemes']);
  }
}
