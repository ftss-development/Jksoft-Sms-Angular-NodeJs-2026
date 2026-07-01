
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketReasonService } from '../../services/ticket-reason.service';
import { TicketReason } from '../../models/ticket-reason.model';

@Component({
  selector: 'app-ticket-reason-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './ticket-reason-detail.component.html',
  styleUrl: './ticket-reason-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketReasonDetailComponent implements OnInit {
  private readonly reasonService = inject(TicketReasonService);
  private readonly route = inject(ActivatedRoute);

  reason: TicketReason | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.reason = this.reasonService.getReasonById(id);
      }
  }
}
