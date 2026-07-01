
import { Injectable, signal } from '@angular/core';
import { Package, PackageChannel } from '../models/package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private readonly _packages = signal<Package[]>([]);
  private _nextId = signal(1);

  constructor() {
    this._packages.set(this._generateMockPackages());
    const maxId = Math.max(...this._packages().map(p => p.id), 0);
    this._nextId.set(maxId + 1);
  }

  get packages() {
    return this._packages.asReadonly();
  }

  getPackageById(id: number): Package | undefined {
    return this._packages().find(p => p.id === id);
  }

  addPackage(pkg: Omit<Package, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'activeCustomers' | 'pendingEnquiries'>): void {
    const newId = this._nextId();
    const newPackage: Package = {
      ...pkg,
      id: newId,
      activeCustomers: 0,
      pendingEnquiries: 0,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };
    this._packages.update(current => [newPackage, ...current]);
    this._nextId.update(id => id + 1);
  }

  updatePackage(pkg: Package): void {
    this._packages.update(current => 
      current.map(p => p.id === pkg.id ? { ...pkg, updatedBy: 'System Admin', lastUpdated: new Date() } : p)
    );
  }

  deletePackage(id: number): void {
    this._packages.update(current => current.filter(p => p.id !== id));
  }

  private _generateMockPackages(): Package[] {
    return [
      {
        id: 1,
        packageName: 'Super Saver Family Pack',
        packageShortName: 'SSF_PACK_01',
        packageGrade: 'Premium',
        description: 'Includes top entertainment channels and regional news.',
        serviceCategoryType: 'Broadband Internet',
        msoOrBroadcaster: 'Global Networks Ltd.',
        packageCreationDate: new Date('2023-01-15'),
        isActive: true,
        isTaxInclusive: true,
        baseRate: 45.00,
        taxPercentage: 18,
        totalAmount: 53.10,
        drp: 48.00,
        mrp: 60.00,
        mappedChannels: [
          { id: 3, name: 'Discovery Channel', category: 'Infotainment', language: 'English' },
          { id: 1, name: 'Star Sports 1', category: 'Sports', language: 'Hindi' },
          { id: 2, name: 'HBO HD', category: 'Movies', language: 'English' }
        ],
        activeCustomers: 1245,
        pendingEnquiries: 34,
        createdBy: 'John Doe',
        createdDate: new Date('2023-01-15T09:30:00'),
        updatedBy: 'Alice Smith',
        lastUpdated: new Date('2023-10-27T14:45:00')
      },
      {
        id: 2,
        packageName: 'Basic Sports Pack',
        packageShortName: 'BSP_002',
        packageGrade: 'Basic',
        description: 'Entry level sports package.',
        serviceCategoryType: 'Cable TV',
        msoOrBroadcaster: 'Local Cable',
        packageCreationDate: new Date('2023-03-10'),
        isActive: true,
        isTaxInclusive: false,
        baseRate: 20.00,
        taxPercentage: 10,
        totalAmount: 22.00,
        drp: 21.00,
        mrp: 25.00,
        mappedChannels: [
          { id: 1, name: 'Star Sports 1', category: 'Sports', language: 'Hindi' }
        ],
        activeCustomers: 850,
        pendingEnquiries: 12,
        createdBy: 'Admin',
        createdDate: new Date('2023-03-10T10:00:00'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-03-10T10:00:00')
      }
    ];
  }
}
