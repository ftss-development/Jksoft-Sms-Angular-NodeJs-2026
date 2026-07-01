
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { StatusService } from '../../services/status.service';
import { StatusType } from '../../models/status.model';

@Component({
  selector: 'app-status-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './status-detail.component.html',
  styleUrl: './status-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusDetailComponent implements OnInit {
  private readonly statusService = inject(StatusService);
  private readonly route = inject(ActivatedRoute);

  status: StatusType | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.status = this.statusService.getStatusById(id);
      }
  }
}
