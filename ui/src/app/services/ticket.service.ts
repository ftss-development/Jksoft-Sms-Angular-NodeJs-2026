
import { inject, Injectable, signal } from '@angular/core';
import { Ticket, TicketPriority, TicketStatus } from '../models/ticket.model';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly customerService = inject(CustomerService);
  private readonly _tickets = signal<Ticket[]>([]);

  constructor() {
    this._tickets.set(this._generateMockTickets());
  }

  get tickets() {
    return this._tickets.asReadonly();
  }

  getTicketById(id: number): Ticket | undefined {
    return this._tickets().find(t => t.id === id);
  }

  addTicket(ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'activities' | 'notes' | 'createdDate' | 'createdBy'>): void {
    const newId = Math.max(...this._tickets().map(t => t.id), 0) + 1;
    const newTicket: Ticket = {
      ...ticket,
      id: newId,
      ticketNumber: `TK-${88000 + newId}`,
      activities: [
        {
            id: 1,
            title: 'Ticket Created',
            description: 'Automated system check performed.',
            timestamp: new Date(),
            type: 'created',
            completed: true
        }
      ],
      notes: [],
      createdDate: new Date(),
      createdBy: 'System Admin'
    };
    this._tickets.update(current => [newTicket, ...current]);
  }

  updateTicket(ticket: Ticket): void {
    this._tickets.update(current => 
      current.map(t => t.id === ticket.id ? ticket : t)
    );
  }

  deleteTicket(id: number): void {
    this._tickets.update(current => current.filter(t => t.id !== id));
  }

  private _generateMockTickets(): Ticket[] {
    const sarah = this.customerService.getCustomerById('2'); // Pass string ID

    return [
      {
        id: 1,
        ticketNumber: 'TK-88291',
        subject: 'Latency and packet loss',
        description: 'Customer reports periodic latency and packet loss since firmware update.',
        status: TicketStatus.InProgress,
        priority: TicketPriority.High,
        category: 'Broadband / Connection',
        source: 'Mobile App (v4.2)',
        tags: ['FTTH', 'ONT_REPLACE', 'URGENT'],
        customerId: '2', // Change to string
        customer: sarah,
        assignedToName: 'Michael Chen',
        assignedToRole: 'Tier 2 Network Specialist',
        createdDate: new Date('2023-10-24T09:00:00'),
        createdBy: 'System',
        updatedBy: 'Michael Chen',
        lastUpdated: new Date('2023-10-24T11:30:00'),
        resolutionTarget: new Date('2023-10-25T09:00:00'),
        activities: [
          {
            id: 1,
            title: 'Ticket Created',
            description: 'Automated system check performed. No immediate outages detected in the area.',
            timestamp: new Date('2023-10-24T09:00:00'),
            type: 'created',
            completed: true
          },
          {
            id: 2,
            title: 'Assigned to Technician',
            description: 'Case picked up by Michael Chen (Tier 2).',
            timestamp: new Date('2023-10-24T10:15:00'),
            type: 'assigned',
            completed: true
          },
          {
            id: 3,
            title: 'Work in Progress',
            description: 'Technician is performing remote diagnostics on ONT serial #FE23-99-A1.',
            timestamp: new Date('2023-10-24T11:30:00'),
            type: 'status_change',
            completed: true // Current active state
          },
          {
            id: 4,
            title: 'Resolution Target',
            description: 'Awaiting field dispatch confirmation if remote fix fails.',
            timestamp: new Date('2023-10-25T09:00:00'),
            type: 'target',
            completed: false
          }
        ],
        notes: [
          {
            id: 1,
            content: 'Customer mentioned issues began exactly after the 2:00 AM maintenance window. Likely a config mismatch.',
            author: 'Michael C.',
            timestamp: new Date('2023-10-24T10:45:00')
          }
        ]
      },
      {
        id: 2,
        ticketNumber: 'TK-88240',
        subject: 'Billing Inquiry',
        description: 'Customer questions the extra charge on Oct invoice.',
        status: TicketStatus.Open,
        priority: TicketPriority.Medium,
        category: 'Billing',
        source: 'Email',
        tags: ['BILLING', 'REVIEW'],
        customerId: '1', // Change to string
        createdDate: new Date('2023-10-23T14:00:00'),
        createdBy: 'Support Bot',
        activities: [],
        notes: []
      }
    ];
  }
}
