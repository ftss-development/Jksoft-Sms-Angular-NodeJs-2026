
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { SubDepartmentService } from '../../services/sub-department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './department-detail.component.html',
  styleUrl: './department-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentDetailComponent implements OnInit {
  private readonly departmentService = inject(DepartmentService);
  private readonly subDeptService = inject(SubDepartmentService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  departmentId = signal<string | null>(null);

  readonly department = computed(() => {
    const id = this.departmentId();
    if (!id) return undefined;
    return this.departmentService.getDepartmentById(id);
  });

  readonly relatedSubDepartments = computed(() => {
    const id = this.departmentId();
    if (!id) return [];
    return this.subDeptService.subDepartments().filter(sd => sd.parentDepartmentId === id);
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.departmentId.set(idParam);
    }
  }
}
