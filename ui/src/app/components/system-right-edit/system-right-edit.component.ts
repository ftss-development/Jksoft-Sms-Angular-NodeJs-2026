
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SystemRightService } from '../../services/system-right.service';
import { SystemRight } from '../../models/role.model';

@Component({
  selector: 'app-system-right-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './system-right-edit.component.html',
  styleUrl: './system-right-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemRightEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly rightService = inject(SystemRightService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  rightId: string | undefined;
  systemRight: SystemRight | undefined;
  isSubmitting = signal(false);

  // Suggest some modules
  modules = ['User Management', 'Finance', 'Inventory', 'CRM', 'HR', 'System Config', 'Reporting', 'Security'];

  rightForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    module: ['', Validators.required],
    code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]],
    description: ['', Validators.required],
    isActive: [false, Validators.required]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.rightId = id;
          this.systemRight = this.rightService.getRightById(id);
          if (this.systemRight) {
              this.rightForm.patchValue({
                  name: this.systemRight.name,
                  module: this.systemRight.module,
                  code: this.systemRight.code,
                  description: this.systemRight.description,
                  isActive: this.systemRight.status === 'Active'
              });
          } else {
              this.router.navigate(['/system-rights']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.rightForm.valid && this.systemRight) {
      this.isSubmitting.set(true);
      const val = this.rightForm.getRawValue();
      
      const updatedRight: SystemRight = {
          ...this.systemRight,
          name: val.name!,
          module: val.module!,
          code: val.code!,
          description: val.description!,
          status: val.isActive ? 'Active' : 'Inactive'
      };

      try {
        await this.rightService.updateRight(updatedRight);
        this.router.navigate(['/system-rights']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.rightForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/system-rights']);
  }
}
