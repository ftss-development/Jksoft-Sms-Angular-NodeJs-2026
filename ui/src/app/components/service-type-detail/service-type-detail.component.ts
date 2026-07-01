
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ServiceTypeService } from '../../services/service-type.service';
import { ServiceType } from '../../models/service-type.model';

@Component({
  selector: 'app-service-type-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './service-type-detail.component.html',
  styleUrl: './service-type-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceTypeDetailComponent implements OnInit {
  private readonly serviceService = inject(ServiceTypeService);
  private readonly route = inject(ActivatedRoute);

  serviceType: ServiceType | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.serviceType = this.serviceService.getServiceTypeById(id);
      }
  }
}
