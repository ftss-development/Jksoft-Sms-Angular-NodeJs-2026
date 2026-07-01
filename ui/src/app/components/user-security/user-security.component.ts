
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserSession } from '../../models/user.model';

@Component({
  selector: 'app-user-security',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './user-security.component.html',
  styleUrl: './user-security.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSecurityComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  userId = signal<string | null>(null);

  // Reactively find the user from the service state
  user = computed(() => {
    const id = this.userId();
    const users = this.userService.users();
    if (!id || users.length === 0) return undefined;
    return users.find(u => u.id === id);
  });

  forcePasswordChange = signal(false);

  // Helpers for template date logic
  readonly dateNow = signal(new Date());
  readonly yesterday = signal(new Date(new Date().setDate(new Date().getDate() - 1)));

  constructor() {
    // Sync local state when user data becomes available
    effect(() => {
      const u = this.user();
      if (u) {
        this.forcePasswordChange.set(u.forcePasswordChange || false);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId.set(id);
  }

  toggleForcePasswordChange() {
      this.forcePasswordChange.update(v => !v);
  }

  revokeSession(sessionId: string) {
      const currentUser = this.user();
      if (currentUser && confirm('Are you sure you want to revoke this session?')) {
          this.userService.revokeSession(currentUser.id, sessionId);
      }
  }

  revokeAllSessions() {
      const currentUser = this.user();
      if (currentUser && confirm('This will sign the user out of all devices. Continue?')) {
          this.userService.revokeAllSessions(currentUser.id);
      }
  }

  saveChanges() {
      const currentUser = this.user();
      if (currentUser) {
          const updatedUser = {
              ...currentUser,
              forcePasswordChange: this.forcePasswordChange(),
              lastUpdated: new Date()
          };
          this.userService.updateUser(updatedUser);
          alert('Security settings updated successfully.');
      }
  }
}
