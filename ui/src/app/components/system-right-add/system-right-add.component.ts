
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SystemRightService } from '../../services/system-right.service';

@Component({
  selector: 'app-system-right-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './system-right-add.component.html',
  styleUrl: './system-right-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemRightAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly rightService = inject(SystemRightService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);
  
  // Suggest some modules
  modules = ['User Management', 'Finance', 'Inventory', 'CRM', 'HR', 'System Config', 'Reporting', 'Security'];

  rightForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    module: ['', Validators.required],
    code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]],
    description: ['', Validators.required],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.rightForm.valid) {
      this.isSubmitting.set(true);
      const val = this.rightForm.getRawValue();
      try {
        await this.rightService.addRight({
            name: val.name!,
            code: val.code!,
            module: val.module!,
            description: val.description!,
            status: val.isActive ? 'Active' : 'Inactive'
        });
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
