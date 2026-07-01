
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SignalTypeService } from '../../services/signal-type.service';
import { SignalTypeStatus } from '../../models/signal-type.model';

@Component({
  selector: 'app-signal-type-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signal-type-add.component.html',
  styleUrl: './signal-type-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalTypeAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly signalService = inject(SignalTypeService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  signalForm = this.fb.group({
    typeName: ['', [Validators.required, Validators.maxLength(30)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.signalForm.valid) {
      this.isSubmitting.set(true);
      const val = this.signalForm.getRawValue();
      try {
        await this.signalService.addSignalType({
            typeName: val.typeName!,
            status: val.isActive ? 'Active' : 'Inactive',
            description: '', // Default empty for quick add
        });
        this.router.navigate(['/signal-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.signalForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/signal-types']);
  }
}
