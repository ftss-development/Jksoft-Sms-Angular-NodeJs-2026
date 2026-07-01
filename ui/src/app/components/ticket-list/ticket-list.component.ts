
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { TicketPriority, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketListComponent {
  readonly ticketService = inject(TicketService);
  readonly tickets = this.ticketService.tickets;
  
  readonly TicketStatus = TicketStatus;
  readonly TicketPriority = TicketPriority;

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedTickets = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.tickets().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.tickets().length / this.pageSize));
  readonly startItemIndex = computed(() => this.tickets().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.tickets().length));

  get pages() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onDelete(id: number): void {
    this.ticketService.deleteTicket(id);
  }
}
