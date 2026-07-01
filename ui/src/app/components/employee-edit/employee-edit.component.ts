
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  employeeId: string | undefined;
  employee: Employee | undefined;
  readonly employees = this.employeeService.employees;

  isSubmitting = signal(false);

  employeeForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    employeeCode: ['', Validators.required],
    jobTitle: ['', Validators.required],
    level: ['', Validators.required],
    department: ['', Validators.required],
    workLocation: ['', Validators.required],
    joiningDate: ['', Validators.required],
    reportingManagerId: [''],
    isActive: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.employeeId = idParam;
      this.employee = this.employeeService.getEmployeeById(this.employeeId);
      if (this.employee) {
        this.employeeForm.patchValue({
          firstName: this.employee.firstName,
          lastName: this.employee.lastName,
          email: this.employee.email,
          employeeCode: this.employee.employeeCode,
          jobTitle: this.employee.jobTitle,
          level: this.employee.level,
          department: this.employee.department,
          workLocation: this.employee.workLocation,
          joiningDate: this.employee.joiningDate ? new Date(this.employee.joiningDate).toISOString().substring(0, 10) : '',
          reportingManagerId: this.employee.reportingManagerId,
          isActive: this.employee.isActive
        });
      } else {
        this.router.navigate(['/employees']);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.valid && this.employee) {
      this.isSubmitting.set(true);
      const val = this.employeeForm.getRawValue();
      
      const updatedEmployee: Employee = {
        ...this.employee,
        firstName: val.firstName!,
        lastName: val.lastName!,
        email: val.email!,
        employeeCode: val.employeeCode!,
        jobTitle: val.jobTitle!,
        level: val.level!,
        department: val.department!,
        workLocation: val.workLocation!,
        joiningDate: new Date(val.joiningDate!),
        reportingManagerId: val.reportingManagerId || undefined,
        status: val.isActive ? 'Active' : 'Inactive',
        isActive: val.isActive!
      };

      try {
        await this.employeeService.updateEmployee(updatedEmployee);
        this.router.navigate(['/employees']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
