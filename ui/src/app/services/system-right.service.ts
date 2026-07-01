
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SystemRight } from '../models/role.model';



@Injectable({
  providedIn: 'root'
})
export class SystemRightService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/system_rights';
  private readonly _rights = signal<SystemRight[]>([]);
  private readonly collectionName = 'system_rights';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
      this._ensureDefaultRights();
    } else {
      this._rights.set(this._generateMockRights());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const rights: SystemRight[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        rights.push({
          ...data,
          id: doc.id.startsWith('RGT-') ? doc.id : data.id || doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      rights.sort((a, b) => a.module.localeCompare(b.module) || a.name.localeCompare(b.name));
      this._rights.set(rights);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._rights().length === 0) {
            this._rights.set(this._generateMockRights());
        }
    }
    });
  }

  private async _ensureDefaultRights() {
      
      const snapshot = await lastValueFrom(this.http.get<any[]>(this.apiUrl));
      if (!snapshot || snapshot.length === 0) {
          console.log('Seeding System Rights to Firestore...');
          const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
          const mocks = this._generateMockRights();
          mocks.forEach(right => {
              // Use mock ID as document ID for stability
              const docRef = `${this.apiUrl}/right.id`;
              batch.set(docRef, right);
          });
          await batch.commit();
      }
  }

  get rights() {
    return this._rights.asReadonly();
  }

  getRightById(id: string): SystemRight | undefined {
    return this._rights().find(r => r.id === id);
  }

  async addRight(right: Omit<SystemRight, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const currentCount = this._rights().length;
    const newId = `RGT-${String(currentCount + 1).padStart(3, '0')}`;

    const newRight: SystemRight = {
      ...right,
      id: newId,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newRight));
    } else {
       this._rights.update(current => [...current, newRight]);
    }
  }

  async updateRight(right: SystemRight): Promise<void> {
    const dataToUpdate = {
        ...right,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    if (true) {
       await lastValueFrom(this.http.put(`${this.apiUrl}/${right.id}`, dataToUpdate as any));
    }
    
    this._rights.update(current => 
        current.map(r => r.id === right.id ? dataToUpdate : r)
    );
  }

  async deleteRight(id: string): Promise<void> {
     if (true) {
         await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
     } else {
         this._rights.update(current => current.filter(r => r.id !== id));
     }
  }

  async addDummyData(): Promise<void> {
      // Dummy data logic...
  }

  private _generateMockRights(): SystemRight[] {
    return [
        // Dashboard
        { id: 'RGT-001', name: 'View Dashboard', code: 'VIEW_DASHBOARD', module: 'Dashboard', description: 'Access to main dashboard', status: 'Active', createdBy: 'System', createdDate: new Date() },
        
        // Administration
        { id: 'RGT-002', name: 'View Users', code: 'VIEW_USERS', module: 'Administration', description: 'View user list and details', status: 'Active', createdBy: 'System', createdDate: new Date() },
        { id: 'RGT-003', name: 'Manage Users', code: 'MANAGE_USERS', module: 'Administration', description: 'Create, edit, delete users', status: 'Active', createdBy: 'System', createdDate: new Date() },
        { id: 'RGT-004', name: 'View Roles', code: 'VIEW_ROLES', module: 'Administration', description: 'View roles list', status: 'Active', createdBy: 'System', createdDate: new Date() },
        { id: 'RGT-005', name: 'Manage Roles', code: 'MANAGE_ROLES', module: 'Administration', description: 'Configure roles and rights', status: 'Active', createdBy: 'System', createdDate: new Date() },
        { id: 'RGT-006', name: 'View Departments', code: 'VIEW_DEPTS', module: 'Administration', description: 'View departments', status: 'Active', createdBy: 'System', createdDate: new Date() },

        // Finance
        { id: 'RGT-010', name: 'View Finance', code: 'VIEW_FINANCE', module: 'Finance', description: 'View tax, banks, notes', status: 'Active', createdBy: 'System', createdDate: new Date() },
        
        // Inventory
        { id: 'RGT-020', name: 'View Inventory', code: 'VIEW_INVENTORY', module: 'Inventory', description: 'View stores, STBs, items', status: 'Active', createdBy: 'System', createdDate: new Date() },
        
        // Billing
        { id: 'RGT-030', name: 'View Billing', code: 'VIEW_BILLING', module: 'Billing', description: 'View schemes and billing data', status: 'Active', createdBy: 'System', createdDate: new Date() },

        // Documents
        { id: 'RGT-040', name: 'View Documents', code: 'VIEW_DOCS', module: 'Documents', description: 'View document categories and heads', status: 'Active', createdBy: 'System', createdDate: new Date() },

        // Customer
        { id: 'RGT-050', name: 'View Customers', code: 'VIEW_CUSTOMERS', module: 'Customer', description: 'View customer list', status: 'Active', createdBy: 'System', createdDate: new Date() },
        { id: 'RGT-051', name: 'Manage Customers', code: 'MANAGE_CUSTOMERS', module: 'Customer', description: 'Add/Edit customers', status: 'Active', createdBy: 'System', createdDate: new Date() },

        // Support
        { id: 'RGT-060', name: 'View Tickets', code: 'VIEW_TICKETS', module: 'Support', description: 'View support tickets', status: 'Active', createdBy: 'System', createdDate: new Date() },
        
        // Geo Data
        { id: 'RGT-070', name: 'View Geo Data', code: 'VIEW_GEO', module: 'Geo Data', description: 'View countries, states, cities, etc.', status: 'Active', createdBy: 'System', createdDate: new Date() },
        
        // Channels
        { id: 'RGT-080', name: 'View Channels', code: 'VIEW_CHANNELS', module: 'Channels', description: 'View channel list and packages', status: 'Active', createdBy: 'System', createdDate: new Date() },
    ];
  }
}
