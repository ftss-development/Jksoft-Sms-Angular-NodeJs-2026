
export type AuditSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AuditCategory = 'Security' | 'User Management' | 'Data Change' | 'System';

export interface AuditLog {
  id: string;
  timestamp: Date;
  actorName: string;
  actorRole: string;
  action: string;
  module: string;
  description: string;
  ipAddress: string;
  severity: AuditSeverity;
  category: AuditCategory;
  metadata?: Record<string, any>;
}
