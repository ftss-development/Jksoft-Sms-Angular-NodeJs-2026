
import { Injectable, signal } from '@angular/core';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private readonly _channels = signal<Channel[]>([]);
  private _nextId = signal(1);

  constructor() {
    this._channels.set(this._generateMockChannels());
    const maxId = Math.max(...this._channels().map(c => c.id), 0);
    this._nextId.set(maxId + 1);
  }

  get channels() {
    return this._channels.asReadonly();
  }

  getChannelById(id: number): Channel | undefined {
    return this._channels().find(c => c.id === id);
  }

  addChannel(channel: Omit<Channel, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated'>): void {
    const newId = this._nextId();
    const newChannel: Channel = {
      ...channel,
      id: newId,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date()
    };
    this._channels.update(current => [newChannel, ...current]);
    this._nextId.update(id => id + 1);
  }

  updateChannel(channel: Channel): void {
    this._channels.update(current => 
      current.map(c => c.id === channel.id ? { ...channel, updatedBy: 'System Admin', lastUpdated: new Date() } : c)
    );
  }

  deleteChannel(id: number): void {
    this._channels.update(current => current.filter(c => c.id !== id));
  }

  private _generateMockChannels(): Channel[] {
    return [
      {
        id: 1,
        name: 'Star Sports 1',
        code: 'CH-001',
        category: 'Sports',
        language: 'English',
        basePrice: 19.00,
        isHD: true,
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-15T10:00:00'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-15T10:00:00')
      },
      {
        id: 2,
        name: 'HBO Movies',
        code: 'CH-005',
        category: 'Movies',
        language: 'English',
        basePrice: 25.00,
        isHD: true,
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-02-20T11:30:00'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-02-20T11:30:00')
      },
      {
        id: 3,
        name: 'Discovery Channel',
        code: 'CH-012',
        category: 'Infotainment',
        language: 'English',
        basePrice: 10.00,
        isHD: false,
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-03-10T09:15:00'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-04-05T14:20:00')
      },
      {
        id: 4,
        name: 'Cartoon Network',
        code: 'CH-025',
        category: 'Kids',
        language: 'English',
        basePrice: 12.00,
        isHD: false,
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2023-01-25T16:00:00'),
        updatedBy: 'System',
        lastUpdated: new Date('2023-01-25T16:00:00')
      },
      {
        id: 5,
        name: 'CNN News',
        code: 'CH-099',
        category: 'News',
        language: 'English',
        basePrice: 5.00,
        isHD: true,
        isActive: false, // Inactive example
        createdBy: 'System',
        createdDate: new Date('2023-06-01T08:00:00'),
        updatedBy: 'Admin',
        lastUpdated: new Date('2023-11-15T12:00:00')
      }
    ];
  }
}
