
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ParticularService } from '../../services/particular.service';
import { Particular } from '../../models/particular.model';

@Component({
  selector: 'app-particular-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './particular-detail.component.html',
  styleUrl: './particular-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticularDetailComponent implements OnInit {
  private readonly particularService = inject(ParticularService);
  private readonly route = inject(ActivatedRoute);

  particular: Particular | undefined;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.particular = this.particularService.getParticularById(idParam);
    }
  }
}
