
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketHeadService } from '../../services/ticket-head.service';
import { ServiceCategory } from '../../models/ticket-head.model';

@Component({
  selector: 'app-ticket-head-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-head-add.component.html',
  styleUrl: './ticket-head-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketHeadAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly headService = inject(TicketHeadService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  // Mock Dropdown Data
  serviceCategories: ServiceCategory[] = ['Infrastructure', 'Software', 'Hardware', 'Access Control', 'Network', 'Database'];
  reasons = ['Hardware Failure', 'Software Bug', 'Access Request', 'Performance Issue', 'Configuration Error'];

  ticketHeadForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(50)]],
    serviceCategory: ['Infrastructure' as ServiceCategory, Validators.required],
    reason: ['', Validators.required],
    resolutionTime: [30, [Validators.required, Validators.min(0)]],
    status: ['Published', Validators.required],
    colorCode: ['#3B82F6'],
    addSolutionStep: [false],
    isActive: [true]
  });

  async onSubmit(): Promise<void> {
    if (this.ticketHeadForm.valid) {
      this.isSubmitting.set(true);
      const val = this.ticketHeadForm.getRawValue();
      try {
        await this.headService.addTicketHead({
            name: val.name!,
            shortName: val.shortName!,
            serviceCategory: val.serviceCategory as ServiceCategory,
            reason: val.reason!,
            resolutionTime: val.resolutionTime!,
            status: val.status as any,
            colorCode: val.colorCode!,
            isActive: val.isActive!,
            // Defaults
            icon: 'confirmation_number',
            slaTargetHours: 24,
            description: 'New ticket head configuration.',
            domain: 'General',
            autoClose: false,
            escalationTeam: 'Support Desk'
        });
        this.router.navigate(['/ticket-heads']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.ticketHeadForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/ticket-heads']);
  }
}
