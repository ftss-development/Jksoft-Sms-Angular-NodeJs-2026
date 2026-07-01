
import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { RoleService } from './role.service';
import { SystemRightService } from './system-right.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly rightService = inject(SystemRightService);
  private readonly router = inject(Router);
  
  // Initialize as null to ensure no persistence across restarts
  private readonly _currentUser = signal<User | null>(null);

  // Compute the set of active right codes for the current user
  readonly userRights = computed(() => {
    const user = this._currentUser();
    if (!user) return new Set<string>();

    // Administrator Bypass
    if (user.role === 'Administrator') {
        return new Set(['*']); 
    }

    const role = this.roleService.roles().find(r => r.roleName === user.role);
    if (!role || role.status !== 'Active') return new Set<string>();

    const activeRightCodes = this.rightService.rights()
        .filter(r => role.rightIds.includes(r.id) && r.status === 'Active')
        .map(r => r.code);
    
    return new Set(activeRightCodes);
  });

  constructor() {
    // Enforce security policy: Clear any potentially lingering session data
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  get currentUser() {
    return this._currentUser.asReadonly();
  }

  isAuthenticated(): boolean {
    return !!this._currentUser();
  }

  // Check if user has a specific right
  hasRight(code: string): boolean {
    const user = this._currentUser();
    if (!user) return false;
    if (user.role === 'Administrator') return true; 

    return this.userRights().has(code);
  }

  hasRole(roleName: string): boolean {
      return this._currentUser()?.role === roleName;
  }

  async login(username: string, passwordRaw: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(passwordRaw);
    
    // Check against the users signal which is synced with Firestore
    const user = this.userService.users().find(u => 
        u.username === username && 
        u.passwordHash === passwordHash 
    );

    if (user && user.status === 'Active') {
      this.setUserSession(user);
      return true;
    }

    return false;
  }

  logout(): void {
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setUserSession(user: User): void {
      // Set in-memory session only
      this._currentUser.set(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
