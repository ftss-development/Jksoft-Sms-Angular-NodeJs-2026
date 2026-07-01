
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemMakerService } from '../../services/item-maker.service';
import { ItemMaker } from '../../models/item-maker.model';

@Component({
  selector: 'app-item-maker-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './item-maker-edit.component.html',
  styleUrl: './item-maker-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemMakerEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly makerService = inject(ItemMakerService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  makerId: string | undefined;
  maker: ItemMaker | undefined;
  isSubmitting = signal(false);

  makerForm = this.fb.group({
    makerName: ['', Validators.required],
    shortName: ['', Validators.required],
    status: ['Active', Validators.required],
    description: [''],
    headquarters: [''],
    website: ['']
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.makerId = id;
          this.maker = this.makerService.getMakerById(id);
          if (this.maker) {
              this.makerForm.patchValue({
                  makerName: this.maker.makerName,
                  shortName: this.maker.shortName,
                  status: this.maker.status,
                  description: this.maker.description,
                  headquarters: this.maker.headquarters,
                  website: this.maker.website
              });
          } else {
              this.router.navigate(['/item-makers']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.makerForm.valid && this.maker) {
      this.isSubmitting.set(true);
      const val = this.makerForm.getRawValue();
      
      const updatedMaker: ItemMaker = {
          ...this.maker,
          makerName: val.makerName!,
          shortName: val.shortName!,
          status: val.status as any,
          description: val.description || '',
          headquarters: val.headquarters || '',
          website: val.website || ''
      };

      try {
        await this.makerService.updateMaker(updatedMaker);
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
