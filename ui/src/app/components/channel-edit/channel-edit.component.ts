
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly channelService = inject(ChannelService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  channelId: number | undefined;
  channel: Channel | undefined;

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

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.channelId = +idParam;
      this.channel = this.channelService.getChannelById(this.channelId);
      if (this.channel) {
        this.channelForm.patchValue({
          name: this.channel.name,
          code: this.channel.code,
          category: this.channel.category,
          language: this.channel.language,
          basePrice: this.channel.basePrice,
          isHD: this.channel.isHD,
          isActive: this.channel.isActive
        });
      } else {
        this.router.navigate(['/channels']);
      }
    }
  }

  onSubmit(): void {
    if (this.channelForm.valid && this.channel) {
      const val = this.channelForm.getRawValue();
      const updatedChannel: Channel = {
        ...this.channel,
        name: val.name!,
        code: val.code!,
        category: val.category!,
        language: val.language!,
        basePrice: +val.basePrice!,
        isHD: val.isHD!,
        isActive: val.isActive!
      };
      this.channelService.updateChannel(updatedChannel);
      this.router.navigate(['/channels']);
    } else {
      this.channelForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/channels']);
  }
}
