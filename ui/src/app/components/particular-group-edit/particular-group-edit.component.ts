
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParticularGroupService } from '../../services/particular-group.service';
import { ParticularService } from '../../services/particular.service';
import { ParticularGroup } from '../../models/particular-group.model';
import { Particular } from '../../models/particular.model';

@Component({
  selector: 'app-particular-group-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './particular-group-edit.component.html',
  styleUrl: './particular-group-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularGroupEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly groupService = inject(ParticularGroupService);
  private readonly particularService = inject(ParticularService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  group: ParticularGroup | undefined;

  groupForm = this.fb.group({
    groupName: ['', Validators.required],
    shortName: ['', Validators.required],
    isActive: [false]
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

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.group = this.groupService.getGroupById(+idParam);
      if (this.group) {
        this.groupForm.patchValue({
          groupName: this.group.groupName,
          shortName: this.group.shortName,
          isActive: this.group.isActive
        });

        // Initialize assigned particulars based on IDs
        const assigned = this._allParticulars().filter(p => this.group!.assignedParticularIds.includes(p.id));
        this.assignedParticulars.set(assigned);
      } else {
        this.router.navigate(['/particular-groups']);
      }
    }
  }

  addParticular(particular: Particular): void {
    this.assignedParticulars.update(current => [...current, particular]);
    // Optional: Clear search after adding
    // this.searchTerm.set(''); 
  }

  removeParticular(particularId: string): void {
    this.assignedParticulars.update(current => current.filter(p => p.id !== particularId));
  }

  onSubmit(): void {
    if (this.groupForm.valid && this.group) {
      const val = this.groupForm.getRawValue();
      const updatedGroup: ParticularGroup = {
        ...this.group,
        groupName: val.groupName!,
        shortName: val.shortName!,
        isActive: val.isActive!,
        assignedParticularIds: this.assignedParticulars().map(p => p.id)
      };
      this.groupService.updateGroup(updatedGroup);
      this.router.navigate(['/particular-groups']);
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/particular-groups']);
  }
}
