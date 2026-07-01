
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';

// Ticket Head Imports
import { TicketHeadListComponent } from './components/ticket-head-list/ticket-head-list.component';
import { TicketHeadAddComponent } from './components/ticket-head-add/ticket-head-add.component';
import { TicketHeadEditComponent } from './components/ticket-head-edit/ticket-head-edit.component';
import { TicketHeadDetailComponent } from './components/ticket-head-detail/ticket-head-detail.component';

// Ticket Reason Imports
import { TicketReasonListComponent } from './components/ticket-reason-list/ticket-reason-list.component';
import { TicketReasonAddComponent } from './components/ticket-reason-add/ticket-reason-add.component';
import { TicketReasonEditComponent } from './components/ticket-reason-edit/ticket-reason-edit.component';
import { TicketReasonDetailComponent } from './components/ticket-reason-detail/ticket-reason-detail.component';

// Particular Type Imports
import { ParticularTypeListComponent } from './components/particular-type-list/particular-type-list.component';
import { ParticularTypeAddComponent } from './components/particular-type-add/particular-type-add.component';
import { ParticularTypeEditComponent } from './components/particular-type-edit/particular-type-edit.component';
import { ParticularTypeDetailComponent } from './components/particular-type-detail/particular-type-detail.component';

// Tax Imports
import { TaxListComponent } from './components/tax-list/tax-list.component';
import { TaxAddComponent } from './components/tax-add/tax-add.component';
import { TaxEditComponent } from './components/tax-edit/tax-edit.component';
import { TaxDetailComponent } from './components/tax-detail/tax-detail.component';

// Store Imports
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreAddComponent } from './components/store-add/store-add.component';
import { StoreEditComponent } from './components/store-edit/store-edit.component';
import { StoreDetailComponent } from './components/store-detail/store-detail.component';

// STB Scheme Imports
import { StbSchemeListComponent } from './components/stb-scheme-list/stb-scheme-list.component';
import { StbSchemeAddComponent } from './components/stb-scheme-add/stb-scheme-add.component';
import { StbSchemeEditComponent } from './components/stb-scheme-edit/stb-scheme-edit.component';
import { StbSchemeDetailComponent } from './components/stb-scheme-detail/stb-scheme-detail.component';

// STB Type Imports
import { StbTypeListComponent } from './components/stb-type-list/stb-type-list.component';
import { StbTypeAddComponent } from './components/stb-type-add/stb-type-add.component';
import { StbTypeEditComponent } from './components/stb-type-edit/stb-type-edit.component';
import { StbTypeDetailComponent } from './components/stb-type-detail/stb-type-detail.component';

// Service Category Imports 
import { ServiceCategoryListComponent } from './components/service-category-list/service-category-list.component';
import { ServiceCategoryAddComponent } from './components/service-category-add/service-category-add.component';
import { ServiceCategoryEditComponent } from './components/service-category-edit/service-category-edit.component';
import { ServiceCategoryDetailComponent } from './components/service-category-detail/service-category-detail.component';

// Service Type Imports
import { ServiceTypeListComponent } from './components/service-type-list/service-type-list.component';
import { ServiceTypeAddComponent } from './components/service-type-add/service-type-add.component';
import { ServiceTypeEditComponent } from './components/service-type-edit/service-type-edit.component';
import { ServiceTypeDetailComponent } from './components/service-type-detail/service-type-detail.component';

// Status Imports
import { StatusListComponent } from './components/status-list/status-list.component';
import { StatusAddComponent } from './components/status-add/status-add.component';
import { StatusEditComponent } from './components/status-edit/status-edit.component';
import { StatusDetailComponent } from './components/status-detail/status-detail.component';

// Note Type Imports
import { NoteTypeListComponent } from './components/note-type-list/note-type-list.component';
import { NoteTypeAddComponent } from './components/note-type-add/note-type-add.component';
import { NoteTypeEditComponent } from './components/note-type-edit/note-type-edit.component';
import { NoteTypeDetailComponent } from './components/note-type-detail/note-type-detail.component';

// Signal Type Imports
import { SignalTypeListComponent } from './components/signal-type-list/signal-type-list.component';
import { SignalTypeAddComponent } from './components/signal-type-add/signal-type-add.component';
import { SignalTypeEditComponent } from './components/signal-type-edit/signal-type-edit.component';
import { SignalTypeDetailComponent } from './components/signal-type-detail/signal-type-detail.component';

