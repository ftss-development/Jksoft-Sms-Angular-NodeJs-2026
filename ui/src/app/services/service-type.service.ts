
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ServiceType, ServiceHistoryEvent } from '../models/service-type.model';



@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/service_types';
  private readonly _serviceTypes = signal<ServiceType[]>([]);
  private readonly collectionName = 'service_types';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._serviceTypes.set(this._generateMockServiceTypes());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const types: ServiceType[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        types.push({
          ...data,
          id: doc.id.startsWith('SVC-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          historyLog: (data.historyLog || []).map((h: any) => ({
             ...h,
             timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : new Date(h.timestamp)
          }))
        });
      });
      // Sort by ID
      types.sort((a, b) => a.id.localeCompare(b.id));
      this._serviceTypes.set(types);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._serviceTypes().length === 0) {
            this._serviceTypes.set(this._generateMockServiceTypes());
        }
    }
    });
  }

  get serviceTypes() {
    return this._serviceTypes.asReadonly();
  }

  getServiceTypeById(id: string): ServiceType | undefined {
    return this._serviceTypes().find(s => s.id === id);
  }

  async addServiceType(service: Omit<ServiceType, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'historyLog' | 'serviceCode' | 'version' | 'isMasterCatalog'>): Promise<void> {
    const currentCount = this._serviceTypes().length;
    const newId = `SVC-${String(currentCount + 1).padStart(3, '0')}`;

    const newService: ServiceType = {
      ...service,
      id: newId,
      serviceCode: `${service.serviceName.substring(0,3).toUpperCase()}-${Math.floor(Math.random()*1000)}-STD`,
      version: 'v1.0.0',
      isMasterCatalog: true,
      historyLog: [
          { 
            id: 1, 
            title: 'Service Definition Created', 
            description: 'Initial definition draft created.', 
            timestamp: new Date(), 
            icon: 'add_circle',
            type: 'default'
          }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newService));
    } else {
       this._serviceTypes.update(current => [...current, newService]);
    }
  }

  async updateServiceType(service: ServiceType): Promise<void> {
    const updatedHistory: ServiceHistoryEvent[] = [
        { 
            id: Date.now(), 
            title: 'SLA Parameters Updated', 
            description: 'Configuration updated by administrator.', 
            timestamp: new Date(), 
            icon: 'tune',
            type: 'info'
        },
        ...service.historyLog
    ];

    const dataToUpdate = {
        ...service,
        historyLog: updatedHistory,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };

    if (true) {
        // Typically requires the Firestore doc ID. For this demo, we assume local update if ID is custom
        console.log('DB Update triggered');
    } 
    
    this._serviceTypes.update(current => 
        current.map(s => s.id === service.id ? dataToUpdate : s)
    );
  }

  async deleteServiceType(id: string): Promise<void> {
     this._serviceTypes.update(current => current.filter(s => s.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._serviceTypes();
        this._serviceTypes.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): ServiceType[] {
    const names = ['Residential', 'Commercial', 'Enterprise', 'Public Sector', 'Industrial', 'Government', 'Education', 'Healthcare', 'Small Business', 'Non-Profit'];
    const suffixes = ['Basic', 'Standard', 'Premium', 'Gold', 'Platinum', 'Plus', 'Ultra', 'Lite', 'Pro', 'Elite'];
    const categories = ['Internet Services', 'Cloud Storage', 'VoIP Solutions', 'Managed Security', 'Professional Services', 'Consulting', 'Maintenance'];
    const tiers = ['Tier 1 - Standard', 'Tier 2 - Business', 'Tier 3 - Critical', 'Tier 1 - Premium Response'];
    const statuses: any[] = ['Active', 'Active', 'Active', 'Inactive', 'Draft'];

    const generated: ServiceType[] = [];
    const startId = this._serviceTypes().length + 10;

    for (let i = 0; i < count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const fullName = `${name} ${suffix}`;
        
        generated.push({
            id: `SVC-${String(startId + i).padStart(3, '0')}`,
            serviceName: fullName,
            category: categories[Math.floor(Math.random() * categories.length)],
            slaTier: tiers[Math.floor(Math.random() * tiers.length)],
            description: `Comprehensive ${fullName.toLowerCase()} package including 24/7 support and dedicated account management.`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            serviceCode: `SVC-${Math.floor(Math.random() * 9000) + 1000}-GEN`,
            version: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 9)}`,
            isMasterCatalog: Math.random() > 0.2,
            historyLog: [
                { id: 1, title: 'Auto-Generated', description: 'Batch import.', timestamp: new Date(), icon: 'smart_toy', type: 'default' }
            ],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockServiceTypes(): ServiceType[] {
    return [
      {
        id: 'SVC-001',
        serviceName: 'Residential',
        category: 'Internet Services',
        slaTier: 'Tier 1 - Standard',
        description: 'Standard fiber optic connection for residential properties.',
        status: 'Active',
        serviceCode: 'SVC-1001-RES',
        version: 'v2.0',
        isMasterCatalog: true,
        historyLog: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-01-10'),
        lastUpdated: new Date('2023-01-10')
      },
      {
        id: 'SVC-002',
        serviceName: 'Commercial',
        category: 'Business Solutions',
        slaTier: 'Tier 2 - Business',
        description: 'High-bandwidth leased lines for commercial office spaces.',
        status: 'Active',
        serviceCode: 'SVC-2002-COM',
        version: 'v1.5',
        isMasterCatalog: true,
        historyLog: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-02-15'),
        lastUpdated: new Date('2023-02-15')
      },
      {
        id: 'SVC-003',
        serviceName: 'Industrial',
        category: 'Infrastructure',
        slaTier: 'Tier 3 - Critical',
        description: 'Ruggedized connectivity solutions for manufacturing plants.',
        status: 'Inactive',
        serviceCode: 'SVC-3003-IND',
        version: 'v1.0',
        isMasterCatalog: false,
        historyLog: [],
        createdBy: 'Manager',
        createdDate: new Date('2023-03-20'),
        lastUpdated: new Date('2023-06-01')
      },
      {
        id: 'SVC-004',
        serviceName: 'Public Sector',
        category: 'Government',
        slaTier: 'Tier 2 - Secure',
        description: 'Secure, compliant networks for government buildings.',
        status: 'Active',
        serviceCode: 'SVC-4004-PUB',
        version: 'v3.1',
        isMasterCatalog: true,
        historyLog: [],
        createdBy: 'System',
        createdDate: new Date('2023-04-10'),
        lastUpdated: new Date('2023-09-12')
      },
      {
        id: 'SVC-9021',
        serviceName: 'Enterprise Support Gold',
        category: 'Professional Services',
        slaTier: 'Tier 1 - Premium Response',
        description: 'Standard enterprise-grade support package including 24/7 availability, dedicated account management, and a 4-hour initial response time guarantee for all critical incidents.',
        status: 'Active',
        serviceCode: 'SVC-9021-ESG',
        version: 'v1.4.0',
        isMasterCatalog: true,
        historyLog: [
            { id: 1, title: 'Service Audit Completed', description: 'Full compliance review passed for 2024 service standards.', timestamp: new Date('2023-12-01T14:20:00'), icon: 'check_circle', type: 'success' },
            { id: 2, title: 'SLA Parameters Updated', description: 'Adjusted critical response time from 6 hours to 4 hours for Gold tier.', timestamp: new Date('2023-11-15T09:30:00'), icon: 'tune', type: 'default' },
            { id: 3, title: 'Service Definition Created', description: 'Initial entry for the Enterprise Support Gold service tier.', timestamp: new Date('2023-10-10T10:15:00'), icon: 'add_circle', type: 'default' }
        ],
        createdBy: 'System Admin',
        createdDate: new Date('2023-10-10T10:15:00'),
        updatedBy: 'Audit Team',
        lastUpdated: new Date('2023-12-01T14:20:00')
      }
    ];
  }
}
