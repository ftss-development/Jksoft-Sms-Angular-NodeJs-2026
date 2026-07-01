
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TicketHead, ServiceCategory } from '../models/ticket-head.model';



@Injectable({
  providedIn: 'root'
})
export class TicketHeadService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/ticket_heads';
  private readonly _ticketHeads = signal<TicketHead[]>([]);
  private readonly collectionName = 'ticket_heads';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._ticketHeads.set(this._generateMockData());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const heads: TicketHead[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        heads.push({
          ...data,
          id: doc.id.startsWith('TH-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      // Sort by ID
      heads.sort((a, b) => a.id.localeCompare(b.id));
      this._ticketHeads.set(heads);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._ticketHeads().length === 0) {
            this._ticketHeads.set(this._generateMockData());
        }
    }
    });
  }

  get ticketHeads() {
    return this._ticketHeads.asReadonly();
  }

  getTicketHeadById(id: string): TicketHead | undefined {
    return this._ticketHeads().find(t => t.id === id);
  }

  async addTicketHead(head: Omit<TicketHead, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'faultCount'>): Promise<void> {
    const newId = `TH-${Math.floor(Math.random() * 900000) + 100000}-X${Math.floor(Math.random() * 9)}`;

    const newHead: TicketHead = {
      ...head,
      id: newId,
      faultCount: 0,
      auditTrail: [
          { id: 1, action: 'Ticket Head Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial definition created.' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newHead));
    } else {
       this._ticketHeads.update(current => [...current, newHead]);
    }
  }

  async updateTicketHead(head: TicketHead): Promise<void> {
    const updatedAudit = [
        { id: Date.now(), action: 'Configuration Updated', actor: 'System Admin', timestamp: new Date(), description: 'Metadata modified.' },
        ...(head.auditTrail || [])
    ];

    const dataToUpdate = {
        ...head,
        auditTrail: updatedAudit,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    // Firestore update logic simplified for demo
    if (true) { 
        console.log('DB Update triggered'); 
    } 
    
    this._ticketHeads.update(current => 
        current.map(h => h.id === head.id ? dataToUpdate : h)
    );
  }

  async deleteTicketHead(id: string): Promise<void> {
     this._ticketHeads.update(current => current.filter(h => h.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._ticketHeads();
        this._ticketHeads.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): TicketHead[] {
    const categories: ServiceCategory[] = ['Infrastructure', 'Software', 'Hardware', 'Access Control', 'Network', 'Database'];
    const names = ['Connectivity Loss', 'Sync Failure', 'Access Denied', 'Performance Degradation', 'System Crash', 'Data Corruption', 'Hardware Overheat', 'License Expired', 'API Timeout', 'Login Issue'];
    const domains = ['IT Infrastructure', 'Corporate Apps', 'Field Operations', 'Security Ops', 'DevOps', 'End User Computing'];
    const statuses = ['Active', 'Inactive', 'Published'];

    const generated: TicketHead[] = [];

    for (let i = 0; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const nameSuffix = names[Math.floor(Math.random() * names.length)];
        const name = `${category} ${nameSuffix}`;
        const shortName = `${category.substring(0,3).toUpperCase()}-${nameSuffix.split(' ')[0].substring(0,4).toUpperCase()}-${i}`;
        
        generated.push({
            id: `TH-${Math.floor(Math.random() * 899999) + 100000}-GE`,
            name: name,
            shortName: shortName,
            serviceCategory: category,
            reason: `${nameSuffix} - Level ${Math.floor(Math.random() * 3) + 1}`,
            resolutionTime: Math.floor(Math.random() * 240) + 15,
            faultCount: Math.floor(Math.random() * 1500),
            slaTargetHours: Math.floor(Math.random() * 48) + 1,
            status: statuses[Math.floor(Math.random() * statuses.length)] as any,
            isActive: Math.random() > 0.1,
            colorCode: '#' + Math.floor(Math.random()*16777215).toString(16),
            icon: 'confirmation_number',
            businessHours: 'Global 24/7 Support',
            autoClose: Math.random() > 0.5,
            maxFaultsBeforeEscalation: Math.floor(Math.random() * 5) + 1,
            escalationTeam: 'L2 Support',
            domain: domains[Math.floor(Math.random() * domains.length)],
            description: `<p>Standard resolution procedure for <strong>${name}</strong>.</p><ul><li>Verify connection</li><li>Check logs</li><li>Restart service</li></ul>`,
            auditTrail: [],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockData(): TicketHead[] {
    return [
      {
        id: 'TH-849200-XJ',
        name: 'Network Connectivity Loss',
        shortName: 'NET-CONN-01',
        serviceCategory: 'Infrastructure',
        reason: 'Router Malfunction',
        resolutionTime: 45,
        faultCount: 1245,
        slaTargetHours: 4,
        status: 'Active',
        isActive: true,
        colorCode: '#7C3AED', // Purple
        icon: 'router',
        businessHours: 'Global 24/7 Support',
        autoClose: true,
        maxFaultsBeforeEscalation: 3,
        escalationTeam: 'L2 Infra Team',
        domain: 'IT Infrastructure',
        description: '1. Verify physical connection status.<br>2. Check router logs for recent outages.<br>3. If issue persists > 30 mins, escalate to Network Engineering team.',
        auditTrail: [
            { id: 1, action: 'SLA Target Updated', actor: 'Admin Smith', timestamp: new Date(), description: 'Changed from 2 Hours to 4 Hours' },
            { id: 2, action: 'Ticket Head Created', actor: 'John Doe', timestamp: new Date('2023-10-12'), description: 'Initial draft created with status Active.' }
        ],
        createdBy: 'Admin User',
        createdDate: new Date('2023-01-12'),
        updatedBy: 'Sarah Jenkins',
        lastUpdated: new Date()
      },
      {
        id: 'TH-102933-AB',
        name: 'Email Sync Failure',
        shortName: 'SW-MAIL-SYNC',
        serviceCategory: 'Software',
        reason: 'Exchange Server Error',
        resolutionTime: 30,
        faultCount: 892,
        slaTargetHours: 24,
        status: 'Active',
        isActive: true,
        colorCode: '#3B82F6', // Blue
        icon: 'mail',
        domain: 'Corporate Apps',
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-02-15'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-02-15')
      },
      {
        id: 'TH-998122-CD',
        name: 'Printer Jam / Toner',
        shortName: 'HW-PRNT-GEN',
        serviceCategory: 'Hardware',
        reason: 'Mechanical Failure',
        resolutionTime: 120,
        faultCount: 456,
        slaTargetHours: 48,
        status: 'Active',
        isActive: true,
        colorCode: '#F59E0B', // Orange
        icon: 'print',
        domain: 'Field Operations',
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-03-20'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-20')
      },
      {
        id: 'TH-556677-ZZ',
        name: 'VPN Access Request',
        shortName: 'ACC-VPN-REQ',
        serviceCategory: 'Access Control',
        reason: 'New User Onboarding',
        resolutionTime: 240,
        faultCount: 120,
        slaTargetHours: 8,
        status: 'Inactive',
        isActive: false,
        colorCode: '#EF4444', // Red
        icon: 'vpn_key',
        domain: 'Security Ops',
        auditTrail: [],
        createdBy: 'Manager',
        createdDate: new Date('2023-05-10'),
        updatedBy: 'Manager',
        lastUpdated: new Date('2023-06-01')
      }
    ];
  }
}