// Quality Imports
import { QualityListComponent } from './components/quality-list/quality-list.component';
import { QualityAddComponent } from './components/quality-add/quality-add.component';
import { QualityEditComponent } from './components/quality-edit/quality-edit.component';
import { QualityDetailComponent } from './components/quality-detail/quality-detail.component';

// Existing Imports
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerAddComponent } from './components/customer-add/customer-add.component';
import { CustomerEditComponent } from './components/customer-edit/customer-edit.component';
import { DocumentCategoryListComponent } from './components/document-category-list/document-category-list.component';
import { DocumentCategoryAddComponent } from './components/document-category-add/document-category-add.component';
import { DocumentCategoryEditComponent } from './components/document-category-edit/document-category-edit.component';
import { DocumentCategoryDetailComponent } from './components/document-category-detail/document-category-detail.component';
import { DocumentHeadListComponent } from './components/document-head-list/document-head-list.component';
import { DocumentHeadAddComponent } from './components/document-head-add/document-head-add.component';
import { DocumentHeadEditComponent } from './components/document-head-edit/document-head-edit.component';
import { DocumentHeadDetailComponent } from './components/document-head-detail/document-head-detail.component';
import { ItemMakerListComponent } from './components/item-maker-list/item-maker-list.component';
import { ItemMakerAddComponent } from './components/item-maker-add/item-maker-add.component';
import { ItemMakerEditComponent } from './components/item-maker-edit/item-maker-edit.component';
import { ItemMakerDetailComponent } from './components/item-maker-detail/item-maker-detail.component';
import { LanguageListComponent } from './components/language-list/language-list.component';
import { LanguageAddComponent } from './components/language-add/language-add.component';
import { LanguageEditComponent } from './components/language-edit/language-edit.component';
import { LanguageDetailComponent } from './components/language-detail/language-detail.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { CountryAddComponent } from './components/country-add/country-add.component';
import { CountryEditComponent } from './components/country-edit/country-edit.component';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { StateListComponent } from './components/state-list/state-list.component';
import { StateAddComponent } from './components/state-add/state-add.component';
import { StateEditComponent } from './components/state-edit/state-edit.component';
import { StateDetailComponent } from './components/state-detail/state-detail.component';
import { CityListComponent } from './components/city-list/city-list.component';
import { CityAddComponent } from './components/city-add/city-add.component';
import { CityEditComponent } from './components/city-edit/city-edit.component';
import { CityDetailComponent } from './components/city-detail/city-detail.component';
import { DistrictListComponent } from './components/district-list/district-list.component';
import { DistrictAddComponent } from './components/district-add/district-add.component';
import { DistrictEditComponent } from './components/district-edit/district-edit.component';
import { DistrictDetailComponent } from './components/district-detail/district-detail.component';
import { AreaListComponent } from './components/area-list/area-list.component';
import { AreaAddComponent } from './components/area-add/area-add.component';
import { AreaEditComponent } from './components/area-edit/area-edit.component';
import { AreaDetailComponent } from './components/area-detail/area-detail.component';
import { ColonyListComponent } from './components/colony-list/colony-list.component';
import { ColonyAddComponent } from './components/colony-add/colony-add.component';
import { ColonyEditComponent } from './components/colony-edit/colony-edit.component';
import { ColonyDetailComponent } from './components/colony-detail/colony-detail.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyAddComponent } from './components/company-add/company-add.component';
import { CompanyEditComponent } from './components/company-edit/company-edit.component';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketAddComponent } from './components/ticket-add/ticket-add.component';
import { TicketEditComponent } from './components/ticket-edit/ticket-edit.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { ChannelListComponent } from './components/channel-list/channel-list.component';
import { ChannelAddComponent } from './components/channel-add/channel-add.component';
import { ChannelEditComponent } from './components/channel-edit/channel-edit.component';
import { ChannelDetailComponent } from './components/channel-detail/channel-detail.component';
import { PackageListComponent } from './components/package-list/package-list.component';
import { PackageAddComponent } from './components/package-add/package-add.component';
import { PackageEditComponent } from './components/package-edit/package-edit.component';
import { PackageDetailComponent } from './components/package-detail/package-detail.component';
import { EnquiryListComponent } from './components/enquiry-list/enquiry-list.component';
import { EnquiryAddComponent } from './components/enquiry-add/enquiry-add.component';
import { EnquiryEditComponent } from './components/enquiry-edit/enquiry-edit.component';
import { EnquiryDetailComponent } from './components/enquiry-detail/enquiry-detail.component';
import { ParticularListComponent } from './components/particular-list/particular-list.component';
import { ParticularAddComponent } from './components/particular-add/particular-add.component';
import { ParticularEditComponent } from './components/particular-edit/particular-edit.component';
import { ParticularDetailComponent } from './components/particular-detail/particular-detail.component';
import { AmplifierListComponent } from './components/amplifier-list/amplifier-list.component';
import { AmplifierAddComponent } from './components/amplifier-add/amplifier-add.component';
import { AmplifierEditComponent } from './components/amplifier-edit/amplifier-edit.component';
import { AmplifierDetailComponent } from './components/amplifier-detail/amplifier-detail.component';
import { ParticularGroupListComponent } from './components/particular-group-list/particular-group-list.component';
import { ParticularGroupAddComponent } from './components/particular-group-add/particular-group-add.component';
import { ParticularGroupEditComponent } from './components/particular-group-edit/particular-group-edit.component';
import { ParticularGroupDetailComponent } from './components/particular-group-detail/particular-group-detail.component';
import { BankListComponent } from './components/bank-list/bank-list.component';
import { BankAddComponent } from './components/bank-add/bank-add.component';
import { BankEditComponent } from './components/bank-edit/bank-edit.component';
import { BankDetailComponent } from './components/bank-detail/bank-detail.component';
import { BankAccountListComponent } from './components/bank-account-list/bank-account-list.component';
import { BankAccountAddComponent } from './components/bank-account-add/bank-account-add.component';
import { BankAccountEditComponent } from './components/bank-account-edit/bank-account-edit.component';
import { BankAccountDetailComponent } from './components/bank-account-detail/bank-account-detail.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeAddComponent } from './components/employee-add/employee-add.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserSecurityComponent } from './components/user-security/user-security.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { DepartmentAddComponent } from './components/department-add/department-add.component';
import { DepartmentEditComponent } from './components/department-edit/department-edit.component';
import { DepartmentDetailComponent } from './components/department-detail/department-detail.component';
import { SubDepartmentListComponent } from './components/sub-department-list/sub-department-list.component';
import { SubDepartmentAddComponent } from './components/sub-department-add/sub-department-add.component';
import { SubDepartmentEditComponent } from './components/sub-department-edit/sub-department-edit.component';
import { SubDepartmentDetailComponent } from './components/sub-department-detail/sub-department-detail.component';
import { DesignationListComponent } from './components/designation-list/designation-list.component';
import { DesignationAddComponent } from './components/designation-add/designation-add.component';
import { DesignationEditComponent } from './components/designation-edit/designation-edit.component';
import { DesignationDetailComponent } from './components/designation-detail/designation-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleAddComponent } from './components/role-add/role-add.component';
import { RoleEditComponent } from './components/role-edit/role-edit.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { SystemRightListComponent } from './components/system-right-list/system-right-list.component';
import { SystemRightAddComponent } from './components/system-right-add/system-right-add.component';
import { SystemRightEditComponent } from './components/system-right-edit/system-right-edit.component';
import { SystemRightDetailComponent } from './components/system-right-detail/system-right-detail.component';
import { AuditLogComponent } from './components/audit-log/audit-log.component';

