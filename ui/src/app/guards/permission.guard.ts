
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If not authenticated, let AuthGuard handle it or redirect
  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  // 1. Check for specific Right requirement
  const requiredRight = route.data['right'] as string;
  if (requiredRight) {
      if (!authService.hasRight(requiredRight)) {
          // User lacks the specific right
          console.warn(`Access denied. Missing right: ${requiredRight}`);
          return router.parseUrl('/dashboard'); // Or an unauthorized page
      }
  }

  // 2. Check for specific Role requirement (optional usage)
  const requiredRoles = route.data['roles'] as string[];
  if (requiredRoles && requiredRoles.length > 0) {
      const userRole = authService.currentUser()?.role;
      if (!userRole || !requiredRoles.includes(userRole)) {
          console.warn(`Access denied. Role ${userRole} not in [${requiredRoles}]`);
          return router.parseUrl('/dashboard');
      }
  }

  return true;
};
