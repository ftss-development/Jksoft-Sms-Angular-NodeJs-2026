
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelListComponent {
  readonly channelService = inject(ChannelService);
  readonly channels = this.channelService.channels;

  // Pagination Logic
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly paginatedChannels = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.channels().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.ceil(this.channels().length / this.pageSize));
  readonly startItemIndex = computed(() => this.channels().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1);
  readonly endItemIndex = computed(() => Math.min(this.currentPage() * this.pageSize, this.channels().length));

  get pages() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onDelete(id: number): void {
    this.channelService.deleteChannel(id);
  }
}