// Term Category Imports
import { TermCategoryListComponent } from './components/term-category-list/term-category-list.component';
import { TermCategoryAddComponent } from './components/term-category-add/term-category-add.component';
import { TermCategoryEditComponent } from './components/term-category-edit/term-category-edit.component';
import { TermCategoryDetailComponent } from './components/term-category-detail/term-category-detail.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard], 
    children: [
        {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        },
        {
            path: 'dashboard',
            component: DashboardContentComponent,
            canActivate: [permissionGuard],
            data: { right: 'VIEW_DASHBOARD' }
        },
        
        // --- Administration & Security ---
        { path: 'users', component: UserListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_USERS' } },
        { path: 'users/add', component: UserAddComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'users/edit/:id', component: UserEditComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'users/detail/:id', component: UserDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_USERS' } },
        { path: 'users/security/:id', component: UserSecurityComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        
        { path: 'roles', component: RoleListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_ROLES' } },
        { path: 'roles/add', component: RoleAddComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_ROLES' } },
        { path: 'roles/edit/:id', component: RoleEditComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_ROLES' } },
        { path: 'roles/detail/:id', component: RoleDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_ROLES' } },
        
        { path: 'system-rights', component: SystemRightListComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_ROLES' } },
        { path: 'system-rights/add', component: SystemRightAddComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_ROLES' } },
        { path: 'system-rights/edit/:id', component: SystemRightEditComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_ROLES' } },
        { path: 'system-rights/detail/:id', component: SystemRightDetailComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_ROLES' } },
        
        { path: 'audit-logs', component: AuditLogComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_ROLES' } },

        { path: 'departments', component: DepartmentListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DEPTS' } },
        { path: 'departments/add', component: DepartmentAddComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } }, // Reusing Manage Users or Roles for Dept
        { path: 'departments/edit/:id', component: DepartmentEditComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'departments/detail/:id', component: DepartmentDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DEPTS' } },
        
        { path: 'sub-departments', component: SubDepartmentListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DEPTS' } },
        { path: 'sub-departments/add', component: SubDepartmentAddComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'sub-departments/edit/:id', component: SubDepartmentEditComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'sub-departments/detail/:id', component: SubDepartmentDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DEPTS' } },
        
        { path: 'designations', component: DesignationListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DEPTS' } },
        { path: 'designations/add', component: DesignationAddComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'designations/edit/:id', component: DesignationEditComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'designations/detail/:id', component: DesignationDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DEPTS' } },

        // --- Finance ---
        { path: 'taxes', component: TaxListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'taxes/add', component: TaxAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } }, // Simplified permission for demo
        { path: 'taxes/edit/:id', component: TaxEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'taxes/detail/:id', component: TaxDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        
        { path: 'note-types', component: NoteTypeListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'note-types/add', component: NoteTypeAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'note-types/edit/:id', component: NoteTypeEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'note-types/detail/:id', component: NoteTypeDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        
        { path: 'banks', component: BankListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'banks/add', component: BankAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'banks/edit/:id', component: BankEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'banks/detail/:id', component: BankDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        
        { path: 'bank-accounts', component: BankAccountListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'bank-accounts/add', component: BankAccountAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'bank-accounts/edit/:id', component: BankAccountEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'bank-accounts/detail/:id', component: BankAccountDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },

        // --- Inventory & Infrastructure ---
        { path: 'stores', component: StoreListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'stores/add', component: StoreAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'stores/edit/:id', component: StoreEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'stores/detail/:id', component: StoreDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        
        { path: 'stb-types', component: StbTypeListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'stb-types/add', component: StbTypeAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'stb-types/edit/:id', component: StbTypeEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'stb-types/detail/:id', component: StbTypeDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },

        { path: 'amplifiers', component: AmplifierListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'amplifiers/add', component: AmplifierAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'amplifiers/edit/:id', component: AmplifierEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'amplifiers/detail/:id', component: AmplifierDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        
        { path: 'item-makers', component: ItemMakerListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'item-makers/add', component: ItemMakerAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'item-makers/edit/:id', component: ItemMakerEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'item-makers/detail/:id', component: ItemMakerDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },

        // --- Billing ---
        { path: 'stb-schemes', component: StbSchemeListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_BILLING' } },
        { path: 'stb-schemes/add', component: StbSchemeAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_BILLING' } },
        { path: 'stb-schemes/edit/:id', component: StbSchemeEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_BILLING' } },
        { path: 'stb-schemes/detail/:id', component: StbSchemeDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_BILLING' } },
        
        { path: 'packages', component: PackageListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_BILLING' } },
        { path: 'packages/add', component: PackageAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_BILLING' } },
        { path: 'packages/edit/:id', component: PackageEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_BILLING' } },
        { path: 'packages/detail/:id', component: PackageDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_BILLING' } },

        // --- Customer & Support ---
        { path: 'customers', component: CustomerListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_CUSTOMERS' } },
        { path: 'customers/add', component: CustomerAddComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_CUSTOMERS' } },
        { path: 'customers/edit/:id', component: CustomerEditComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_CUSTOMERS' } },
        
        { path: 'tickets', component: TicketListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'tickets/add', component: TicketAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'tickets/edit/:id', component: TicketEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'tickets/detail/:id', component: TicketDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },

        { path: 'enquiries', component: EnquiryListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } }, // Reusing support right
        { path: 'enquiries/add', component: EnquiryAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'enquiries/edit/:id', component: EnquiryEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'enquiries/detail/:id', component: EnquiryDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },

        // --- Configuration & Others ---
        { path: 'ticket-heads', component: TicketHeadListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'ticket-heads/add', component: TicketHeadAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'ticket-heads/edit/:id', component: TicketHeadEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'ticket-heads/detail/:id', component: TicketHeadDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },

        { path: 'ticket-reasons', component: TicketReasonListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'ticket-reasons/add', component: TicketReasonAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'ticket-reasons/edit/:id', component: TicketReasonEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },
        { path: 'ticket-reasons/detail/:id', component: TicketReasonDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_TICKETS' } },

        { path: 'term-categories', component: TermCategoryListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'term-categories/add', component: TermCategoryAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'term-categories/edit/:id', component: TermCategoryEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'term-categories/detail/:id', component: TermCategoryDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },

        { path: 'particular-types', component: ParticularTypeListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'particular-types/add', component: ParticularTypeAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'particular-types/edit/:id', component: ParticularTypeEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'particular-types/detail/:id', component: ParticularTypeDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        
        { path: 'service-categories', component: ServiceCategoryListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'service-categories/add', component: ServiceCategoryAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'service-categories/edit/:id', component: ServiceCategoryEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'service-categories/detail/:id', component: ServiceCategoryDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },

        { path: 'service-types', component: ServiceTypeListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'service-types/add', component: ServiceTypeAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'service-types/edit/:id', component: ServiceTypeEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'service-types/detail/:id', component: ServiceTypeDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },

        { path: 'signal-types', component: SignalTypeListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'signal-types/add', component: SignalTypeAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'signal-types/edit/:id', component: SignalTypeEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'signal-types/detail/:id', component: SignalTypeDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        
        { path: 'quality', component: QualityListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'quality/add', component: QualityAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'quality/edit/:id', component: QualityEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },
        { path: 'quality/detail/:id', component: QualityDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_INVENTORY' } },

        { path: 'languages', component: LanguageListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'languages/add', component: LanguageAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'languages/edit/:id', component: LanguageEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'languages/detail/:id', component: LanguageDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        
        { path: 'categories', component: DocumentCategoryListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'categories/add', component: DocumentCategoryAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'categories/edit/:id', component: DocumentCategoryEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'categories/detail/:id', component: DocumentCategoryDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        
        { path: 'heads', component: DocumentHeadListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'heads/add', component: DocumentHeadAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'heads/edit/:id', component: DocumentHeadEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        { path: 'heads/detail/:id', component: DocumentHeadDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DOCS' } },
        
        { path: 'companies', component: CompanyListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'companies/add', component: CompanyAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'companies/edit/:id', component: CompanyEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'companies/detail/:id', component: CompanyDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        
        { path: 'countries', component: CountryListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'countries/add', component: CountryAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'countries/edit/:id', component: CountryEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'countries/detail/:id', component: CountryDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        
        { path: 'states', component: StateListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'states/add', component: StateAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'states/edit/:id', component: StateEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'states/detail/:id', component: StateDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        
        { path: 'cities', component: CityListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'cities/add', component: CityAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'cities/edit/:id', component: CityEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'cities/detail/:id', component: CityDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        
        { path: 'districts', component: DistrictListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'districts/add', component: DistrictAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'districts/edit/:id', component: DistrictEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'districts/detail/:id', component: DistrictDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        
        { path: 'areas', component: AreaListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'areas/add', component: AreaAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'areas/edit/:id', component: AreaEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'areas/detail/:id', component: AreaDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        
        { path: 'colonies', component: ColonyListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'colonies/add', component: ColonyAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'colonies/edit/:id', component: ColonyEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        { path: 'colonies/detail/:id', component: ColonyDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_GEO' } },
        
        { path: 'channels', component: ChannelListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_CHANNELS' } },
        { path: 'channels/add', component: ChannelAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_CHANNELS' } },
        { path: 'channels/edit/:id', component: ChannelEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_CHANNELS' } },
        { path: 'channels/detail/:id', component: ChannelDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_CHANNELS' } },
        
        { path: 'particulars', component: ParticularListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'particulars/add', component: ParticularAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'particulars/edit/:id', component: ParticularEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'particulars/detail/:id', component: ParticularDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        
        { path: 'particular-groups', component: ParticularGroupListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },      
        { path: 'particular-groups/add', component: ParticularGroupAddComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'particular-groups/edit/:id', component: ParticularGroupEditComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        { path: 'particular-groups/detail/:id', component: ParticularGroupDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_FINANCE' } },
        
        { path: 'employees', component: EmployeeListComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DEPTS' } },
        { path: 'employees/add', component: EmployeeAddComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'employees/edit/:id', component: EmployeeEditComponent, canActivate: [permissionGuard], data: { right: 'MANAGE_USERS' } },
        { path: 'employees/detail/:id', component: EmployeeDetailComponent, canActivate: [permissionGuard], data: { right: 'VIEW_DEPTS' } }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
