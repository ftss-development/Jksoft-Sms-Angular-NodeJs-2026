
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SubDepartmentService } from '../../services/sub-department.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-sub-department-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sub-department-add.component.html',
  styleUrl: './sub-department-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubDepartmentAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly subDeptService = inject(SubDepartmentService);
  private readonly deptService = inject(DepartmentService);
  private readonly router: Router = inject(Router);

  // Get parent departments for dropdown
  readonly departments = this.deptService.departments;
  
  isSubmitting = signal(false);

  subDeptForm = this.fb.group({
    parentDepartmentId: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(10)]],
    status: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.subDeptForm.valid) {
      this.isSubmitting.set(true);
      const val = this.subDeptForm.getRawValue();
      
      // Get name for display purposes (in a real app backend would handle join)
      const parent = this.departments().find(d => d.id === val.parentDepartmentId);

      try {
        await this.subDeptService.addSubDepartment({
            name: val.name!,
            shortName: val.shortName!,
            parentDepartmentId: val.parentDepartmentId!,
            parentDepartmentName: parent?.departmentName,
            status: val.status ? 'Active' : 'Inactive',
            region: 'Global', // Default
            companyMappings: []
        });
        this.router.navigate(['/sub-departments']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.subDeptForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/sub-departments']);
  }
}
