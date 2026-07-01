
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AmplifierService } from '../../services/amplifier.service';
import { Amplifier, AmplifierStatus } from '../../models/amplifier.model';

@Component({
  selector: 'app-amplifier-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './amplifier-edit.component.html',
  styleUrl: './amplifier-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmplifierEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly amplifierService = inject(AmplifierService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  amplifierId: number | undefined;
  amplifier: Amplifier | undefined;
  readonly statuses: AmplifierStatus[] = ['Active', 'Inactive', 'Maintenance'];

  amplifierForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    serialNumber: ['', Validators.required],
    model: ['', Validators.required],
    status: ['Active' as AmplifierStatus, Validators.required],
    zone: ['', Validators.required],
    location: ['', Validators.required],
    installDate: ['', Validators.required],
    ipAddress: [''],
    firmwareVersion: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.amplifierId = +idParam;
      this.amplifier = this.amplifierService.getAmplifierById(this.amplifierId);
      if (this.amplifier) {
        this.amplifierForm.patchValue({
          name: this.amplifier.name,
          description: this.amplifier.description,
          serialNumber: this.amplifier.serialNumber,
          model: this.amplifier.model,
          status: this.amplifier.status,
          zone: this.amplifier.zone,
          location: this.amplifier.location,
          installDate: this.amplifier.installDate ? new Date(this.amplifier.installDate).toISOString().substring(0, 10) : '',
          ipAddress: this.amplifier.ipAddress,
          firmwareVersion: this.amplifier.firmwareVersion
        });
      } else {
        this.router.navigate(['/amplifiers']);
      }
    }
  }

  onSubmit(): void {
    if (this.amplifierForm.valid && this.amplifier) {
      const val = this.amplifierForm.getRawValue();
      const updatedAmplifier: Amplifier = {
        ...this.amplifier,
        name: val.name!,
        description: val.description!,
        serialNumber: val.serialNumber!,
        model: val.model!,
        status: val.status as AmplifierStatus,
        zone: val.zone!,
        location: val.location!,
        installDate: new Date(val.installDate!),
        ipAddress: val.ipAddress || undefined,
        firmwareVersion: val.firmwareVersion || undefined,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
      };
      this.amplifierService.updateAmplifier(updatedAmplifier);
      this.router.navigate(['/amplifiers']);
    } else {
      this.amplifierForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/amplifiers']);
  }
}
