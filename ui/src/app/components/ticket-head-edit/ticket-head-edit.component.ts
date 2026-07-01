
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketHeadService } from '../../services/ticket-head.service';
import { TicketHead, ServiceCategory, TicketHeadStatus } from '../../models/ticket-head.model';

@Component({
  selector: 'app-ticket-head-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-head-edit.component.html',
  styleUrl: './ticket-head-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketHeadEditComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly headService = inject(TicketHeadService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  headId: string | undefined;
  ticketHead: TicketHead | undefined;
  isSubmitting = signal(false);

  // Mock Categories for pills
  categories = ['Hardware', 'Network', 'Connectivity', 'Power', 'Software'];

  headForm = this.fb.group({
    name: ['', Validators.required],
    shortName: ['', Validators.required],
    slaTargetHours: [4, Validators.required],
    resolutionTime: [240, Validators.required],
    businessHours: ['Global 24/7 Support'],
    description: ['']
  });

  ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
          this.headId = id;
          this.ticketHead = this.headService.getTicketHeadById(id);
          if (this.ticketHead) {
              this.headForm.patchValue({
                  name: this.ticketHead.name,
                  shortName: this.ticketHead.shortName,
                  slaTargetHours: this.ticketHead.slaTargetHours,
                  resolutionTime: this.ticketHead.resolutionTime,
                  businessHours: this.ticketHead.businessHours,
                  description: this.ticketHead.description?.replace(/<[^>]*>?/gm, '') // Strip HTML for simple textarea
              });
          } else {
              this.router.navigate(['/ticket-heads']);
          }
      }
  }

  async onSubmit(): Promise<void> {
    if (this.headForm.valid && this.ticketHead) {
      this.isSubmitting.set(true);
      const val = this.headForm.getRawValue();
      
      const updatedHead: TicketHead = {
          ...this.ticketHead,
          name: val.name!,
          shortName: val.shortName!,
          slaTargetHours: val.slaTargetHours!,
          resolutionTime: val.resolutionTime!,
          businessHours: val.businessHours!,
          description: val.description!
      };

      try {
        await this.headService.updateTicketHead(updatedHead);
        this.router.navigate(['/ticket-heads']);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/ticket-heads']);
  }
}
