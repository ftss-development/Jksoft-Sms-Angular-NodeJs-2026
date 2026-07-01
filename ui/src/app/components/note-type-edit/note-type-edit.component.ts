
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoteTypeService } from '../../services/note-type.service';
import { NoteType } from '../../models/note-type.model';

@Component({
  selector: 'app-note-type-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './note-type-edit.component.html',
  styleUrl: './note-type-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteTypeEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly noteTypeService = inject(NoteTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  noteTypeId: string | undefined;
  noteType: NoteType | undefined;
  isSubmitting = signal(false);

  noteTypeForm = this.fb.group({
    typeName: ['', Validators.required],
    description: [''],
    isActive: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.noteTypeId = id;
          this.noteType = this.noteTypeService.getNoteTypeById(id);
          if (this.noteType) {
              this.noteTypeForm.patchValue({
                  typeName: this.noteType.typeName,
                  description: this.noteType.description,
                  isActive: this.noteType.isActive
              });
          } else {
              this.router.navigate(['/note-types']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.noteTypeForm.valid && this.noteType) {
      this.isSubmitting.set(true);
      const val = this.noteTypeForm.getRawValue();
      
      const updatedType: NoteType = {
          ...this.noteType,
          typeName: val.typeName!,
          description: val.description || '',
          isActive: val.isActive!
      };

      try {
        await this.noteTypeService.updateNoteType(updatedType);
        this.router.navigate(['/note-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/note-types']);
  }
}
