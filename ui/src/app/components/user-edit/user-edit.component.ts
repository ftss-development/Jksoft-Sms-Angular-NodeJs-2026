
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserRole, UserSession } from '../../models/user.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  userId: string | undefined;
  user: User | undefined;
  sessions: UserSession[] = [];

  activeTab = signal<'profile' | 'security'>('profile');
  isSubmitting = signal(false);
  showPassword = signal(false);

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    role: ['User' as UserRole, Validators.required],
    isActive: [true],
    
    // Security fields
    forcePasswordChange: [false],
    twoFactorEnabled: [false],
    password: [''],
    confirmPassword: ['']
  });
  
  // Date helpers for session list
  readonly dateNow = signal(new Date());
  readonly yesterday = signal(new Date(new Date().setDate(new Date().getDate() - 1)));

  ngOnInit(): void {
    this.refreshUser();
  }

  refreshUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.userId = id;
        this.user = this.userService.getUserById(id);
        if (this.user) {
            this.sessions = this.user.sessions || [];
            
            // Patch form
            this.userForm.patchValue({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.user.email,
                username: this.user.username,
                role: this.user.role,
                isActive: this.user.status === 'Active',
                forcePasswordChange: this.user.forcePasswordChange || false,
                twoFactorEnabled: this.user.twoFactorEnabled || false
            });
        } else {
            this.router.navigate(['/users']);
        }
    }
  }

  setActiveTab(tab: 'profile' | 'security'): void {
    this.activeTab.set(tab);
  }

  togglePasswordVisibility() {
      this.showPassword.update(v => !v);
  }

  revokeSession(sessionId: string) {
      if (this.userId && confirm('Are you sure you want to revoke this session?')) {
          this.userService.revokeSession(this.userId, sessionId);
          this.refreshUser();
      }
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.valid && this.user) {
      this.isSubmitting.set(true);
      const val = this.userForm.getRawValue();
      
      let newHash = this.user.passwordHash;

      // Calculate new hash if password field is filled
      if (val.password && val.password.trim() !== '') {
          newHash = await this.userService.hashPassword(val.password);
      }

      const updatedUser: User = {
          ...this.user,
          firstName: val.firstName!,
          lastName: val.lastName!,
          email: val.email!,
          username: val.username!,
          role: val.role as UserRole,
          status: val.isActive ? 'Active' : 'Inactive',
          // Security
          forcePasswordChange: val.forcePasswordChange || false,
          twoFactorEnabled: val.twoFactorEnabled || false,
          passwordHash: newHash, // Persist the new hash or keep the old one
          // Metadata
          updatedBy: 'System Admin',
          lastUpdated: new Date()
      };
      
      try {
        await this.userService.updateUser(updatedUser);
        this.router.navigate(['/users']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
