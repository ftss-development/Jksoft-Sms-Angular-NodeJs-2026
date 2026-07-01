
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NoteTypeService } from '../../services/note-type.service';

@Component({
  selector: 'app-note-type-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './note-type-add.component.html',
  styleUrl: './note-type-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteTypeAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly noteTypeService = inject(NoteTypeService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  noteTypeForm = this.fb.group({
    typeName: ['', [Validators.required, Validators.maxLength(30)]],
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.noteTypeForm.valid) {
      this.isSubmitting.set(true);
      const val = this.noteTypeForm.getRawValue();
      try {
        await this.noteTypeService.addNoteType({
            typeName: val.typeName!,
            isActive: val.isActive!,
            description: '', // Default
            icon: 'description' // Default icon
        });
        this.router.navigate(['/note-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.noteTypeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/note-types']);
  }
}
