
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { SystemRightService } from '../../services/system-right.service';
import { SystemRight } from '../../models/role.model';

@Component({
  selector: 'app-system-right-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './system-right-detail.component.html',
  styleUrl: './system-right-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemRightDetailComponent implements OnInit {
  private readonly rightService = inject(SystemRightService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  systemRight: SystemRight | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.systemRight = this.rightService.getRightById(id);
      }
  }

  onDelete() {
      if (this.systemRight && confirm('Are you sure you want to delete this right?')) {
          this.rightService.deleteRight(this.systemRight.id);
          this.router.navigate(['/system-rights']);
      }
  }
}
