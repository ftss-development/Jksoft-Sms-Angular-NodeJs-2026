
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-state-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './state-add.component.html',
  styleUrl: './state-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly router: Router = inject(Router);

  readonly countries = this.countryService.countries;
  
  isSubmitting = signal(false);

  stateForm = this.fb.group({
    stateName: ['', Validators.required],
    stateCode: ['', Validators.required],
    countryId: ['', Validators.required],
    isActive: [true]
  });

  async onSubmit(): Promise<void> {
    if (this.stateForm.valid) {
      this.isSubmitting.set(true);
      const val = this.stateForm.getRawValue();
      try {
        await this.stateService.addState({
            stateName: val.stateName!,
            stateCode: val.stateCode!,
            countryId: val.countryId!,
            isActive: val.isActive!
        });
        this.router.navigate(['/states']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.stateForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/states']);
  }
}
