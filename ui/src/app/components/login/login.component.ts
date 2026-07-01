
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly authService = inject(AuthService);

  showPassword = signal(false);
  errorMessage = signal('');
  isSubmitting = signal(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set('');
      
      const { username, password } = this.loginForm.getRawValue();
      
      try {
        const success = await this.authService.login(username!, password!);
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Invalid username or password.');
        }
      } catch (err) {
        this.errorMessage.set('An error occurred during login.');
        console.error(err);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
