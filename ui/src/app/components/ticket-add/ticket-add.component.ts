
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { TicketPriority, TicketStatus } from '../../models/ticket.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-ticket-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-add.component.html',
  styleUrl: './ticket-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);
  private readonly customerService = inject(CustomerService);
  private readonly router: Router = inject(Router);
  
  readonly customers = this.customerService.customers;
  readonly priorities = Object.values(TicketPriority);
  readonly statuses = Object.values(TicketStatus);

  ticketForm = this.fb.group({
    subject: ['', Validators.required],
    description: ['', Validators.required],
    customerId: ['', Validators.required],
    priority: [TicketPriority.Medium, Validators.required],
    status: [TicketStatus.Open, Validators.required],
    category: ['', Validators.required],
    source: ['Phone', Validators.required],
  });

  onSubmit(): void {
    if (this.ticketForm.valid) {
      const val = this.ticketForm.getRawValue();
      this.ticketService.addTicket({
        subject: val.subject!,
        description: val.description!,
        customerId: val.customerId!,
        customer: this.customerService.getCustomerById(val.customerId!),
        priority: val.priority!,
        status: val.status!,
        category: val.category!,
        source: val.source!,
        tags: [], // Default empty
        assignedToName: 'Unassigned',
        updatedBy: 'System Admin',
        lastUpdated: new Date()
      });
      this.router.navigate(['/tickets']);
    } else {
      this.ticketForm.markAllAsTouched();
    }
  }
  
  onCancel(): void {
    this.router.navigate(['/tickets']);
  }
}
