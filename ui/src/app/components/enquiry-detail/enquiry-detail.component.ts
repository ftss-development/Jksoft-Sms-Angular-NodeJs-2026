
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EnquiryService } from '../../services/enquiry.service';
import { Enquiry, EnquiryStatus } from '../../models/enquiry.model';

@Component({
  selector: 'app-enquiry-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './enquiry-detail.component.html',
  styleUrl: './enquiry-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryDetailComponent implements OnInit {
  private readonly enquiryService = inject(EnquiryService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  enquiry: Enquiry | undefined;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.enquiry = this.enquiryService.getEnquiryById(+idParam);
    }
  }

  getStatusColor(status: EnquiryStatus): string {
    switch (status) {
      case 'New':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
