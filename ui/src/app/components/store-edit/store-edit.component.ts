
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-store-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './store-edit.component.html',
  styleUrl: './store-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreEditComponent implements OnInit {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly storeService = inject(StoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  storeId: string | undefined;
  store: Store | undefined;
  isSubmitting = signal(false);

  storeForm = this.fb.group({
    storeName: ['', [Validators.required, Validators.maxLength(50)]],
    location: ['', Validators.required],
    description: [''],
    isActive: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.storeId = id;
          this.store = this.storeService.getStoreById(id);
          if (this.store) {
              this.storeForm.patchValue({
                  storeName: this.store.storeName,
                  location: this.store.location,
                  description: this.store.description,
                  isActive: this.store.status === 'Active'
              });
          } else {
              this.router.navigate(['/stores']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.storeForm.valid && this.store) {
      this.isSubmitting.set(true);
      const val = this.storeForm.getRawValue();
      
      const updatedStore: Store = {
          ...this.store,
          storeName: val.storeName!,
          location: val.location!,
          description: val.description || '',
          status: val.isActive ? 'Active' : 'Inactive'
      };

      try {
        await this.storeService.updateStore(updatedStore);
        this.router.navigate(['/stores']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onDelete(): void {
      if (this.store && confirm('Are you sure you want to delete this store?')) {
          this.storeService.deleteStore(this.store.id);
          this.router.navigate(['/stores']);
      }
  }

  onCancel(): void {
    this.router.navigate(['/stores']);
  }
}
