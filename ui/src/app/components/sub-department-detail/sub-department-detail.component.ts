
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SubDepartmentService } from '../../services/sub-department.service';
import { SubDepartment } from '../../models/sub-department.model';

@Component({
  selector: 'app-sub-department-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './sub-department-detail.component.html',
  styleUrl: './sub-department-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubDepartmentDetailComponent implements OnInit {
  private readonly subDeptService = inject(SubDepartmentService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  subDept: SubDepartment | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.subDept = this.subDeptService.getSubDepartmentById(id);
      }
  }
}
