
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TermCategory, LinkedTerm, TermCategoryAudit } from '../models/term-category.model';



@Injectable({
  providedIn: 'root'
})
export class TermCategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/term_categories';
  private readonly _categories = signal<TermCategory[]>([]);
  private readonly collectionName = 'term_categories';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._categories.set(this._generateMockCategories());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const categories: TermCategory[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        categories.push({
          ...data,
          id: doc.id.startsWith('TCF-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      categories.sort((a, b) => a.id.localeCompare(b.id));
      this._categories.set(categories);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._categories().length === 0) {
            this._categories.set(this._generateMockCategories());
        }
    }
    });
  }

  get categories() {
    return this._categories.asReadonly();
  }

  getCategoryById(id: string): TermCategory | undefined {
    return this._categories().find(c => c.id === id);
  }

  async addCategory(category: Omit<TermCategory, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'categoryCode' | 'linkedTerms'>): Promise<void> {
    const currentCount = this._categories().length;
    const newId = `TCF-${String(currentCount + 1).padStart(3, '0')}`;

    const newCategory: TermCategory = {
      ...category,
      id: newId,
      categoryCode: newId,
      linkedTerms: [],
      auditTrail: [
          { action: 'Category Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial creation', icon: 'add_circle' }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newCategory));
    } else {
       this._categories.update(current => [...current, newCategory]);
    }
  }

  async updateCategory(category: TermCategory): Promise<void> {
    const updatedAudit: TermCategoryAudit[] = [
        { action: 'Metadata Updated', actor: 'System Admin', timestamp: new Date(), description: 'Configuration modified', icon: 'edit' },
        ...(category.auditTrail || [])
    ];

    const dataToUpdate = {
        ...category,
        auditTrail: updatedAudit,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };

    // For simplicity in mock/hybrid mode, we just update local state or log DB update
    if (true) {
        console.log('DB Update triggered');
    }
    
    this._categories.update(current => 
        current.map(c => c.id === category.id ? dataToUpdate : c)
    );
  }

  async deleteCategory(id: string): Promise<void> {
     this._categories.update(current => current.filter(c => c.id !== id));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyData(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._categories();
        this._categories.set([...current, ...dummyData]);
    }
  }

  private _generateDummyData(count: number): TermCategory[] {
    const types = ['Service', 'License', 'Vendor', 'Employee', 'Privacy', 'Compliance', 'Security', 'Operational', 'Financial', 'Data'];
    const suffixes = ['Agreements', 'Policies', 'Terms', 'Addendum', 'Protocol', 'Standard', 'Contract', 'Guidelines'];
    const departments = ['Legal & Compliance', 'HR', 'IT Security', 'Procurement', 'Finance', 'Operations'];

    const generated: TermCategory[] = [];
    const startId = this._categories().length + 10;

    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const name = `${type} ${suffix}`;
        const id = `TCF-${String(startId + i).padStart(3, '0')}`;
        
        generated.push({
            id: id,
            categoryName: name,
            categoryCode: id,
            description: `Standard classification for ${name.toLowerCase()} documentation.`,
            isActive: Math.random() > 0.1,
            enableAutoRenewal: Math.random() > 0.5,
            requireLegalApproval: Math.random() > 0.3,
            department: departments[Math.floor(Math.random() * departments.length)],
            globalEnforcement: Math.random() > 0.5 ? 'Required Globally' : 'Regional Only',
            linkedTerms: [],
            auditTrail: [],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return generated;
  }

  private _generateMockCategories(): TermCategory[] {
    return [
      {
        id: 'TCF-001',
        categoryName: 'Professional Service Agreements',
        categoryCode: 'TCF-001',
        description: 'Standard category for all client-facing Service Level Agreements, covering uptime guarantees, response times, and penalty clauses.',
        isActive: true,
        enableAutoRenewal: true,
        requireLegalApproval: true,
        department: 'Legal & Compliance',
        globalEnforcement: 'Required Globally',
        linkedTerms: [
            { termCode: 'TRM-001', termName: 'Payment Liability Clause', version: 'v2.4.0', lastReview: 'Oct 2023' },
            { termCode: 'TRM-002', termName: 'Termination Notice Period', version: 'v1.1.2', lastReview: 'Aug 2023' },
            { termCode: 'TRM-005', termName: 'Confidentiality Agreement', version: 'v3.0.0', lastReview: 'Nov 2023' }
        ],
        auditTrail: [
            { action: 'Metadata Updated', actor: 'Alex Miller', timestamp: new Date('2024-01-12T09:15:00'), description: 'Revised description and assigned to Legal department.', icon: 'edit' },
            { action: 'Status Changed', actor: 'James Smith', timestamp: new Date('2023-03-10T14:40:00'), description: 'Category moved to \'Active\' status.', icon: 'toggle_on' },
            { action: 'Category Created', actor: 'System', timestamp: new Date('2023-03-10T09:00:00'), description: 'Initial creation of Standard Service Agreement category.', icon: 'add_circle' }
        ],
        createdBy: 'James Smith',
        createdDate: new Date('2023-03-10T09:00:00'),
        updatedBy: 'Sarah Chen',
        lastUpdated: new Date('2023-11-22T10:45:00')
      },
      {
        id: 'TCF-002',
        categoryName: 'Vendor Compliance Terms',
        categoryCode: 'TCF-002',
        description: 'Terms required for all third-party suppliers.',
        isActive: true,
        enableAutoRenewal: false,
        requireLegalApproval: true,
        department: 'Procurement',
        globalEnforcement: 'Required Globally',
        linkedTerms: [],
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-04-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-04-15')
      },
      {
        id: 'TCF-003',
        categoryName: 'Employee Onboarding Policies',
        categoryCode: 'TCF-003',
        description: 'Internal policies for new hires.',
        isActive: true,
        enableAutoRenewal: false,
        requireLegalApproval: false,
        department: 'Human Resources',
        globalEnforcement: 'Regional Only',
        linkedTerms: [],
        auditTrail: [],
        createdBy: 'HR Lead',
        createdDate: new Date('2023-01-20'),
        updatedBy: 'HR Lead',
        lastUpdated: new Date('2023-02-10')
      },
      {
        id: 'TCF-004',
        categoryName: 'Data Privacy Addendum (DPA)',
        categoryCode: 'TCF-004',
        description: 'GDPR and CCPA compliance terms.',
        isActive: false,
        enableAutoRenewal: true,
        requireLegalApproval: true,
        department: 'IT Security',
        globalEnforcement: 'Required Globally',
        linkedTerms: [],
        auditTrail: [],
        createdBy: 'CISO',
        createdDate: new Date('2022-12-05'),
        updatedBy: 'CISO',
        lastUpdated: new Date('2023-06-01')
      },
      {
        id: 'TCF-005',
        categoryName: 'Software License Agreement',
        categoryCode: 'TCF-005',
        description: 'EULA for software products.',
        isActive: true,
        enableAutoRenewal: true,
        requireLegalApproval: true,
        department: 'Product',
        globalEnforcement: 'Required Globally',
        linkedTerms: [],
        auditTrail: [],
        createdBy: 'Product Mgr',
        createdDate: new Date('2023-08-10'),
        updatedBy: 'Legal',
        lastUpdated: new Date('2023-09-15')
      }
    ];
  }
}
