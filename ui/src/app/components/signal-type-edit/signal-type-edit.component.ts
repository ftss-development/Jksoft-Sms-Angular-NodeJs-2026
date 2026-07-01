
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SignalTypeService } from '../../services/signal-type.service';
import { SignalType, SignalTypeStatus } from '../../models/signal-type.model';

@Component({
  selector: 'app-signal-type-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './signal-type-edit.component.html',
  styleUrl: './signal-type-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalTypeEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly signalService = inject(SignalTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  signalId: string | undefined;
  signalType: SignalType | undefined;
  isSubmitting = signal(false);

  // Mock Categories for dropdown (though not in screenshot form, good to keep)
  readonly categories = ['Satellite Transmission', 'Fiber-Optic', 'Microwave Backhaul', 'Cellular Network', 'Optical Transport', 'Wired Transmission'];

  signalForm = this.fb.group({
    typeName: ['', [Validators.required, Validators.maxLength(50)]],
    isActive: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.signalId = id;
          this.signalType = this.signalService.getSignalTypeById(id);
          if (this.signalType) {
              this.signalForm.patchValue({
                  typeName: this.signalType.typeName,
                  isActive: this.signalType.status === 'Active'
              });
          } else {
              this.router.navigate(['/signal-types']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.signalForm.valid && this.signalType) {
      this.isSubmitting.set(true);
      const val = this.signalForm.getRawValue();
      
      const updatedType: SignalType = {
          ...this.signalType,
          typeName: val.typeName!,
          status: val.isActive ? 'Active' : 'Inactive',
          // Preserve other fields not in this simple form
          description: this.signalType.description,
      };

      try {
        await this.signalService.updateSignalType(updatedType);
        this.router.navigate(['/signal-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/signal-types']);
  }
}
