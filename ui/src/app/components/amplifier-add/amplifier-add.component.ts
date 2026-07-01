
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AmplifierService } from '../../services/amplifier.service';
import { AmplifierStatus } from '../../models/amplifier.model';

@Component({
  selector: 'app-amplifier-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './amplifier-add.component.html',
  styleUrl: './amplifier-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmplifierAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly amplifierService = inject(AmplifierService);
  private readonly router: Router = inject(Router);

  readonly statuses: AmplifierStatus[] = ['Active', 'Inactive', 'Maintenance'];

  amplifierForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    serialNumber: ['', Validators.required],
    model: ['', Validators.required],
    status: ['Active' as AmplifierStatus, Validators.required],
    zone: ['', Validators.required],
    location: ['', Validators.required],
    installDate: [new Date().toISOString().substring(0, 10), Validators.required],
    ipAddress: [''],
    firmwareVersion: ['']
  });

  onSubmit(): void {
    if (this.amplifierForm.valid) {
      const val = this.amplifierForm.getRawValue();
      this.amplifierService.addAmplifier({
        name: val.name!,
        description: val.description!,
        serialNumber: val.serialNumber!,
        model: val.model!,
        status: val.status as AmplifierStatus,
        zone: val.zone!,
        location: val.location!,
        installDate: new Date(val.installDate!),
        ipAddress: val.ipAddress || undefined,
        firmwareVersion: val.firmwareVersion || undefined
      });
      this.router.navigate(['/amplifiers']);
    } else {
      this.amplifierForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/amplifiers']);
  }
}
