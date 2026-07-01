
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ParticularTypeService } from '../../services/particular-type.service';
import { ParticularType } from '../../models/particular-type.model';

@Component({
  selector: 'app-particular-type-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './particular-type-edit.component.html',
  styleUrl: './particular-type-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularTypeEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly ptService = inject(ParticularTypeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  pt: ParticularType | undefined;
  isSubmitting = signal(false);

  typeForm = this.fb.group({
    typeName: ['', Validators.required],
    description: [''],
    isActive: [false],
    category: [''],
    defaultGlGroup: [''],
    taxEligibility: ['']
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.pt = this.ptService.getParticularTypeById(id);
          if (this.pt) {
              this.typeForm.patchValue({
                  typeName: this.pt.typeName,
                  description: this.pt.description,
                  isActive: this.pt.status === 'Active' || this.pt.status === 'Production Active',
                  category: this.pt.category,
                  defaultGlGroup: this.pt.defaultGlGroup,
                  taxEligibility: this.pt.taxEligibility
              });
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.typeForm.valid && this.pt) {
      this.isSubmitting.set(true);
      const val = this.typeForm.getRawValue();
      const updated: ParticularType = {
          ...this.pt,
          typeName: val.typeName!,
          description: val.description || '',
          status: val.isActive ? 'Active' : 'Inactive',
          category: val.category || '',
          defaultGlGroup: val.defaultGlGroup || '',
          taxEligibility: val.taxEligibility || ''
      };

      try {
        await this.ptService.updateParticularType(updated);
        this.router.navigate(['/particular-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/particular-types']);
  }
}
