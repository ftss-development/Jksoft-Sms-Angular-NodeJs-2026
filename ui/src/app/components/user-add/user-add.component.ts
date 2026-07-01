
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRole, UserStatus } from '../../models/user.model';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router: Router = inject(Router);

  isSubmitting = signal(false);
  showPassword = signal(false);
  activeTab = signal<'profile' | 'security'>('profile');

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    role: ['User' as UserRole, Validators.required],
    department: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    forcePasswordChange: [true] // Default to force change on creation
  });

  togglePasswordVisibility() {
      this.showPassword.update(v => !v);
  }

  setActiveTab(tab: 'profile' | 'security'): void {
    this.activeTab.set(tab);
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.valid) {
      this.isSubmitting.set(true);
      const val = this.userForm.getRawValue();
      
      try {
        await this.userService.addUser({
            firstName: val.firstName!,
            lastName: val.lastName!,
            email: val.email!,
            username: val.username!,
            role: val.role as UserRole,
            status: 'Active', 
            department: val.department!,
            jobTitle: 'New User',
            location: 'Remote',
            twoFactorEnabled: false,
            forcePasswordChange: val.forcePasswordChange!
        });
        this.router.navigate(['/users']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.userForm.markAllAsTouched();
      // If validation fails, maybe switch to the tab with errors?
      // For simplicity, just mark touched.
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
