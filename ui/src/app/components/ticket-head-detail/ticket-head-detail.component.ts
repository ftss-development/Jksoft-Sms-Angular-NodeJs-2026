
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketHeadService } from '../../services/ticket-head.service';
import { TicketHead } from '../../models/ticket-head.model';

@Component({
  selector: 'app-ticket-head-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './ticket-head-detail.component.html',
  styleUrl: './ticket-head-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketHeadDetailComponent implements OnInit {
  private readonly headService = inject(TicketHeadService);
  private readonly route = inject(ActivatedRoute);

  ticketHead: TicketHead | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.ticketHead = this.headService.getTicketHeadById(id);
      }
  }
}
