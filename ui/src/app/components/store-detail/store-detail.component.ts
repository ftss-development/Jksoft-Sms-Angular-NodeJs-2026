
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-store-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './store-detail.component.html',
  styleUrl: './store-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDetailComponent implements OnInit {
  private readonly storeService = inject(StoreService);
  private readonly route = inject(ActivatedRoute);

  store: Store | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.store = this.storeService.getStoreById(id);
      }
  }
}
