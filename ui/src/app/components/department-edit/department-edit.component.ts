
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-department-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  departmentId: string | undefined;
  department: Department | undefined;
  isSubmitting = signal(false);

  departmentForm = this.fb.group({
    departmentName: ['', Validators.required],
    shortName: ['', Validators.required],
    headOfDepartment: [''],
    location: [''],
    budgetCode: [''],
    description: [''],
    isActive: [false]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.departmentId = idParam;
      this.department = this.departmentService.getDepartmentById(this.departmentId);
      if (this.department) {
        this.departmentForm.patchValue({
          departmentName: this.department.departmentName,
          shortName: this.department.shortName,
          headOfDepartment: this.department.headOfDepartment,
          location: this.department.location,
          budgetCode: this.department.budgetCode,
          description: this.department.description,
          isActive: this.department.status === 'Active'
        });
      } else {
        this.router.navigate(['/departments']);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.departmentForm.valid && this.department) {
      this.isSubmitting.set(true);
      const val = this.departmentForm.getRawValue();
      
      const updatedDepartment: Department = {
        ...this.department,
        departmentName: val.departmentName!,
        shortName: val.shortName!,
        headOfDepartment: val.headOfDepartment || undefined,
        location: val.location || undefined,
        budgetCode: val.budgetCode || undefined,
        description: val.description || undefined,
        status: val.isActive ? 'Active' : 'Inactive',
        updatedBy: 'System Admin',
        lastUpdated: new Date()
      };

      try {
        await this.departmentService.updateDepartment(updatedDepartment);
        this.router.navigate(['/departments']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.departmentForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/departments']);
  }
}
