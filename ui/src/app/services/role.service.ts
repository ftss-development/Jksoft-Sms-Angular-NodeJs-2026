
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Role, SystemRight } from '../models/role.model';
import { SystemRightService } from './system-right.service';



@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/roles';
  private readonly rightService = inject(SystemRightService);
  private readonly _roles = signal<Role[]>([]);
  private readonly collectionName = 'roles';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
      this._ensureDefaultRoles();
    } else {
      this._roles.set(this._generateMockRoles());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const roles: Role[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        roles.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          auditTrail: (data.auditTrail || []).map((a: any) => ({
             ...a,
             timestamp: a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
          }))
        });
      });
      roles.sort((a, b) => a.id.localeCompare(b.id));
      this._roles.set(roles);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._roles().length === 0) {
            this._roles.set(this._generateMockRoles());
        }
    }
    });
  }

  private async _ensureDefaultRoles() {
      const mocks = this._generateMockRoles();
      // Check each role individually to ensure all default roles exist
      for (const role of mocks) {
          const roleRef = `${this.apiUrl}/${role.id}`;
          try {
              await lastValueFrom(this.http.get(roleRef));
          } catch (error) {
              const err = error as any;
              if (err?.status === 404) {
                  console.log(`Seeding missing role: ${role.roleName}`);
                  await lastValueFrom(this.http.post(this.apiUrl, role));
              } else {
                  throw error;
              }
          }
      }
  }

  get roles() {
    return this._roles.asReadonly();
  }

  getRoleById(id: string): Role | undefined {
    return this._roles().find(r => r.id === id);
  }

  async addRole(role: Omit<Role, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTrail' | 'userCount'>): Promise<void> {
    const currentCount = this._roles().length;
    const newId = `ROL-${String(currentCount + 100).padStart(3, '0')}`;

    const newRole: Role = {
      ...role,
      id: newId,
      userCount: 0,
      auditTrail: [
          { id: 1, action: 'Role Created', actor: 'System Admin', timestamp: new Date() }
      ],
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.post(this.apiUrl, newRole));
    } else {
       this._roles.update(current => [...current, newRole]);
    }
  }

  async updateRole(role: Role): Promise<void> {
    const updatedAudit = [
        { id: Date.now(), action: 'Permissions Updated', actor: 'System Admin', timestamp: new Date() },
        ...(role.auditTrail || [])
    ];

    const dataToUpdate = {
        ...role,
        auditTrail: updatedAudit,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };

    if (true) {
       await lastValueFrom(this.http.put(`${this.apiUrl}/${role.id}`, dataToUpdate as any));
    }
    
    this._roles.update(current => 
        current.map(r => r.id === role.id ? dataToUpdate : r)
    );
  }

  async deleteRole(id: string): Promise<void> {
     if (true) {
         await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
     } else {
         this._roles.update(current => current.filter(r => r.id !== id));
     }
  }

  async addDummyData(): Promise<void> {
      // ... existing dummy logic
  }

  private _generateMockRoles(): Role[] {
    return [
      {
        id: 'ROL-001',
        roleName: 'Administrator', // Matches UserRole
        description: 'Full system access.',
        status: 'Active',
        rightIds: ['RGT-001', 'RGT-002', 'RGT-003', 'RGT-004', 'RGT-005', 'RGT-006', 'RGT-010', 'RGT-020', 'RGT-030', 'RGT-040', 'RGT-050', 'RGT-051', 'RGT-060', 'RGT-070', 'RGT-080'], 
        userCount: 2,
        auditTrail: [],
        createdBy: 'System',
        createdDate: new Date('2023-01-01'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-01')
      },
      {
        id: 'ROL-002',
        roleName: 'Manager', // Matches UserRole
        description: 'Departmental management access.',
        status: 'Active',
        rightIds: ['RGT-001', 'RGT-006', 'RGT-010', 'RGT-020', 'RGT-030', 'RGT-050', 'RGT-060', 'RGT-080'], // Can view most things, can't manage Users/Roles
        userCount: 5,
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-02-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-02-15')
      },
      {
        id: 'ROL-003',
        roleName: 'User', // Matches UserRole
        description: 'Standard operational access.',
        status: 'Active',
        rightIds: ['RGT-001', 'RGT-050', 'RGT-060'], // Dashboard, Customers, Tickets
        userCount: 12,
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-03-01'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-01')
      },
      {
        id: 'ROL-004',
        roleName: 'Viewer', // Matches UserRole
        description: 'Read-only dashboard access.',
        status: 'Active',
        rightIds: ['RGT-001'], // Dashboard only
        userCount: 3,
        auditTrail: [],
        createdBy: 'Admin',
        createdDate: new Date('2023-03-01'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-01')
      }
    ];
  }
}
