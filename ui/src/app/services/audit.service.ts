import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuditLog, AuditSeverity, AuditCategory } from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/audit_logs';
  private readonly _logs = signal<AuditLog[]>([]);
  private readonly collectionName = 'audit_logs';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._logs.set(this._generateMockLogs());
    }
  }

  private _initializeRealtimeSync() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
        const logs: AuditLog[] = [];
        snapshot.forEach((itemData) => { 
          const doc = { id: itemData.id, data: () => itemData }; 
          const data = doc.data() as any;
          logs.push({
            ...data,
            id: doc.id,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
          });
        });
        this._logs.set(logs);
      },
      error: (error) => console.error("API error:", error)
    });
  }

  get logs() {
    return this._logs.asReadonly();
  }

  async logEvent(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const newLog = {
      ...log,
      timestamp: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newLog));
    } else {
      const mockId = `LOG-${Date.now()}`;
      this._logs.update(current => [{ ...newLog, id: mockId }, ...current]);
    }
  }

  private _generateMockLogs(): AuditLog[] {
    return [
      {
        id: 'LOG-001',
        action: 'User Created',
        actorName: 'Admin System',
        actorRole: 'Admin',
        module: 'Users',
        description: 'Created new user account for John Doe with Role ID: ROL-102.',
        ipAddress: '192.168.1.45',
        category: 'User Management',
        severity: 'Low',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'LOG-002',
        action: 'System Settings Updated',
        actorName: 'SuperAdmin',
        actorRole: 'SuperAdmin',
        module: 'Settings',
        description: 'Changed password expiry policy from 90 days to 30 days.',
        ipAddress: '192.168.1.1',
        category: 'System',
        severity: 'Medium',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'LOG-003',
        action: 'Failed Login Attempt',
        actorName: 'Unknown',
        actorRole: 'None',
        module: 'Auth',
        description: '5 failed login attempts from IP 192.168.1.45. Account locked temporarily.',
        ipAddress: '192.168.1.45',
        category: 'Security',
        severity: 'High',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      }
    ];
  }
}
