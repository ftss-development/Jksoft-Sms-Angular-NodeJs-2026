
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StbTypeService } from '../../services/stb-type.service';
import { StbType } from '../../models/stb-type.model';

@Component({
  selector: 'app-stb-type-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './stb-type-edit.component.html',
  styleUrl: './stb-type-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StbTypeEditComponent implements OnInit {
  // FIX: Explicitly type `fb` as FormBuilder
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly stbService = inject(StbTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  stbId: string | undefined;
  stbType: StbType | undefined;
  isSubmitting = signal(false);

  // Mock Dropdowns
  readonly manufacturers = ['Global Electronics Corp', 'TechnoStream', 'VisionSystems', 'NetCommand', 'SkyBox Inc.', 'PrimeMedia', 'Generic Systems'];

  stbForm = this.fb.group({
    typeName: ['', Validators.required],
    manufacturer: ['', Validators.required],
    manufacturerCode: ['', Validators.required],
    description: [''],
    isActive: [false],
    // Specs
    supports4k: [false],
    wifiConnectivity: [false],
    voiceRemote: [false],
    bluetooth: [false]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.stbId = id;
          this.stbType = this.stbService.getStbTypeById(id);
          if (this.stbType) {
              this.stbForm.patchValue({
                  typeName: this.stbType.typeName,
                  manufacturer: this.stbType.manufacturer,
                  manufacturerCode: this.stbType.manufacturerCode,
                  description: this.stbType.description,
                  isActive: this.stbType.status === 'Active',
                  supports4k: this.stbType.specs.supports4k,
                  wifiConnectivity: this.stbType.specs.wifiConnectivity,
                  voiceRemote: this.stbType.specs.voiceRemote,
                  bluetooth: this.stbType.specs.bluetooth
              });
          } else {
              this.router.navigate(['/stb-types']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.stbForm.valid && this.stbType) {
      this.isSubmitting.set(true);
      const val = this.stbForm.getRawValue();
      
      const updatedType: StbType = {
          ...this.stbType,
          typeName: val.typeName!,
          manufacturer: val.manufacturer!,
          manufacturerCode: val.manufacturerCode!,
          description: val.description || '',
          status: val.isActive ? 'Active' : 'Inactive',
          specs: {
              supports4k: val.supports4k || false,
              wifiConnectivity: val.wifiConnectivity || false,
              voiceRemote: val.voiceRemote || false,
              bluetooth: val.bluetooth || false
          }
      };

      try {
        await this.stbService.updateStbType(updatedType);
        this.router.navigate(['/stb-types']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/stb-types']);
  }
}
