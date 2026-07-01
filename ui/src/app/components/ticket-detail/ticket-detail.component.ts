
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketPriority, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDetailComponent implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  ticket: Ticket | undefined;
  readonly TicketStatus = TicketStatus;
  readonly TicketPriority = TicketPriority;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.ticket = this.ticketService.getTicketById(+idParam);
    }
  }

  getPriorityClass(priority: TicketPriority): string {
    switch (priority) {
      case TicketPriority.Critical: return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case TicketPriority.High: return 'text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20';
      case TicketPriority.Medium: return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      default: return 'text-slate-700 bg-slate-50 dark:text-slate-400 dark:bg-slate-800';
    }
  }
}
