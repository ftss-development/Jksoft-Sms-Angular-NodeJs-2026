
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-channel-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './channel-detail.component.html',
  styleUrl: './channel-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelDetailComponent implements OnInit {
  private readonly channelService = inject(ChannelService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  channel: Channel | undefined;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.channel = this.channelService.getChannelById(+idParam);
    }
  }
}
