
import { Injectable, signal } from '@angular/core';
import { Amplifier, AmplifierStatus } from '../models/amplifier.model';

@Injectable({
  providedIn: 'root'
})
export class AmplifierService {
  private readonly _amplifiers = signal<Amplifier[]>([]);
  private _nextId = signal(1);

  constructor() {
    this._amplifiers.set(this._generateMockAmplifiers());
    const maxId = Math.max(...this._amplifiers().map(a => a.id), 0);
    this._nextId.set(maxId + 1);
  }

  get amplifiers() {
    return this._amplifiers.asReadonly();
  }

  getAmplifierById(id: number): Amplifier | undefined {
    return this._amplifiers().find(a => a.id === id);
  }

  addAmplifier(amplifier: Omit<Amplifier, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): void {
    const newId = this._nextId();
    const newAmplifier: Amplifier = {
      ...amplifier,
      id: newId,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };
    this._amplifiers.update(current => [newAmplifier, ...current]);
    this._nextId.update(id => id + 1);
  }

  updateAmplifier(amplifier: Amplifier): void {
    this._amplifiers.update(current => 
      current.map(a => a.id === amplifier.id ? { ...amplifier, updatedBy: 'System Admin', lastUpdated: new Date() } : a)
    );
  }

  deleteAmplifier(id: number): void {
    this._amplifiers.update(current => current.filter(a => a.id !== id));
  }

  private _generateMockAmplifiers(): Amplifier[] {
    return [
      {
        id: 1,
        name: 'AMP-ZONE-01',
        description: 'Main Distribution Hub',
        serialNumber: '#8821-XQ-90',
        model: 'XG-2000 Pro',
        status: 'Active',
        zone: 'Zone A',
        location: 'Server Room 1',
        installDate: new Date('2023-01-15'),
        ipAddress: '192.168.1.101',
        firmwareVersion: 'v2.4.1',
        createdBy: 'Admin',
        createdDate: new Date('2023-01-15T09:00:00'),
        updatedBy: 'Tech Lead',
        lastUpdated: new Date('2023-06-10T14:20:00')
      },
      {
        id: 2,
        name: 'North-Wing-Repeater',
        description: 'Building B, Level 4',
        serialNumber: '#9901-TR-12',
        model: 'SignalMax 500',
        status: 'Inactive',
        zone: 'Zone B',
        location: 'Building B - L4 Corridor',
        installDate: new Date('2023-03-22'),
        ipAddress: '192.168.1.150',
        firmwareVersion: 'v1.0.9',
        createdBy: 'Installer Mike',
        createdDate: new Date('2023-03-22T11:00:00'),
        updatedBy: 'Installer Mike',
        lastUpdated: new Date('2023-03-22T11:00:00')
      },
      {
        id: 3,
        name: 'High-Gain-77',
        description: 'Outdoor Array S3',
        serialNumber: '#4412-LK-01',
        model: 'OmniBeam HG',
        status: 'Active',
        zone: 'Exterior North',
        location: 'Rooftop Mast 3',
        installDate: new Date('2022-11-05'),
        ipAddress: '192.168.2.45',
        firmwareVersion: 'v3.0.0',
        createdBy: 'Admin',
        createdDate: new Date('2022-11-05T08:30:00'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-09-15T10:00:00')
      },
      {
        id: 4,
        name: 'South-Hub-Main',
        description: 'Underground Comms',
        serialNumber: '#1109-WW-44',
        model: 'SubTerra X1',
        status: 'Active',
        zone: 'Zone C',
        location: 'Basement Level 2',
        installDate: new Date('2023-05-18'),
        ipAddress: '192.168.1.200',
        firmwareVersion: 'v2.1.5',
        createdBy: 'Admin',
        createdDate: new Date('2023-05-18T13:45:00'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-08-01T09:15:00')
      }
    ];
  }
}
