
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketReasonService } from '../../services/ticket-reason.service';

@Component({
  selector: 'app-ticket-reason-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-reason-add.component.html',
  styleUrl: './ticket-reason-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketReasonAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly reasonService = inject(TicketReasonService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  reasonForm = this.fb.group({
    reasonName: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(50)]],
    isActive: [true, Validators.required],
    classificationType: ['Incident'],
    severityLevel: ['Medium']
  });

  async onSubmit(): Promise<void> {
    if (this.reasonForm.valid) {
      this.isSubmitting.set(true);
      const val = this.reasonForm.getRawValue();
      try {
        await this.reasonService.addReason({
            reasonName: val.reasonName!,
            shortName: val.shortName!,
            status: val.isActive ? 'Active' : 'Inactive',
            description: '',
            classificationType: val.classificationType as any,
            severityLevel: val.severityLevel as any
        });
        this.router.navigate(['/ticket-reasons']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.reasonForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/ticket-reasons']);
  }
}
