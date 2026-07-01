
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParticularService } from '../../services/particular.service';
import { ParticularTypeService } from '../../services/particular-type.service';
import { NoteTypeService } from '../../services/note-type.service';
import { Particular } from '../../models/particular.model';

@Component({
  selector: 'app-particular-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './particular-edit.component.html',
  styleUrl: './particular-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly particularService = inject(ParticularService);
  private readonly particularTypeService = inject(ParticularTypeService);
  private readonly noteTypeService = inject(NoteTypeService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  particularId: string | undefined;
  particular: Particular | undefined;

  // Dynamic Lists
  readonly particularTypes = this.particularTypeService.particularTypes;
  readonly noteTypes = this.noteTypeService.noteTypes;

  particularForm = this.fb.group({
    name: ['', Validators.required],
    shortName: ['', Validators.required],
    value: ['', Validators.required],
    particularType: ['', Validators.required],
    noteType: ['', Validators.required],
    startDate: ['', Validators.required],
    status: [false],
    isActive: [false]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.particularId = idParam;
      this.particular = this.particularService.getParticularById(this.particularId);
      if (this.particular) {
        this.particularForm.patchValue({
          name: this.particular.name,
          shortName: this.particular.shortName,
          value: this.particular.value,
          particularType: this.particular.particularType,
          noteType: this.particular.noteType,
          startDate: this.particular.startDate ? new Date(this.particular.startDate).toISOString().substring(0, 10) : '',
          status: this.particular.status,
          isActive: this.particular.isActive
        });
      } else {
        this.router.navigate(['/particulars']);
      }
    }
  }

  onSubmit(): void {
    if (this.particularForm.valid && this.particular) {
      const val = this.particularForm.getRawValue();
      const updatedParticular: Particular = {
        ...this.particular,
        name: val.name!,
        shortName: val.shortName!,
        value: val.value!,
        particularType: val.particularType!,
        noteType: val.noteType!,
        startDate: new Date(val.startDate!),
        status: val.status!,
        isActive: val.isActive!
      };
      this.particularService.updateParticular(updatedParticular);
      this.router.navigate(['/particulars']);
    } else {
      this.particularForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/particulars']);
  }
}
