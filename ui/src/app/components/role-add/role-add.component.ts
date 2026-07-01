
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { SystemRightService } from '../../services/system-right.service';
import { SystemRight } from '../../models/role.model';

@Component({
  selector: 'app-role-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly rightService = inject(SystemRightService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);
  
  // Dynamic Rights
  readonly allRights = this.rightService.rights;
  
  // Group rights by module
  readonly rightsByModule = computed(() => {
      const groups = new Map<string, SystemRight[]>();
      this.allRights().forEach(r => {
          if (!groups.has(r.module)) {
              groups.set(r.module, []);
          }
          groups.get(r.module)!.push(r);
      });
      // Sort keys
      const sortedKeys = Array.from(groups.keys()).sort();
      return sortedKeys.map(key => ({
          moduleName: key,
          rights: groups.get(key)!.sort((a,b) => a.name.localeCompare(b.name))
      }));
  });

  // Stores selected permission IDs
  selectedRightIds = signal<Set<string>>(new Set());

  roleForm = this.fb.group({
    roleName: ['', [Validators.required, Validators.maxLength(50)]],
    description: [''],
    isActive: [true, Validators.required]
  });

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
    if (this.roleForm.valid) {
      this.isSubmitting.set(true);
      const val = this.roleForm.getRawValue();
      try {
        await this.roleService.addRole({
            roleName: val.roleName!,
            description: val.description || '',
            status: val.isActive ? 'Active' : 'Inactive',
            rightIds: Array.from(this.selectedRightIds())
        });
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