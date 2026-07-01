
import { Injectable, signal } from '@angular/core';
import { Enquiry, EnquiryStatus } from '../models/enquiry.model';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private readonly _enquiries = signal<Enquiry[]>([]);
  private _nextId = signal(1);

  constructor() {
    this._enquiries.set(this._generateMockEnquiries());
    const maxId = Math.max(...this._enquiries().map(e => e.id), 0);
    this._nextId.set(maxId + 1);
  }

  get enquiries() {
    return this._enquiries.asReadonly();
  }

  getEnquiryById(id: number): Enquiry | undefined {
    return this._enquiries().find(e => e.id === id);
  }

  addEnquiry(enquiry: Omit<Enquiry, 'id' | 'enquiryNumber' | 'date' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): void {
    const newId = this._nextId();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: newId,
      enquiryNumber: `ENQ-${String(newId).padStart(3, '0')}`,
      date: new Date(),
      createdDate: new Date(),
      createdBy: 'System Admin',
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };
    this._enquiries.update(current => [newEnquiry, ...current]);
    this._nextId.update(id => id + 1);
  }

  updateEnquiry(enquiry: Enquiry): void {
    this._enquiries.update(current => 
      current.map(e => e.id === enquiry.id ? { ...enquiry, updatedBy: 'System Admin', lastUpdated: new Date() } : e)
    );
  }

  deleteEnquiry(id: number): void {
    this._enquiries.update(current => current.filter(e => e.id !== id));
  }

  private _generateMockEnquiries(): Enquiry[] {
    return [
      {
        id: 1,
        enquiryNumber: 'ENQ-001',
        customerName: 'John Michael Doe',
        mobileNo: '+1 555-0101',
        email: 'john.doe@email.com',
        date: new Date('2023-10-27'),
        status: 'New',
        description: 'Interested in the Premium Family Package pricing and channel list.',
        assignedTo: 'Sarah Sales',
        createdBy: 'Web Form',
        createdDate: new Date('2023-10-27T09:00:00'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-10-27T09:00:00')
      },
      {
        id: 2,
        enquiryNumber: 'ENQ-002',
        customerName: 'Sarah Jane Smith',
        mobileNo: '+1 555-0102',
        email: 'sarah.smith@email.com',
        date: new Date('2023-10-26'),
        status: 'In Progress',
        description: 'Checking feasibility for fiber connection at new address.',
        assignedTo: 'Mike Tech',
        createdBy: 'Call Center',
        createdDate: new Date('2023-10-26T14:30:00'),
        updatedBy: 'Mike Tech',
        lastUpdated: new Date('2023-10-26T16:00:00')
      },
      {
        id: 3,
        enquiryNumber: 'ENQ-003',
        customerName: 'Robert Lee Brown',
        mobileNo: '+1 555-0103',
        email: 'r.brown@email.com',
        date: new Date('2023-10-25'),
        status: 'Closed',
        description: 'Complaint about billing cycle. Resolved by clarifying pro-rata charges.',
        assignedTo: 'Finance Dept',
        resolution: 'Explained billing cycle, customer satisfied.',
        createdBy: 'Web Portal',
        createdDate: new Date('2023-10-25T10:15:00'),
        updatedBy: 'Finance Dept',
        lastUpdated: new Date('2023-10-25T11:45:00')
      },
      {
        id: 4,
        enquiryNumber: 'ENQ-004',
        customerName: 'Emily Ann Davis',
        mobileNo: '+1 555-0104',
        email: 'emily.d@email.com',
        date: new Date('2023-10-24'),
        status: 'New',
        description: 'Request for upgrade to HD plan.',
        createdBy: 'Mobile App',
        createdDate: new Date('2023-10-24T18:20:00'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-10-24T18:20:00')
      },
      {
        id: 5,
        enquiryNumber: 'ENQ-005',
        customerName: 'Michael Ray Wilson',
        mobileNo: '+1 555-0105',
        email: 'm.wilson@email.com',
        date: new Date('2023-10-23'),
        status: 'In Progress',
        description: 'Inquiry about bulk connection for apartment complex.',
        assignedTo: 'Enterprise Team',
        createdBy: 'Referral',
        createdDate: new Date('2023-10-23T11:00:00'),
        updatedBy: 'Enterprise Team',
        lastUpdated: new Date('2023-10-24T09:30:00')
      }
    ];
  }
}
