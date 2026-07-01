
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketPriority, TicketStatus } from '../../models/ticket.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-ticket-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './ticket-edit.component.html',
  styleUrl: './ticket-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);
  private readonly customerService = inject(CustomerService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  
  ticketId: number | undefined;
  ticket: Ticket | undefined;
  
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
    source: ['', Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.ticketId = +idParam;
      this.ticket = this.ticketService.getTicketById(this.ticketId);
      if (this.ticket) {
        this.ticketForm.patchValue({
          subject: this.ticket.subject,
          description: this.ticket.description,
          customerId: this.ticket.customerId,
          priority: this.ticket.priority,
          status: this.ticket.status,
          category: this.ticket.category,
          source: this.ticket.source
        });
      } else {
        this.router.navigate(['/tickets']);
      }
    }
  }

  onSubmit(): void {
    if (this.ticketForm.valid && this.ticket) {
      const val = this.ticketForm.getRawValue();
      const updatedTicket: Ticket = {
        ...this.ticket,
        subject: val.subject!,
        description: val.description!,
        customerId: val.customerId!,
        customer: this.customerService.getCustomerById(val.customerId!),
        priority: val.priority!,
        status: val.status!,
        category: val.category!,
        source: val.source!,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
      };
      
      this.ticketService.updateTicket(updatedTicket);
      this.router.navigate(['/tickets']);
    }
  }
  
  onCancel(): void {
    this.router.navigate(['/tickets']);
  }
}
