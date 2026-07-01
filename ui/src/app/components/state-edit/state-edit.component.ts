
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StateService } from '../../services/state.service';
import { CountryService } from '../../services/country.service';
import { State } from '../../models/state.model';

@Component({
  selector: 'app-state-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './state-edit.component.html',
  styleUrl: './state-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly stateService = inject(StateService);
  private readonly countryService = inject(CountryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  stateId: string | undefined;
  state: State | undefined;
  readonly countries = this.countryService.countries;
  
  isSubmitting = signal(false);

  stateForm = this.fb.group({
    stateName: ['', Validators.required],
    stateCode: ['', Validators.required],
    countryId: ['', Validators.required],
    isActive: [false]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.stateId = idParam;
      this.state = this.stateService.getStateById(this.stateId);
      if (this.state) {
        this.stateForm.patchValue({
          stateName: this.state.stateName,
          stateCode: this.state.stateCode,
          countryId: this.state.countryId,
          isActive: this.state.isActive
        });
      } else {
        this.router.navigate(['/states']);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.stateForm.valid && this.state) {
      this.isSubmitting.set(true);
      const val = this.stateForm.getRawValue();
      const updatedState: State = {
        ...this.state,
        stateName: val.stateName!,
        stateCode: val.stateCode!,
        countryId: val.countryId!,
        isActive: val.isActive!
      };

      try {
        await this.stateService.updateState(updatedState);
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
