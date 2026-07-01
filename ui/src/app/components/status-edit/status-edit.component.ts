
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatusService } from '../../services/status.service';
import { StatusType } from '../../models/status.model';

@Component({
  selector: 'app-status-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './status-edit.component.html',
  styleUrl: './status-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusEditComponent implements OnInit {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly statusService = inject(StatusService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  statusId: string | undefined;
  status: StatusType | undefined;
  isSubmitting = signal(false);

  // Mock icons
  readonly icons = ['check_circle', 'cancel', 'pending', 'pause_circle', 'lock', 'edit', 'delete', 'verified', 'error', 'hourglass_empty', 'sync', 'add_circle'];

  statusForm = this.fb.group({
    statusName: ['', Validators.required],
    internalCode: ['', Validators.required],
    statusType: ['', Validators.required],
    statusFor: ['', Validators.required],
    description: [''],
    isActive: [false],
    isLocked: [false],
    displayColor: ['#3B82F6'],
    displayIcon: ['check_circle']
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.statusId = id;
          this.status = this.statusService.getStatusById(id);
          if (this.status) {
              this.statusForm.patchValue({
                  statusName: this.status.statusName,
                  internalCode: this.status.internalCode,
                  statusType: this.status.statusType,
                  statusFor: this.status.statusFor,
                  description: this.status.description,
                  isActive: this.status.isActive,
                  isLocked: this.status.isLocked,
                  displayColor: this.status.displayColor,
                  displayIcon: this.status.displayIcon
              });
          } else {
              this.router.navigate(['/statuses']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.statusForm.valid && this.status) {
      this.isSubmitting.set(true);
      const val = this.statusForm.getRawValue();
      
      const updatedStatus: StatusType = {
          ...this.status,
          statusName: val.statusName!,
          internalCode: val.internalCode!,
          statusType: val.statusType!,
          statusFor: val.statusFor!,
          description: val.description || '',
          isActive: val.isActive!,
          isLocked: val.isLocked!,
          displayColor: val.displayColor || '#000000',
          displayIcon: val.displayIcon || 'circle'
      };

      try {
        await this.statusService.updateStatus(updatedStatus);
        this.router.navigate(['/statuses']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/statuses']);
  }
}
