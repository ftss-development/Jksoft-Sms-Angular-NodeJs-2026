
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { SystemRightService } from '../../services/system-right.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDetailComponent implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly rightService = inject(SystemRightService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  role = signal<Role | undefined>(undefined);
  
  // Computed permission groups for display
  permissionGroups = computed(() => {
      const r = this.role();
      if (!r || !r.rightIds) return [];
      
      const allRights = this.rightService.rights();
      // Filter rights that are in the role
      const assignedRights = allRights.filter(right => r.rightIds.includes(right.id));
      
      // Group
      const groups = new Map<string, any[]>();
      assignedRights.forEach(right => {
          if (!groups.has(right.module)) {
              groups.set(right.module, []);
          }
          groups.get(right.module)!.push(right);
      });
      
      return Array.from(groups.keys()).sort().map(key => ({
          moduleName: key,
          rights: groups.get(key)
      }));
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          const found = this.roleService.getRoleById(id);
          this.role.set(found);
      }
  }

  onDelete(): void {
      const r = this.role();
      if (r && confirm('Are you sure you want to delete this role?')) {
          this.roleService.deleteRole(r.id);
          this.router.navigate(['/roles']);
      }
  }
}
