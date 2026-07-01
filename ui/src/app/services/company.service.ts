import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Company, CompanyStatus } from '../models/company.model';



@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/companies';
  private readonly _companies = signal<Company[]>([]);
  private readonly collectionName = 'companies';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._companies.set(this._generateMockCompanies());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      if (snapshot.length === 0) {
        this._seedData();
        return;
      }
      const companies: Company[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        companies.push({
          ...data,
          id: doc.id,
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      this._companies.set(companies);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._companies().length === 0) {
            this._companies.set(this._generateMockCompanies());
        }
    }
    });
  }

  get companies() {
    return this._companies.asReadonly();
  }

  getCompanyById(id: string): Company | undefined {
    return this._companies().find(c => c.id === id);
  }

  async addCompany(company: Omit<Company, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const newCompany = {
      ...company,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newCompany));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._companies.update(current => [...current, { ...newCompany, id: mockId } as Company]);
    }
  }

  async updateCompany(company: Company): Promise<void> {
    const dataToUpdate = {
        ...company,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${company.id}`, firestoreData));
    } else {
        this._companies.update(current => 
            current.map(c => c.id === company.id ? { ...company, ...firestoreData } as Company : c)
        );
    }
  }

  async deleteCompany(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._companies.update(current => current.filter(c => c.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyCompanies(100);
    
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._companies();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as Company));
        this._companies.set([...current, ...newItems]);
    }
  }

  private _generateDummyCompanies(count: number): any[] {
    const companies = [];
    const prefixes = ['Global', 'Tech', 'Apex', 'Blue', 'Red', 'Green', 'First', 'Prime', 'United', 'Silver', 'Golden', 'Royal', 'Future', 'Smart'];
    const roots = ['Logistics', 'Solutions', 'Systems', 'Ventures', 'Industries', 'Holdings', 'Group', 'Corp', 'Inc', 'Enterprises', 'Technologies', 'Innovations', 'Consulting'];
    const cities = ['New York', 'San Francisco', 'Chicago', 'Austin', 'Seattle', 'Boston', 'Denver', 'Miami', 'Atlanta', 'Dallas'];
    
    for (let i = 0; i < count; i++) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const root = roots[Math.floor(Math.random() * roots.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const suffix = Math.floor(Math.random() * 1000);
        
        const companyName = `${prefix} ${root} ${suffix}`;
        const shortName = `${prefix.charAt(0)}${root.charAt(0)}${suffix}`.toUpperCase();
        const cin = `U${Math.floor(Math.random() * 99999)}${shortName.substring(0,2)}202${Math.floor(Math.random()*4)}PLC${Math.floor(Math.random() * 999999)}`;
        
        const statuses: CompanyStatus[] = ['Active', 'Inactive', 'Pending'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        companies.push({
            companyName,
            shortName,
            cin,
            status,
            companyLevel: 'Subsidiary',
            parentCompanyName: `${prefix} Holdings Group`,
            addressLine1: `${Math.floor(Math.random() * 999) + 1} Business Park`,
            country: 'United States',
            state: 'California', // Simplified for dummy data
            city,
            pinCode: `${10000 + Math.floor(Math.random() * 90000)}`,
            email: `contact@${shortName.toLowerCase()}.com`,
            phone: `+1 (555) ${Math.floor(Math.random() * 899) + 100}-${Math.floor(Math.random() * 8999) + 1000}`,
            gstNo: `GST${Math.floor(Math.random() * 100000)}Z5`,
            panNo: `${shortName.substring(0,3)}DE${Math.floor(Math.random() * 9999)}F`,
            financialYearCycle: 'April to March',
            businessLicenseNo: `LIC-${Math.floor(Math.random() * 999999)}`,
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return companies;
  }

  private async _seedData() {
    
    const mockData = this._generateMockCompanies();
    const batch = { commit: async () => {}, set: (ref, data) => {}, update: (ref, data) => {}, delete: (ref) => {} };
    mockData.forEach(item => {
      const docRef = `${this.apiUrl}/item.id`;
      batch.set(docRef, item);
    });
    await batch.commit();
  }

  private _generateMockCompanies(): Company[] {
    return [
      {
        id: '1',
        companyName: 'Global Logistics Corp',
        shortName: 'GLC',
        cin: 'U12345MH2020PLC123456',
        status: 'Active',
        companyLevel: 'Holding Company',
        parentCompanyName: 'Global Holdings Ltd',
        addressLine1: '123 Harbor Blvd',
        country: 'United States',
        state: 'New York',
        city: 'New York',
        pinCode: '10001',
        email: 'contact@globallogistics.com',
        phone: '+1 (555) 123-4567',
        gstNo: 'GSTIN12345AB',
        panNo: 'ABCDE1234F',
        financialYearCycle: 'April to March',
        businessLicenseNo: 'LIC-9988-7766',
        createdBy: 'System Admin',
        createdDate: new Date('2023-01-15'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-01-20')
      },
      {
        id: '2',
        companyName: 'Stellar Tech Solutions',
        shortName: 'STS',
        cin: 'U98765DL2021PLC987654',
        status: 'Pending',
        companyLevel: 'Subsidiary',
        parentCompanyName: 'N/A',
        addressLine1: '456 Innovation Dr',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        pinCode: '94105',
        email: 'info@stellartech.io',
        phone: '+1 (555) 987-6543',
        gstNo: 'GSTIN98765ZY',
        panNo: 'VWXYZ9876G',
        financialYearCycle: 'January to December',
        businessLicenseNo: 'LIC-1122-3344',
        createdBy: 'Manager',
        createdDate: new Date('2023-03-10'),
        updatedBy: 'Manager',
        lastUpdated: new Date('2023-03-10')
      },
      {
        id: '3',
        companyName: 'Apex Marketing Agency',
        shortName: 'AMA',
        cin: 'U55667CA2019PLC554433',
        status: 'Inactive',
        companyLevel: 'Associate',
        parentCompanyName: 'Summit Group',
        addressLine1: '789 Market St',
        country: 'United States',
        state: 'Illinois',
        city: 'Chicago',
        pinCode: '60601',
        email: 'hello@apexmarketing.com',
        phone: '+1 (555) 456-7890',
        gstNo: 'GSTIN55443MN',
        panNo: 'PQRST5678H',
        financialYearCycle: 'April to March',
        businessLicenseNo: 'LIC-5544-3322',
        createdBy: 'System',
        createdDate: new Date('2022-11-20'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-05-15')
      },
      {
        id: '4',
        companyName: 'Blue Horizon Ventures',
        shortName: 'BHV',
        cin: 'U33221TX2022PLC112233',
        status: 'Active',
        companyLevel: 'Holding Company',
        parentCompanyName: 'N/A',
        addressLine1: '101 Startup Way',
        country: 'United States',
        state: 'Texas',
        city: 'Austin',
        pinCode: '73301',
        email: 'invest@bluehorizon.vc',
        phone: '+1 (555) 222-3333',
        gstNo: 'GSTIN11223KL',
        panNo: 'LMNOP1234J',
        financialYearCycle: 'January to December',
        businessLicenseNo: 'LIC-8899-0011',
        createdBy: 'Admin',
        createdDate: new Date('2023-06-01'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-08-20')
      }
    ];
  }
}
