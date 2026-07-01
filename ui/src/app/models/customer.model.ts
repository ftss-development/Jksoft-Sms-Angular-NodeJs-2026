
export interface Salutation {
  salutationId: number;
  salutationType: string;
}

export interface SubscriberType {
  subscriberTypeId: number;
  type: string;
}

export interface Company {
  id: number;
  companyName: string;
}

export interface GstMode {
  gstModeId: number;
  type: string;
}

export interface ConnectionType {
  connectionTypeId: number;
  type: string;
}

export interface EmployeeHierarchy {
  employeeHierarchyId: number;
  employeeName: string;
}

export interface Status {
  statusId: number;
  type: string;
  statusFor: string;
}

export interface Area {
  id: number;
  fullName: string;
}

export interface District {
  id: number;
  fullName: string;
}

export interface Colony {
  id: number;
  fullName: string;
}

export interface City {
  id: number;
  fullName: string;
}

export interface State {
  id: number;
  fullName: string;
}

export interface CustomersAddress {
  customersAddressId: number;
  areaId: number;
  area?: Area;
  districtId: number;
  district?: District;
  colonyId: number;
  colony?: Colony;
  cityId: number;
  city?: City;
  stateId: number;
  state?: State;
  address1: string;
  address2: string;
  address3: string;
  pinCode: string;
  statusId: number;
  status?: Status;
}

export interface CustomersContact {
  customersContactId: number;
  telephoneNo1: string;
  telephoneNo2: string;
  telephoneNo3: string;
  mobileNo1: string;
  mobileNo2: string;
  mobileNo3: string;
  emailId1: string;
  emailId2: string;
  statusId: number;
  status?: Status;
}

export interface Customer {
  customerId: string; // Changed to string for Firestore
  accountNo: string;
  salutationId: number;
  salutation?: Salutation;
  subscriberTypeId: number;
  subscriberType?: SubscriberType;
  firstName: string;
  middleName: string;
  lastName: string;
  areInstallationBillingAddressSame: boolean;
  dateOfInstallation?: Date;
  gstNo: string;
  panNo: string;
  aadhaarNo: string;
  msoNo: string;
  companyId: number;
  company?: Company;
  gstModeId: number;
  gstMode?: GstMode;
  connectionTypeId: number;
  connectionType?: ConnectionType;
  remark: string;
  technicalInChargeId?: number;
  technicalInCharge?: EmployeeHierarchy;
  collectionInChargeId?: number;
  collectionInCharge?: EmployeeHierarchy;
  statusId: number;
  status?: Status;
  customersAddress?: CustomersAddress;
  customersContact?: CustomersContact;
  // New audit fields
  createdBy?: string;
  createdDate?: Date;
  updatedBy?: string;
  lastUpdated?: Date;
}
