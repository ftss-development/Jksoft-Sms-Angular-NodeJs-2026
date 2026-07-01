
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketReasonService } from '../../services/ticket-reason.service';
import { TicketReason } from '../../models/ticket-reason.model';

@Component({
  selector: 'app-ticket-reason-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './ticket-reason-edit.component.html',
  styleUrl: './ticket-reason-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketReasonEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly reasonService = inject(TicketReasonService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  reasonId: string | undefined;
  reason: TicketReason | undefined;
  isSubmitting = signal(false);

  reasonForm = this.fb.group({
    reasonName: ['', Validators.required],
    shortName: ['', Validators.required],
    status: ['Active', Validators.required]
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.reasonId = id;
          this.reason = this.reasonService.getReasonById(id);
          if (this.reason) {
              this.reasonForm.patchValue({
                  reasonName: this.reason.reasonName,
                  shortName: this.reason.shortName,
                  status: this.reason.status
              });
          } else {
              this.router.navigate(['/ticket-reasons']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.reasonForm.valid && this.reason) {
      this.isSubmitting.set(true);
      const val = this.reasonForm.getRawValue();
      
      const updatedReason: TicketReason = {
          ...this.reason,
          reasonName: val.reasonName!,
          shortName: val.shortName!,
          status: val.status as any,
          updatedBy: 'System Admin',
          lastUpdated: new Date()
      };

      try {
        await this.reasonService.updateReason(updatedReason);
        this.router.navigate(['/ticket-reasons']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/ticket-reasons']);
  }
}
