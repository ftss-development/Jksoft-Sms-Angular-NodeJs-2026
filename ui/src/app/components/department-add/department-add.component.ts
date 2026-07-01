
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { DepartmentStatus } from '../../models/department.model';

@Component({
  selector: 'app-department-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './department-add.component.html',
  styleUrl: './department-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly router: Router = inject(Router);

  isSubmitting = signal(false);

  departmentForm = this.fb.group({
    departmentName: ['', Validators.required],
    shortName: ['', Validators.required],
    headOfDepartment: [''],
    location: [''],
    budgetCode: [''],
    description: [''],
    isActive: [true]
  });

  async onSubmit(): Promise<void> {
    if (this.departmentForm.valid) {
      this.isSubmitting.set(true);
      const val = this.departmentForm.getRawValue();
      try {
        await this.departmentService.addDepartment({
            departmentName: val.departmentName!,
            shortName: val.shortName!,
            headOfDepartment: val.headOfDepartment || '',
            location: val.location || '',
            budgetCode: val.budgetCode || '',
            description: val.description || '',
            status: val.isActive ? 'Active' : 'Inactive'
        });
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
