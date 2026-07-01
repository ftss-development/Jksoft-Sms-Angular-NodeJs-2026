
import { Department } from './department.model';

export type SubDepartmentStatus = 'Active' | 'Inactive';

export interface CompanyMapping {
    id: number;
    entityName: string;
    costCenter: string;
    allocation: number; // percentage
}

export interface SubDepartmentAudit {
    id: number;
    action: string;
    actor: string;
    timestamp: Date;
    description?: string;
    icon: string; // Material symbol name
}

export interface SubDepartment {
    id: string;
    name: string;
    shortName: string;
    parentDepartmentId: string;
    parentDepartmentName?: string; // For display
    status: SubDepartmentStatus;
    
    // Details
    region?: string;
    description?: string;
    
    // Mappings
    companyMappings?: CompanyMapping[];
    
    // Audit
    auditTimeline: SubDepartmentAudit[];
    createdBy: string;
    createdDate: Date;
    updatedBy?: string;
    lastUpdated?: Date;
}
