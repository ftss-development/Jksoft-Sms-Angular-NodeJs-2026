
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DesignationService } from '../../services/designation.service';
import { Designation } from '../../models/designation.model';

@Component({
  selector: 'app-designation-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './designation-edit.component.html',
  styleUrl: './designation-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignationEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly designationService = inject(DesignationService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  designationId: string | undefined;
  designation: Designation | undefined;
  isSubmitting = signal(false);

  designationForm = this.fb.group({
    name: ['', Validators.required],
    shortCode: ['', Validators.required],
    level: ['', Validators.required],
    departmentName: [''],
    responsibilities: [''],
    isActive: [false]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.designationId = id;
        this.designation = this.designationService.getDesignationById(id);
        if (this.designation) {
            this.designationForm.patchValue({
                name: this.designation.name,
                shortCode: this.designation.shortCode,
                level: this.designation.level,
                departmentName: this.designation.departmentName,
                responsibilities: this.designation.responsibilities,
                isActive: this.designation.status === 'Active'
            });
        } else {
            this.router.navigate(['/designations']);
        }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.designationForm.valid && this.designation) {
      this.isSubmitting.set(true);
      const val = this.designationForm.getRawValue();
      
      const updatedDesignation: Designation = {
          ...this.designation,
          name: val.name!,
          shortCode: val.shortCode!,
          level: val.level!,
          departmentName: val.departmentName || undefined,
          responsibilities: val.responsibilities || undefined,
          status: val.isActive ? 'Active' : 'Inactive'
      };

      try {
        await this.designationService.updateDesignation(updatedDesignation);
        this.router.navigate(['/designations']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/designations']);
  }
}
