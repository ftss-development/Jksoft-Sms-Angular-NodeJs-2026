
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NoteTypeService } from '../../services/note-type.service';
import { NoteType } from '../../models/note-type.model';

@Component({
  selector: 'app-note-type-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './note-type-detail.component.html',
  styleUrl: './note-type-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteTypeDetailComponent implements OnInit {
  private readonly noteTypeService = inject(NoteTypeService);
  private readonly route = inject(ActivatedRoute);

  noteType: NoteType | undefined;

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.noteType = this.noteTypeService.getNoteTypeById(id);
      }
  }
}
