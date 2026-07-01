
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ParticularGroupService } from '../../services/particular-group.service';
import { ParticularService } from '../../services/particular.service';
import { Particular } from '../../models/particular.model';

@Component({
  selector: 'app-particular-group-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './particular-group-add.component.html',
  styleUrl: './particular-group-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularGroupAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly groupService = inject(ParticularGroupService);
  private readonly particularService = inject(ParticularService);
  private readonly router: Router = inject(Router);

  // Form for General Info
  groupForm = this.fb.group({
    groupName: ['', Validators.required],
    shortName: ['', Validators.required],
    isActive: [true]
  });

  // Search & Select Logic
  searchTerm = signal('');
  
  private readonly _allParticulars = this.particularService.particulars;
  assignedParticulars = signal<Particular[]>([]);

  // Filtered list of available particulars (not yet assigned) based on search
  availableParticularsFiltered = computed(() => {
    const assignedIds = new Set(this.assignedParticulars().map(p => p.id));
    const term = this.searchTerm().toLowerCase();
    
    return this._allParticulars()
      .filter(p => !assignedIds.has(p.id))
      .filter(p => p.name.toLowerCase().includes(term));
  });

  addParticular(particular: Particular): void {
    this.assignedParticulars.update(current => [...current, particular]);
  }

  removeParticular(particularId: string): void {
    this.assignedParticulars.update(current => current.filter(p => p.id !== particularId));
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const val = this.groupForm.getRawValue();
      this.groupService.addGroup({
        groupName: val.groupName!,
        shortName: val.shortName!,
        isActive: val.isActive!,
        assignedParticularIds: this.assignedParticulars().map(p => p.id)
      });
      this.router.navigate(['/particular-groups']);
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/particular-groups']);
  }
}
