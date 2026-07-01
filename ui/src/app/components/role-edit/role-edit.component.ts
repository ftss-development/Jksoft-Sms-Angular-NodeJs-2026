
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { SystemRightService } from '../../services/system-right.service';
import { Role, SystemRight } from '../../models/role.model';

@Component({
  selector: 'app-role-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly rightService = inject(SystemRightService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  roleId: string | undefined;
  role: Role | undefined;
  isSubmitting = signal(false);
  
  // Dynamic Rights Logic
  readonly allRights = this.rightService.rights;
  
  // Group rights by module for the matrix display
  readonly rightsByModule = computed(() => {
      const groups = new Map<string, SystemRight[]>();
      this.allRights().forEach(r => {
          if (!groups.has(r.module)) {
              groups.set(r.module, []);
          }
          groups.get(r.module)!.push(r);
      });
      const sortedKeys = Array.from(groups.keys()).sort();
      return sortedKeys.map(key => ({
          moduleName: key,
          rights: groups.get(key)!.sort((a,b) => a.name.localeCompare(b.name))
      }));
  });
  
  // Track selected permissions
  selectedRightIds = signal<Set<string>>(new Set());

  roleForm = this.fb.group({
    roleName: ['', [Validators.required, Validators.maxLength(50)]],
    description: [''],
    isActive: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.roleId = id;
          this.role = this.roleService.getRoleById(id);
          if (this.role) {
              this.roleForm.patchValue({
                  roleName: this.role.roleName,
                  description: this.role.description,
                  isActive: this.role.status === 'Active'
              });
              
              // Load existing permissions
              this.selectedRightIds.set(new Set(this.role.rightIds || []));
          } else {
              this.router.navigate(['/roles']);
          }
      }
  }

  toggleRight(rightId: string) {
    const current = new Set(this.selectedRightIds());
    if (current.has(rightId)) {
      current.delete(rightId);
    } else {
      current.add(rightId);
    }
    this.selectedRightIds.set(current);
  }

  isRightSelected(rightId: string): boolean {
    return this.selectedRightIds().has(rightId);
  }

  toggleAllInModule(moduleRights: SystemRight[]) {
    const current = new Set(this.selectedRightIds());
    const allIds = moduleRights.map(r => r.id);
    const allSelected = allIds.every(id => current.has(id));

    if (allSelected) {
      allIds.forEach(id => current.delete(id));
    } else {
      allIds.forEach(id => current.add(id));
    }
    this.selectedRightIds.set(current);
  }

  isModuleFullySelected(moduleRights: SystemRight[]): boolean {
      if (moduleRights.length === 0) return false;
      return moduleRights.every(r => this.selectedRightIds().has(r.id));
  }

  async onSubmit(): Promise<void> {
    if (this.roleForm.valid && this.role) {
      this.isSubmitting.set(true);
      const val = this.roleForm.getRawValue();
      
      const updatedRole: Role = {
          ...this.role,
          roleName: val.roleName!,
          description: val.description || '',
          status: val.isActive ? 'Active' : 'Inactive',
          rightIds: Array.from(this.selectedRightIds()),
          updatedBy: 'System Admin',
          lastUpdated: new Date()
      };

      try {
        await this.roleService.updateRole(updatedRole);
        this.router.navigate(['/roles']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
        this.roleForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/roles']);
  }
}
