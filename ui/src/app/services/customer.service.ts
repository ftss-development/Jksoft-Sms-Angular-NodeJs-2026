
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Customer, CustomersAddress, CustomersContact, Status } from '../models/customer.model';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/customers';
  private readonly _customers = signal<Customer[]>([]);
  private readonly collectionName = 'customers';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      // Fallback to mock data if DB is not available
      this._customers.set(this._generateFallbackMockData());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const customers: Customer[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        customers.push({
          ...data,
          customerId: doc.id,
          dateOfInstallation: data.dateOfInstallation?.toDate ? data.dateOfInstallation.toDate() : new Date(data.dateOfInstallation),
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      
      if (customers.length === 0) {
        this._seedData();
      } else {
        this._customers.set(customers);
      }
    },
      error: (error) => {
        console.error("Firestore error:", error);
        // Fallback on error
        if (this._customers().length === 0) {
            this._customers.set(this._generateFallbackMockData());
        }
    }
    });
  }

  get customers() {
    return this._customers.asReadonly();
  }

  getCustomerById(id: string): Customer | undefined {
    return this._customers().find(c => c.customerId === id);
  }

  async addCustomer(newCustomer: Omit<Customer, 'customerId' | 'status' | 'salutation' | 'subscriberType' | 'company' | 'gstMode' | 'connectionType' | 'technicalInCharge' | 'collectionInCharge' | 'createdBy' | 'createdDate' | 'updatedBy' | 'lastUpdated'>): Promise<void> {
    const status = this.mockStatuses.find(s => s.statusId === newCustomer.statusId);
    const salutation = this.mockSalutations.find(s => s.salutationId === newCustomer.salutationId);
    const subscriberType = this.mockSubscriberTypes.find(s => s.subscriberTypeId === newCustomer.subscriberTypeId);
    const company = this.mockCompanies.find(c => c.id === newCustomer.companyId);
    const gstMode = this.mockGstModes.find(g => g.gstModeId === newCustomer.gstModeId);
    const connectionType = this.mockConnectionTypes.find(c => c.connectionTypeId === newCustomer.connectionTypeId);

    const customerData = {
      ...newCustomer,
      customersAddress: { ...newCustomer.customersAddress, customersAddressId: 1, statusId: 1 },
      customersContact: { ...newCustomer.customersContact, customersContactId: 1, statusId: 1 },
      status: status,
      salutation: salutation,
      subscriberType: subscriberType,
      company: company,
      gstMode: gstMode,
      connectionType: connectionType,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date(),
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, customerData));
    } else {
        // Local mock update
        const mockId = (Math.random() * 10000).toString();
        this._customers.update(current => [...current, { ...customerData, customerId: mockId } as Customer]);
    }
  }

  async updateCustomer(updatedCustomer: Customer): Promise<void> {
    const updatedStatus = this.mockStatuses.find(s => s.statusId === updatedCustomer.statusId);
    const salutation = this.mockSalutations.find(s => s.salutationId === updatedCustomer.salutationId);
    const subscriberType = this.mockSubscriberTypes.find(s => s.subscriberTypeId === updatedCustomer.subscriberTypeId);
    const company = this.mockCompanies.find(c => c.id === updatedCustomer.companyId);
    const gstMode = this.mockGstModes.find(g => g.gstModeId === updatedCustomer.gstModeId);
    const connectionType = this.mockConnectionTypes.find(c => c.connectionTypeId === updatedCustomer.connectionTypeId);

    const dataToUpdate = {
        ...updatedCustomer,
        status: updatedStatus,
        salutation: salutation,
        subscriberType: subscriberType,
        company: company,
        gstMode: gstMode,
        connectionType: connectionType,
        updatedBy: 'John Doe',
        lastUpdated: new Date()
    };

    if (true) {
        const docRef = `${this.apiUrl}/updatedCustomer.customerId`;
        // Clean undefined fields if any, or just update what's needed
        // For simplicity in this demo, we're not filtering strictly
        const { customerId, ...firestoreData } = dataToUpdate; 
        await lastValueFrom(this.http.put(docRef, firestoreData));
    } else {
        this._customers.update(current => 
            current.map(c => c.customerId === updatedCustomer.customerId ? dataToUpdate : c)
        );
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    if (true) {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
      this._customers.update(current => current.filter(c => c.customerId !== id));
    }
  }

  // Mock data for dropdowns
  mockStatuses: Status[] = [
    { statusId: 1, type: 'Active', statusFor: 'Customer' },
    { statusId: 2, type: 'Inactive', statusFor: 'Customer' },
    { statusId: 3, type: 'Pending', statusFor: 'Customer' },
  ];

  mockCompanies = [
    { id: 1, companyName: 'Global Corp' },
    { id: 2, companyName: 'Tech Solutions' },
    { id: 3, companyName: 'Innovate Ltd' },
  ];

  mockSalutations = [
    { salutationId: 1, salutationType: 'Mr.' },
    { salutationId: 2, salutationType: 'Ms.' },
    { salutationId: 3, salutationType: 'Mrs.' },
  ];

  mockSubscriberTypes = [
    { subscriberTypeId: 1, type: 'Residential' },
    { subscriberTypeId: 2, type: 'Business' },
  ];

  mockGstModes = [
    { gstModeId: 1, type: 'Regular' },
    { gstModeId: 2, type: 'Composition' },
  ];

  mockConnectionTypes = [
    { connectionTypeId: 1, type: 'Fiber Optic' },
    { connectionTypeId: 2, type: 'DSL' },
  ];

  private async _seedData() {
    
    const mockCustomers = this._generateFallbackMockData();
    for (const c of mockCustomers) {
      // Remove ID for Firestore auto-gen if desired, or use setDoc with specific ID.
      // Here we let Firestore gen ID.
      const { customerId, ...data } = c;
      await lastValueFrom(this.http.post(this.apiUrl, data));
    }
  }

  private _generateFallbackMockData(): Customer[] {
      return [
        {
          customerId: '1',
          accountNo: 'ACC001',
          salutationId: 1,
          salutation: this.mockSalutations[0],
          subscriberTypeId: 1,
          subscriberType: this.mockSubscriberTypes[0],
          firstName: 'John',
          middleName: '',
          lastName: 'Doe',
          areInstallationBillingAddressSame: true,
          dateOfInstallation: new Date('2023-01-15'),
          gstNo: 'GSTIN12345',
          panNo: 'PANABC123',
          aadhaarNo: 'AADHAAR123',
          msoNo: 'MSO001',
          companyId: 1,
          company: this.mockCompanies[0],
          gstModeId: 1,
          gstMode: this.mockGstModes[0],
          connectionTypeId: 1,
          connectionType: this.mockConnectionTypes[0],
          remark: 'Initial setup',
          statusId: 1,
          status: this.mockStatuses[0],
          customersAddress: {
            customersAddressId: 1,
            areaId: 1, districtId: 1, colonyId: 1, cityId: 1, stateId: 1,
            address1: '123 Main St',
            address2: 'Apt 4B',
            address3: '',
            pinCode: '90210',
            statusId: 1,
          },
          customersContact: {
            customersContactId: 1,
            mobileNo1: '123-456-7890',
            emailId1: 'john.doe@example.com',
            telephoneNo1: '', telephoneNo2: '', telephoneNo3: '',
            mobileNo2: '', mobileNo3: '',
            emailId2: '',
            statusId: 1,
          },
          createdBy: 'System Admin',
          createdDate: new Date('2023-01-10T09:00:00'),
          updatedBy: 'John Doe',
          lastUpdated: new Date('2024-03-01T10:00:00'),
        },
        {
            customerId: '2',
            accountNo: 'ACC002',
            salutationId: 2,
            salutation: this.mockSalutations[1],
            subscriberTypeId: 1,
            subscriberType: this.mockSubscriberTypes[0],
            firstName: 'Sarah',
            middleName: '',
            lastName: 'Connor',
            areInstallationBillingAddressSame: true,
            dateOfInstallation: new Date('2023-02-20'),
            gstNo: 'GSTIN99999',
            panNo: 'PANXYZ789',
            aadhaarNo: 'AADHAAR456',
            msoNo: 'MSO002',
            companyId: 1,
            company: this.mockCompanies[0],
            gstModeId: 1,
            gstMode: this.mockGstModes[0],
            connectionTypeId: 1,
            connectionType: this.mockConnectionTypes[0],
            remark: 'VIP Customer',
            statusId: 1,
            status: this.mockStatuses[0],
            customersAddress: {
              customersAddressId: 2,
              areaId: 1, districtId: 1, colonyId: 1, cityId: 1, stateId: 1,
              address1: '456 Cyberdyne Ave',
              address2: '',
              address3: '',
              pinCode: '90001',
              statusId: 1,
            },
            customersContact: {
              customersContactId: 2,
              mobileNo1: '987-654-3210',
              emailId1: 'sarah.connor@example.com',
              telephoneNo1: '', telephoneNo2: '', telephoneNo3: '',
              mobileNo2: '', mobileNo3: '',
              emailId2: '',
              statusId: 1,
            },
            createdBy: 'System Admin',
            createdDate: new Date('2023-02-15T10:00:00'),
            updatedBy: 'System Admin',
            lastUpdated: new Date('2023-02-20T11:00:00'),
          }
      ];
  }
}
