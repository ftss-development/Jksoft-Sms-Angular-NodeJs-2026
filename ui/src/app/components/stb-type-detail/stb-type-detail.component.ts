
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { StbTypeService } from '../../services/stb-type.service';
import { StbType } from '../../models/stb-type.model';

@Component({
  selector: 'app-stb-type-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './stb-type-detail.component.html',
  styleUrl: './stb-type-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StbTypeDetailComponent implements OnInit {
  private readonly stbService = inject(StbTypeService);
  private readonly route = inject(ActivatedRoute);

  stbType: StbType | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.stbType = this.stbService.getStbTypeById(id);
      }
  }
}
