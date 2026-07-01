
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SubDepartmentService } from '../../services/sub-department.service';
import { DepartmentService } from '../../services/department.service';
import { SubDepartment } from '../../models/sub-department.model';

@Component({
  selector: 'app-sub-department-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sub-department-edit.component.html',
  styleUrl: './sub-department-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubDepartmentEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly subDeptService = inject(SubDepartmentService);
  private readonly deptService = inject(DepartmentService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly departments = this.deptService.departments;
  
  subDept: SubDepartment | undefined;
  isSubmitting = signal(false);

  subDeptForm = this.fb.group({
    parentDepartmentId: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    shortName: ['', [Validators.required, Validators.maxLength(10)]],
    // Read-only / disabled in template potentially, but good to have
    status: [true, Validators.required]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.subDept = this.subDeptService.getSubDepartmentById(id);
          if (this.subDept) {
              this.subDeptForm.patchValue({
                  parentDepartmentId: this.subDept.parentDepartmentId,
                  name: this.subDept.name,
                  shortName: this.subDept.shortName,
                  status: this.subDept.status === 'Active'
              });
          } else {
              this.router.navigate(['/sub-departments']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.subDeptForm.valid && this.subDept) {
      this.isSubmitting.set(true);
      const val = this.subDeptForm.getRawValue();
      const parent = this.departments().find(d => d.id === val.parentDepartmentId);

      const updatedSub: SubDepartment = {
          ...this.subDept,
          name: val.name!,
          shortName: val.shortName!,
          parentDepartmentId: val.parentDepartmentId!,
          parentDepartmentName: parent?.departmentName,
          status: val.status ? 'Active' : 'Inactive'
      };

      try {
        await this.subDeptService.updateSubDepartment(updatedSub);
        this.router.navigate(['/sub-departments']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/sub-departments']);
  }
}
