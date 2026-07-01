
export type UserRole = 'Administrator' | 'Manager' | 'User' | 'Viewer';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Pending';

export interface LoginLog {
  id: number;
  timestamp: Date;
  ipAddress: string;
  device: string;
  location: string;
  status: 'Success' | 'Failed';
}

export interface UserSession {
  id: string;
  deviceType: 'Desktop' | 'Mobile' | 'Web';
  deviceName: string; // e.g., macOS Desktop
  deviceDetail?: string; // e.g., Version 2.4.1
  ipAddress: string;
  createdDate: Date;
  lastUsedDate: Date;
  status: 'Active' | 'Revoked';
}

export interface User {
  id: string;
  username: string;
  passwordHash?: string; // SHA-256 Hash
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  
  // Profile Extras
  department?: string;
  jobTitle?: string;
  location?: string;
  phone?: string;
  avatarUrl?: string;

  // Security
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  forcePasswordChange?: boolean;
  
  // Audit
  createdDate: Date;
  createdBy: string;
  updatedBy?: string;
  lastUpdated?: Date;

  // Mock Data for Detail View
  recentActivity?: LoginLog[];
  sessions?: UserSession[];
}
