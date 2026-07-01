import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { BankAccount, BankAccountAudit, AccountType } from '../models/bank-account.model';



@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/bank_accounts';
  private readonly _bankAccounts = signal<BankAccount[]>([]);
  private readonly collectionName = 'bank_accounts';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._bankAccounts.set(this._generateMockBankAccounts());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const accounts: BankAccount[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        
        const timeline = (data.auditTimeline || []).map((item: any) => ({
            ...item,
            timestamp: item.timestamp?.toDate ? item.timestamp.toDate() : new Date(item.timestamp)
        }));

        accounts.push({
          ...data,
          id: doc.id,
          auditTimeline: timeline,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      this._bankAccounts.set(accounts);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._bankAccounts().length === 0) {
            this._bankAccounts.set(this._generateMockBankAccounts());
        }
    }
    });
  }

  get bankAccounts() {
    return this._bankAccounts.asReadonly();
  }

  getAccountById(id: string): BankAccount | undefined {
    return this._bankAccounts().find(a => a.id === id);
  }

  getAccountsByBankId(bankId: string): BankAccount[] {
    return this._bankAccounts().filter(a => a.bankId === bankId);
  }

  async addBankAccount(account: Omit<BankAccount, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTimeline' | 'status'>): Promise<void> {
    const newAccount: Partial<BankAccount> = {
      ...account,
      status: 'Pending',
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date(),
      auditTimeline: [
        { action: 'Account Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial registration by System Admin' }
      ]
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newAccount));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._bankAccounts.update(current => [...current, { ...newAccount, id: mockId } as BankAccount]);
    }
  }

  async updateBankAccount(account: BankAccount): Promise<void> {
    const updatedTimeline = [
        { action: 'Updated', actor: 'System Admin', timestamp: new Date(), description: 'Account details modified' },
        ...account.auditTimeline
    ];

    const dataToUpdate = {
        ...account,
        auditTimeline: updatedTimeline,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${account.id}`, firestoreData));
    } else {
        this._bankAccounts.update(current => 
            current.map(a => a.id === account.id ? { ...account, ...firestoreData } as BankAccount : a)
        );
    }
  }

  async deleteBankAccount(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._bankAccounts.update(current => current.filter(a => a.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyBankAccounts(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._bankAccounts();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as BankAccount));
        this._bankAccounts.set([...current, ...newItems]);
    }
  }

  private _generateDummyBankAccounts(count: number): any[] {
    const accounts = [];
    const accountTypes: AccountType[] = ['Checking', 'Savings', 'Investment', 'Escrow', 'Overdraft'];
    const purposes = ['Operating', 'Payroll', 'Expense', 'Reserve', 'Tax', 'Settlement', 'Client Funds', 'Development'];
    
    for (let i = 0; i < count; i++) {
        const purpose = purposes[Math.floor(Math.random() * purposes.length)];
        const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
        const suffix = Math.floor(Math.random() * 100);
        
        const accountName = `${purpose} Account ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${suffix}`;
        const accountNumber = Math.floor(Math.random() * 10000000000000000).toString().padStart(16, '0');
        const bankId = (Math.floor(Math.random() * 4) + 1).toString(); 
        
        const isActive = Math.random() > 0.1;
        const status = isActive ? 'Active & Verified' : (Math.random() > 0.5 ? 'Pending' : 'Inactive');

        accounts.push({
            accountName,
            accountNumber,
            bankId,
            branchName: `Branch-${Math.floor(Math.random() * 999)}`,
            accountType,
            companyId: (Math.floor(Math.random() * 4) + 1).toString(),
            isDefault: Math.random() > 0.9,
            isActive: isActive,
            ifscCode: `BANK000${Math.floor(Math.random() * 10000)}`,
            swiftCode: `BANKUS${Math.floor(Math.random() * 99)}`,
            micrCode: `${Math.floor(Math.random() * 100000000)}`,
            merchantName: `MERCH_${Math.floor(Math.random() * 1000)}`,
            currency: 'USD',
            balance: Math.floor(Math.random() * 1000000),
            status,
            auditTimeline: [
                { action: 'Account Created', actor: 'System Seed', timestamp: new Date(), description: 'Bulk data generation' }
            ],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return accounts;
  }

  private async _seedData() {
    
    const mockData = this._generateMockBankAccounts();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockBankAccounts(): BankAccount[] {
    return [
      {
        id: '1',
        accountName: 'Operating Account - NY',
        accountNumber: '9876543210988820',
        bankId: '1', // Bank of Nova Scotia
        branchName: 'New York - Wall Street Branch',
        accountType: 'Current', // Using Current based on Screenshot
        companyId: '1', 
        isDefault: true,
        isActive: true,
        ifscCode: 'CHAS0001928',
        swiftCode: 'CHASUS33XXX',
        micrCode: '110002003',
        merchantName: 'GL_OPS_MAIN',
        currency: 'USD',
        balance: 1240500.00,
        status: 'Active',
        createdBy: 'Admin User',
        createdDate: new Date('2024-10-12T09:15:00'),
        updatedBy: 'Jane Doe',
        lastUpdated: new Date('2024-10-24T14:30:00'),
        auditTimeline: []
      },
      {
        id: '2',
        accountName: 'Payroll Reserve',
        accountNumber: '4455667788994412',
        bankId: '1', // Bank of Nova Scotia
        branchName: 'Charlotte HQ',
        accountType: 'Savings',
        companyId: '1',
        isDefault: false,
        isActive: true,
        ifscCode: 'WFB0000555',
        swiftCode: 'WFBUS66',
        micrCode: '550240099',
        currency: 'USD',
        balance: 450000.00,
        status: 'Active',
        createdBy: 'HR Manager',
        createdDate: new Date('2023-11-20T10:00:00'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-11-20T10:00:00'),
        auditTimeline: []
      },
      {
        id: '3',
        accountName: 'Tax Collection Escrow',
        accountNumber: '1122334455669901',
        bankId: '1', // Bank of Nova Scotia
        branchName: 'London - Canary Wharf',
        accountType: 'Escrow',
        companyId: '2', 
        isDefault: false,
        isActive: false, // Pending in screenshot
        ifscCode: 'HSBC0000999',
        swiftCode: 'HSBCGB2L',
        micrCode: '990240088',
        currency: 'USD',
        balance: 12840.50,
        status: 'Pending',
        createdBy: 'Finance Team',
        createdDate: new Date('2023-05-15T11:45:00'),
        auditTimeline: []
      }
    ];
  }
}
