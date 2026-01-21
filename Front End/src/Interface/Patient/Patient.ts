export interface IPatient {
  insuranceId: string | number;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  ethinicity: string;
  race: string;
  patientType: string;
  socialSecurityNumber: string;
  passportNumber: string;
  dlidNumber: string;
  county: string;
  landPhone: string;
  mobile: string;
  email: string;
  height: string;
  weight: string;
  facilityId: string;
  address1: string;
  address2: string;
  zipCode: string;
  state: string;
  city: string;
  country: string;
  patientAddressId: string;
  groupNumber: string;
  insuranceProviderId: string;
  policyId: string;
  sfname: string;
  slname: string;
  sdob: string;
  srelation: string;
}
export interface IFacilityIdDropdownValues {
  data: Data;
  status: number;
  statusText: string;
  headers: Headers;
}
export interface Data {
  status: number;
  title: string;
  data: Data1;
  identifier?: null;
  errors?: null;
}
export interface Data1 {
  total: number;
  data?: DataEntity[] | null;
}
export interface DataEntity {
  addedDate: string;
  facilityId: number;
  state: string;
  facilityEmail: string;
  facilityName: string;
  contactLastName: string;
  contactFirstName: string;
}

export interface ICompDataState {
  dropdownData: [] | null | undefined;
  insuranceDropdown: [] | null | undefined;
  insuranceDropdownProvider: [] | null | undefined;
  preVal: object;
}
export interface ICompData {
  dropdownData?: null[] | null | any;
  insuranceDropdown?: null[] | null | any;
  insuranceDropdownProvider?: null[] | null | any;
}
