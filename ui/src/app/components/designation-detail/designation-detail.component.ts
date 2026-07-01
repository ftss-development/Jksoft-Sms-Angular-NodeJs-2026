
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DesignationService } from '../../services/designation.service';
import { Designation } from '../../models/designation.model';

@Component({
  selector: 'app-designation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './designation-detail.component.html',
  styleUrl: './designation-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignationDetailComponent implements OnInit {
  private readonly designationService = inject(DesignationService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  designation: Designation | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.designation = this.designationService.getDesignationById(id);
      }
  }
}
