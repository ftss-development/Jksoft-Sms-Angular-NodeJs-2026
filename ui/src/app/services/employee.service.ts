
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Employee, EmployeeStatus } from '../models/employee.model';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jksoft-sms-angular-nodejs-2026.onrender.com/api/employees';
  private readonly _employees = signal<Employee[]>([]);
  private readonly collectionName = 'employees';

  constructor() {
    if (true) {
      this._initializeRealtimeSync();
    } else {
      this._employees.set(this._generateMockEmployees());
    }
  }

  private _initializeRealtimeSync() {
    
    
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (snapshot) => {
      const employees: Employee[] = [];
      snapshot.forEach((itemData) => { const doc = { id: itemData.id, data: () => itemData }; const data = doc.data() as any;
        
        // Handle dates
        const timeline = (data.auditTimeline || []).map((item: any) => ({
            ...item,
            timestamp: item.timestamp?.toDate ? item.timestamp.toDate() : new Date(item.timestamp)
        }));

        employees.push({
          ...data,
          id: doc.id,
          auditTimeline: timeline,
          joiningDate: data.joiningDate?.toDate ? data.joiningDate.toDate() : new Date(data.joiningDate),
          createdDate: data.createdDate?.toDate ? data.createdDate.toDate() : new Date(data.createdDate),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)
        });
      });
      this._employees.set(employees);
    },
      error: (error) => {
        console.error("Firestore error:", error);
        if (this._employees().length === 0) {
            this._employees.set(this._generateMockEmployees());
        }
    }
    });
  }

  get employees() {
    return this._employees.asReadonly();
  }

  getEmployeeById(id: string): Employee | undefined {
    return this._employees().find(e => e.id === id);
  }

  getDirectReports(managerId: string): Employee[] {
    return this._employees().filter(e => e.reportingManagerId === managerId);
  }

  async addEmployee(employee: Omit<Employee, 'id' | 'createdDate' | 'createdBy' | 'updatedBy' | 'lastUpdated' | 'auditTimeline'>): Promise<void> {
    const newEmployee: Partial<Employee> = {
      ...employee,
      createdBy: 'System Admin',
      createdDate: new Date(),
      updatedBy: 'System Admin',
      lastUpdated: new Date(),
      auditTimeline: [
        { action: 'Profile Created', actor: 'System Admin', timestamp: new Date(), description: 'Initial employee record created.' }
      ]
    };

    if (true) {
      await lastValueFrom(this.http.post(this.apiUrl, newEmployee));
    } else {
      const mockId = (Math.random() * 10000).toString();
      this._employees.update(current => [...current, { ...newEmployee, id: mockId } as Employee]);
    }
  }

  async updateEmployee(employee: Employee): Promise<void> {
     // For demo, we just push a generic update event to timeline if not present in payload
     const updatedTimeline = [
        { action: 'Profile Updated', actor: 'System Admin', timestamp: new Date(), description: 'Employee details modified.' },
        ...employee.auditTimeline
    ];

    const dataToUpdate = {
        ...employee,
        auditTimeline: updatedTimeline,
        updatedBy: 'System Admin',
        lastUpdated: new Date()
    };
    
    const { id, ...firestoreData } = dataToUpdate;

    if (true) {
        await lastValueFrom(this.http.put(`${this.apiUrl}/${employee.id}`, firestoreData));
    } else {
        this._employees.update(current => 
            current.map(e => e.id === employee.id ? { ...employee, ...firestoreData } as Employee : e)
        );
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    if (true) {
        await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    } else {
        this._employees.update(current => current.filter(e => e.id !== id));
    }
  }

  async addDummyData(): Promise<void> {
    const dummyData = this._generateDummyEmployees(100);
    if (true) {
        const promises = dummyData.map(data => lastValueFrom(this.http.post(this.apiUrl, data)));
        await Promise.all(promises);
    } else {
        const current = this._employees();
        const newItems = dummyData.map(d => ({ ...d, id: Math.random().toString() } as Employee));
        this._employees.set([...current, ...newItems]);
    }
  }

  private _generateDummyEmployees(count: number): any[] {
    const employees = [];
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const departments = ['Product & Engineering', 'Sales', 'Marketing', 'Human Resources', 'Finance', 'Legal', 'Operations', 'Customer Support'];
    const titles = ['Associate', 'Manager', 'Senior Manager', 'Director', 'VP', 'Analyst', 'Specialist', 'Consultant', 'Engineer', 'Developer'];
    const locations = ['New York HQ', 'San Francisco HQ', 'London Branch', 'Remote - US', 'Remote - EU', 'Austin Hub (HQ-2)', 'Singapore Office'];
    
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        const jobTitle = `${department.split(' ')[0]} ${title}`;
        const employeeCode = `EMP-${2020 + Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 9000) + 1000}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@corporate.com`;
        
        const isActive = Math.random() > 0.1;
        const status: EmployeeStatus = isActive ? 'Active' : (Math.random() > 0.5 ? 'On Leave' : 'Terminated');
        
        // Random manager ID from seeded list (1 to 5) or null
        const reportingManagerId = Math.random() > 0.2 ? (Math.floor(Math.random() * 5) + 1).toString() : undefined;

        employees.push({
            firstName,
            lastName,
            email,
            employeeCode,
            jobTitle,
            level: `L${Math.floor(Math.random() * 6) + 3}`,
            department,
            workLocation: location,
            joiningDate: new Date(new Date().getTime() - Math.random() * 100000000000), // Random date within last few years
            reportingManagerId,
            status,
            isActive,
            auditTimeline: [
                { action: 'Profile Created', actor: 'System Seed', timestamp: new Date(), description: 'Bulk data generation' }
            ],
            createdBy: 'System Seed',
            createdDate: new Date(),
            updatedBy: 'System Seed',
            lastUpdated: new Date()
        });
    }
    return employees;
  }

  private _generateMockEmployees(): Employee[] {
    return [
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Miller',
        email: 's.miller@corporate.com',
        employeeCode: 'EMP-2018-001',
        jobTitle: 'Chief Technology Officer',
        level: 'L10 - C-Suite',
        department: 'Executive',
        workLocation: 'San Francisco HQ',
        joiningDate: new Date('2018-06-01'),
        status: 'Active',
        isActive: true,
        createdBy: 'System',
        createdDate: new Date('2018-06-01'),
        lastUpdated: new Date('2023-12-10'),
        auditTimeline: []
      },
      {
        id: '2',
        firstName: 'Robert Julian',
        lastName: 'Anderson',
        email: 'r.anderson@corporate.com',
        employeeCode: 'EMP-2024-0829',
        jobTitle: 'VP of Engineering',
        level: 'L9 - Executive',
        department: 'Product & Engineering',
        workLocation: 'Austin Hub (HQ-2)',
        joiningDate: new Date('2019-01-15'),
        reportingManagerId: '1', // Sarah Miller
        status: 'Active',
        isActive: true,
        createdBy: 'HR System',
        createdDate: new Date('2019-01-15'),
        lastUpdated: new Date('2024-10-28'),
        auditTimeline: [
            { action: 'Promotion Processed', actor: 'HR Director', timestamp: new Date('2024-01-12'), description: 'Changed from Director to VP' },
            { action: 'Manager Assigned', actor: 'System', timestamp: new Date('2023-10-24'), description: 'Reports to Sarah Miller (CTO)' },
            { action: 'Annual Review Signed', actor: 'Sarah Miller', timestamp: new Date('2023-09-15'), description: 'Completed by HR Department' }
        ]
      },
      {
        id: '3',
        firstName: 'Michael K.',
        lastName: 'Chen',
        email: 'm.chen@corporate.com',
        employeeCode: 'EMP-2020-0442',
        jobTitle: 'Engineering Manager',
        level: 'L7',
        department: 'Product & Engineering',
        workLocation: 'Remote - US',
        joiningDate: new Date('2020-03-10'),
        reportingManagerId: '2', // Robert Anderson
        status: 'Active',
        isActive: true,
        createdBy: 'HR System',
        createdDate: new Date('2020-03-10'),
        lastUpdated: new Date('2024-01-15'),
        auditTimeline: []
      },
      {
        id: '4',
        firstName: 'Amanda',
        lastName: 'Lopez',
        email: 'a.lopez@corporate.com',
        employeeCode: 'EMP-2021-1120',
        jobTitle: 'Staff Engineer',
        level: 'L8',
        department: 'Product & Engineering',
        workLocation: 'Austin Hub (HQ-2)',
        joiningDate: new Date('2021-05-20'),
        reportingManagerId: '2', // Robert Anderson
        status: 'Active',
        isActive: true,
        createdBy: 'HR System',
        createdDate: new Date('2021-05-20'),
        lastUpdated: new Date('2023-11-20'),
        auditTimeline: []
      },
      {
        id: '5',
        firstName: 'David',
        lastName: 'Wright',
        email: 'd.wright@corporate.com',
        employeeCode: 'EMP-2022-0901',
        jobTitle: 'Engineering Manager',
        level: 'L7',
        department: 'Product & Engineering',
        workLocation: 'Austin Hub (HQ-2)',
        joiningDate: new Date('2022-08-01'),
        reportingManagerId: '2', // Robert Anderson
        status: 'Active',
        isActive: true,
        createdBy: 'HR System',
        createdDate: new Date('2022-08-01'),
        lastUpdated: new Date('2023-08-01'),
        auditTimeline: []
      }
    ];
  }
}
