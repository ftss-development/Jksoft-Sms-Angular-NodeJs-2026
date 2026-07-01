
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-channel-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './channel-add.component.html',
  styleUrl: './channel-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelAddComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly channelService = inject(ChannelService);
  private readonly router: Router = inject(Router);

  readonly categories = ['Sports', 'Movies', 'News', 'Infotainment', 'Kids', 'Music', 'General Entertainment'];
  readonly languages = ['English', 'Hindi', 'Spanish', 'French', 'Regional'];

  channelForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    category: ['', Validators.required],
    language: ['', Validators.required],
    basePrice: [0, [Validators.required, Validators.min(0)]],
    isHD: [false],
    isActive: [true]
  });

  onSubmit(): void {
    if (this.channelForm.valid) {
      const val = this.channelForm.getRawValue();
      this.channelService.addChannel({
        name: val.name!,
        code: val.code!,
        category: val.category!,
        language: val.language!,
        basePrice: +val.basePrice!,
        isHD: val.isHD!,
        isActive: val.isActive!
      });
      this.router.navigate(['/channels']);
    } else {
      this.channelForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/channels']);
  }
}
