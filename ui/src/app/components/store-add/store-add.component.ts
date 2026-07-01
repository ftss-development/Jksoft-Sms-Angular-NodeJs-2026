
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-store-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './store-add.component.html',
  styleUrl: './store-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreAddComponent {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly storeService = inject(StoreService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);

  storeForm = this.fb.group({
    storeName: ['', [Validators.required, Validators.maxLength(50)]],
    location: ['', [Validators.required]], // Added to match list/detail data needs
    isActive: [true, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.storeForm.valid) {
      this.isSubmitting.set(true);
      const val = this.storeForm.getRawValue();
      try {
        await this.storeService.addStore({
            storeName: val.storeName!,
            location: val.location!,
            status: val.isActive ? 'Active' : 'Inactive',
            description: ''
        });
        this.router.navigate(['/stores']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      this.storeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/stores']);
  }
}
