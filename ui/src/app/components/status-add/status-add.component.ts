
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-status-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './status-add.component.html',
  styleUrl: './status-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly statusService = inject(StatusService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  statusForm = this.fb.group({
    statusName: ['', [Validators.required, Validators.maxLength(45)]],
    statusFor: ['', [Validators.required, Validators.maxLength(45)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.statusForm.valid) {
      this.isSubmitting.set(true);
      const val = this.statusForm.getRawValue();
      try {
        await this.statusService.addStatus({
            statusName: val.statusName!,
            statusFor: val.statusFor!,
            isActive: val.isActive!,
            // Defaults
            statusType: 'General',
            description: '',
            isLocked: false,
            displayColor: '#6366F1',
            displayIcon: 'radio_button_unchecked'
        });
        this.router.navigate(['/statuses']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.statusForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/statuses']);
  }
}
