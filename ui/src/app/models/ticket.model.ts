import { Customer } from './customer.model';

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export interface TicketActivity {
  id: number;
  title: string;
  description?: string;
  timestamp: Date;
  type: 'created' | 'assigned' | 'status_change' | 'note' | 'target';
  completed: boolean;
}

export interface TicketNote {
  id: number;
  content: string;
  author: string;
  timestamp: Date;
}

export interface Ticket {
  id: number;
  ticketNumber: string; // e.g., TK-88291
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  source: string;
  tags: string[];
  
  customerId: string; // Changed to string to match Customer.customerId
  customer?: Customer; // For display
  
  assignedToName?: string;
  assignedToRole?: string;
  
  activities: TicketActivity[];
  notes: TicketNote[];
  
  // Audit
  createdBy: string;
  createdDate: Date;
  updatedBy?: string;
  lastUpdated?: Date;
  resolutionTarget?: Date;
}