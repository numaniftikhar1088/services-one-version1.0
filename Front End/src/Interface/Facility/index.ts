import { File } from "@babel/types";

export interface FacilityGridData {
  contactFirstName: string;
  contactLastName: string;
  facilityName: string;
  facilityEmail: string;
  state: string;
  facilityId: number;
  addedDate: string;
  contactPhone: string;
  clientName: string;
  clientId: string;
  status: string;
  files: any;
  submittedDate: any;
  submittedBy: any;
  phone: any;
  primaryContactName: any;
  primaryContactEmail: any;
  address1: any;
  address2: any;
  city: any;
  zipCode: any;
}


export interface FacilityGridProps {
  loadFacilities: Function;
  tabKey: number;
  facilityUserList: FacilityGridData[];
  loading: boolean;
  curPage: any;
  pageSize: any;
  setPageSize: any;
  total: any;
  totalPages: any;
  loadData: any;
  pageNumbers: any;
  nextPage: any;
  showPage: any;
  prevPage: any;
  handleSort: any;
  searchRef: any;
  sort: any;
  searchRequest?: any;
}
