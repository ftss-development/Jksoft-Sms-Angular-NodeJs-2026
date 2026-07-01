
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ItemMakerService } from '../../services/item-maker.service';

@Component({
  selector: 'app-item-maker-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './item-maker-add.component.html',
  styleUrl: './item-maker-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemMakerAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly makerService = inject(ItemMakerService);
  private readonly router: Router = inject(Router);

  isSubmitting = signal(false);

  makerForm = this.fb.group({
    makerName: ['', Validators.required],
    shortName: ['', Validators.required],
    status: ['Active', Validators.required],
    description: [''],
    headquarters: [''],
    website: ['']
  });

  async onSubmit(): Promise<void> {
    if (this.makerForm.valid) {
      this.isSubmitting.set(true);
      const val = this.makerForm.getRawValue();
      try {
        await this.makerService.addMaker({
            makerName: val.makerName!,
            shortName: val.shortName!,
            status: val.status as any,
            description: val.description || '',
            headquarters: val.headquarters || '',
            website: val.website || ''
        });
        this.router.navigate(['/item-makers']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.makerForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/item-makers']);
  }
}
