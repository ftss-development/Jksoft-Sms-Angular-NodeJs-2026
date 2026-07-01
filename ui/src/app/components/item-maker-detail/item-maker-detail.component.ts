
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ItemMakerService } from '../../services/item-maker.service';
import { ItemMaker } from '../../models/item-maker.model';

@Component({
  selector: 'app-item-maker-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './item-maker-detail.component.html',
  styleUrl: './item-maker-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemMakerDetailComponent implements OnInit {
  private readonly makerService = inject(ItemMakerService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  maker: ItemMaker | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.maker = this.makerService.getMakerById(id);
      }
  }
}
