
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ParticularTypeService } from '../../services/particular-type.service';
import { ParticularType } from '../../models/particular-type.model';

@Component({
  selector: 'app-particular-type-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './particular-type-detail.component.html',
  styleUrl: './particular-type-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularTypeDetailComponent implements OnInit {
  private readonly ptService = inject(ParticularTypeService);
  private readonly route = inject(ActivatedRoute);

  pt: ParticularType | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.pt = this.ptService.getParticularTypeById(id);
      }
  }
}
