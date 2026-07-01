import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserRole, UserStatus, LoginLog, UserSession } from '../models/user.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/users';
  private readonly _users = signal<User[]>([]);

  constructor() {
    this._initializeRealtimeSync();
    this._ensureAdminExists();
  }

  private _initializeRealtimeSync() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (usersData) => {
        const users: User[] = usersData.map(data => ({
          ...data,
          createdDate: data.createdDate ? new Date(data.createdDate) : new Date(),
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
          lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined
        }));
        this._users.set(users);
      },
      error: (error) => {
        console.error("API error:", error);
        if (this._users().length === 0) {
            this._users.set(this._generateMockUsers());
        }
      }
    });
  }

  private async _ensureAdminExists() {
    try {
        const adminUser = this._getAdminUser();
        const { id, ...data } = adminUser;
        await lastValueFrom(this.http.post(`${this.apiUrl}/seed-admin`, data));
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
  }

  get users() {
    return this._users.asReadonly();
  }

  getUserById(id: string): User | undefined {
    return this._users().find(u => u.id === id);
  }

  async hashPassword(password: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async addUser(user: Omit<User, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'recentActivity' | 'avatarUrl' | 'lastLogin' | 'sessions'> & { password?: string }): Promise<void> {
    const passwordHash = user.password 
        ? await this.hashPassword(user.password) 
        : await this.hashPassword('password123'); 

    const { password, ...userData } = user;

    const newUser: Partial<User> = {
      forcePasswordChange: false,
      twoFactorEnabled: false,
      ...userData,
      passwordHash,
      avatarUrl: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date(),
      recentActivity: [],
      sessions: []
    };

    if (true) {
      try {
        const response: any = await lastValueFrom(this.http.post(this.apiUrl, newUser));
        this._users.update(current => [...current, { ...newUser, id: response.id } as User]);
      } catch (error) {
        console.error("Error adding user via API:", error);
      }
    }
  }

  async updateUser(user: User): Promise<void> {
    const dataToUpdate = {
        ...user,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        try {
            await lastValueFrom(this.http.put(`${this.apiUrl}/${user.id}`, firestoreData));
            this._users.update(current => 
                current.map(u => u.id === user.id ? { ...user, ...firestoreData } as User : u)
            );
        } catch (error) {
            console.error("Error updating user via API:", error);
        }
    }
  }

  async deleteUser(id: string): Promise<void> {
    if (id === 'ADMIN-001') {
        alert("Cannot delete the root Administrator account.");
        return;
    }

    if (true) {
        try {
            await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
            this._users.update(current => current.filter(u => u.id !== id));
        } catch (error) {
            console.error("Error deleting user via API:", error);
        }
    }
  }

  revokeSession(userId: string, sessionId: string): void {
      this._users.update(users => users.map(u => {
          if (u.id === userId && u.sessions) {
              return {
                  ...u,
                  sessions: u.sessions.filter(s => s.id !== sessionId)
              };
          }
          return u;
      }));
  }

  revokeAllSessions(userId: string): void {
      this._users.update(users => users.map(u => {
          if (u.id === userId) {
              return { ...u, sessions: [] };
          }
          return u;
      }));
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyUsers(50);
    if (true) {
        try {
            const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
            const results: any[] = await Promise.all(promises);
            
            const current = this._users();
            const newItems = dummyData.map((d, index) => ({ ...d, id: results[index].id } as User));
            this._users.set([...current, ...newItems]);
        } catch (error) {
            console.error("Error adding dummy data via API:", error);
        }
    }
  }

  private _getAdminUser(): User {
      return {
        id: 'ADMIN-001',
        username: 'admin',
        passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@jksoft.com',
        role: 'Administrator',
        status: 'Active',
        department: 'IT',
        jobTitle: 'Super User',
        location: 'HQ',
        twoFactorEnabled: true,
        forcePasswordChange: false,
        createdDate: new Date('2023-01-01'),
        createdBy: 'System',
        lastLogin: new Date(),
        avatarUrl: 'https://ui-avatars.com/api/?name=System+Admin&background=137fec&color=fff',
        recentActivity: [],
        sessions: []
      };
  }

  private _generateDummyUsers(count: number): any[] {
    const users = [];
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'Thomas', 'Sarah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez'];
    const roles: UserRole[] = ['Administrator', 'Manager', 'User', 'Viewer'];
    const depts = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations'];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const department = depts[Math.floor(Math.random() * depts.length)];
        
        users.push({
            firstName,
            lastName,
            username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random()*100)}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@corporate.com`,
            role,
            status: Math.random() > 0.1 ? 'Active' : 'Inactive',
            department,
            jobTitle: `${department} Specialist`,
            location: 'San Francisco, CA',
            twoFactorEnabled: Math.random() > 0.5,
            forcePasswordChange: Math.random() > 0.9,
            passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // Default admin123 for dummy users
            avatarUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date(),
            lastLogin: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
            sessions: this._generateMockSessions()
        });
    }
    return users;
  }

  private _generateMockUsers(): User[] {
    const admin = this._getAdminUser();
    
    return [
      admin,
      {
        id: '88291',
        username: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@corporate.com',
        role: 'Administrator',
        status: 'Active',
        department: 'Engineering',
        jobTitle: 'Senior Engineer',
        location: 'San Francisco, CA',
        twoFactorEnabled: true,
        forcePasswordChange: false,
        passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
        createdDate: new Date('2023-10-12'),
        createdBy: 'System',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), 
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        recentActivity: this._generateMockLogs(),
        sessions: [
            {
              id: 'sess_1',
              deviceType: 'Desktop',
              deviceName: 'macOS Desktop App',
              deviceDetail: 'Version 2.4.1',
              ipAddress: '192.168.1.42',
              createdDate: new Date('2023-10-12T10:00:00'),
              lastUsedDate: new Date(), 
              status: 'Active'
            }
        ]
      }
    ];
  }

  private _generateMockSessions(): UserSession[] {
      return [
          {
              id: 'sess_1',
              deviceType: 'Desktop',
              deviceName: 'macOS Desktop App',
              deviceDetail: 'Version 2.4.1',
              ipAddress: '192.168.1.42',
              createdDate: new Date('2023-10-12T10:00:00'),
              lastUsedDate: new Date(),
              status: 'Active'
          }
      ];
  }

  private _generateMockLogs(): LoginLog[] {
      return [
          { id: 1, timestamp: new Date('2024-03-12T08:22:00'), ipAddress: '192.168.1.45', device: 'Chrome / macOS', location: 'San Francisco, US', status: 'Success' },
          { id: 2, timestamp: new Date('2024-03-11T06:15:00'), ipAddress: '192.168.1.45', device: 'Chrome / macOS', location: 'San Francisco, US', status: 'Success' },
          { id: 3, timestamp: new Date('2024-03-10T09:10:00'), ipAddress: '104.24.12.98', device: 'Safari / iPhone', location: 'Palo Alto, US', status: 'Success' },
          { id: 4, timestamp: new Date('2024-03-08T11:45:00'), ipAddress: '203.0.113.1', device: 'Firefox / Windows', location: 'New York, US', status: 'Failed' },
      ];
  }
}
