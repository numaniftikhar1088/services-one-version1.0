import {IUserInfo} from '../Shared/ApiResponse'
export interface ISelectLabProps {
    User: IUser;
  }
  export interface IUser {
    userInfo: IUserInfo;
    labKey: string;
    labname:string;
    decryptionId?:string
  }
  export interface authTenants{
    key:string;
    url:string;
    name:string
   }

   export interface ILabrequest {
    pageNumber: number;
    pageSize: number;
    queryModel: QueryModel;
  }
   export interface IRLabrequest {
    queryModel: QueryModel;
    // pageNumber: number;
    // pageSize: number;
  }
  export interface QueryModel {
    labName?: string;
    code?: string;
    director?: string;
    labDisplayName?: string;
    enter3DigitsProgram?: string;
    enter3DigitsLabCode?: string;
    labType?: string;
    clia?: string;
    status?: null|boolean;
    isActive?: null|boolean;
  }

  export interface IGridData{
    referenceLabAssignmentsData:any,
    referenceLabDropDownGetObj:IreferenceLabDropDownGetObj,
    requsitionTypeDropdownGetObj:IreferenceLabDropDownGetObj,
    referenceLabDropDownOptions:any,
    requsitionTypeDropdownOptions?:[],
    getRefLabAssigmentsDataObj:IGetRefLabAssigmentsDataObj
  }

  interface IreferenceLabDropDownGetObj{
    pageNumber: number,
    pageSize: number,
    queryModel?: null,
  }


  interface IGetRefLabAssigmentsDataObj{
    pageNumber: number,
    pageSize: number,
    queryModel:IQuerymodel
  }

  interface IQuerymodel{
    name?: string,
    labType?: null,
    labApprovementStatus?: null,
  facilityIds?:any,
  }