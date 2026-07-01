
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ParticularService } from '../../services/particular.service';
import { ParticularTypeService } from '../../services/particular-type.service';
import { NoteTypeService } from '../../services/note-type.service';

@Component({
  selector: 'app-particular-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './particular-add.component.html',
  styleUrl: './particular-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly particularService = inject(ParticularService);
  private readonly particularTypeService = inject(ParticularTypeService);
  private readonly noteTypeService = inject(NoteTypeService);
  private readonly router: Router = inject(Router);

  // Dynamic Data Sources
  readonly particularTypes = this.particularTypeService.particularTypes;
  readonly noteTypes = this.noteTypeService.noteTypes;

  particularForm = this.fb.group({
    name: ['', Validators.required],
    shortName: ['', Validators.required],
    value: ['', Validators.required],
    particularType: ['', Validators.required], // Stores Name
    noteType: ['', Validators.required],       // Stores Name
    startDate: [new Date().toISOString().substring(0, 10), Validators.required],
    status: [true], // Enable
    isActive: [true] // Active
  });

  onSubmit(): void {
    if (this.particularForm.valid) {
      const val = this.particularForm.getRawValue();
      this.particularService.addParticular({
        name: val.name!,
        shortName: val.shortName!,
        value: val.value!,
        particularType: val.particularType!,
        noteType: val.noteType!,
        startDate: new Date(val.startDate!),
        status: val.status!,
        isActive: val.isActive!
      });
      this.router.navigate(['/particulars']);
    } else {
      this.particularForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/particulars']);
  }
}
