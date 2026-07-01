
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, LoginLog, UserSession } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  user: User | undefined;
  recentActivity: LoginLog[] = [];
  sessions: UserSession[] = [];
  
  activeTab = signal<'profile' | 'security'>('profile');
  
  // Helpers for template date logic
  readonly dateNow = signal(new Date());
  readonly yesterday = signal(new Date(new Date().setDate(new Date().getDate() - 1)));

  ngOnInit(): void {
    this.refreshUser();
  }
  
  refreshUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        // Re-fetch user from service to get latest state (e.g. after revoking session)
        // Note: In a real app with observables/signals this might be automatic.
        // Here we rely on the service's current state.
        const freshUser = this.userService.getUserById(id);
        if (freshUser) {
            this.user = freshUser;
            this.recentActivity = this.user.recentActivity || [];
            this.sessions = this.user.sessions || [];
        }
    }
  }

  getInitials(firstName: string, lastName: string): string {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  setActiveTab(tab: 'profile' | 'security'): void {
      this.activeTab.set(tab);
  }

  revokeSession(sessionId: string) {
      if (this.user && confirm('Are you sure you want to revoke this session?')) {
          this.userService.revokeSession(this.user.id, sessionId);
          this.refreshUser();
      }
  }

  revokeAllSessions() {
      if (this.user && confirm('This will sign the user out of all devices. Continue?')) {
          this.userService.revokeAllSessions(this.user.id);
          this.refreshUser();
      }
  }
}
