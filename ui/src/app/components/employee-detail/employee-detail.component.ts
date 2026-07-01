
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  employee: Employee | undefined;
  manager: Employee | undefined;
  directReports: Employee[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
            this.employee = this.employeeService.getEmployeeById(id);
            if (this.employee) {
                if (this.employee.reportingManagerId) {
                    this.manager = this.employeeService.getEmployeeById(this.employee.reportingManagerId);
                }
                this.directReports = this.employeeService.getDirectReports(this.employee.id);
            }
        }
    });
  }
}
