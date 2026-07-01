
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeStatus } from '../../models/employee.model';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly router: Router = inject(Router);

  // List of potential managers
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
    joiningDate: [new Date().toISOString().substring(0, 10), Validators.required],
    reportingManagerId: [''],
    isActive: [true]
  });

  async onSubmit(): Promise<void> {
    if (this.employeeForm.valid) {
      this.isSubmitting.set(true);
      const val = this.employeeForm.getRawValue();
      try {
        await this.employeeService.addEmployee({
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
        });
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
