export interface IApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}
export interface IUserInfo {
  token: string;
  username: string;
  expiresIn: number;
  expires: string;
  authTenants?: (AuthTenantsEntity)[] | null;
}
export interface AuthTenantsEntity {
  tenantId: number;
  key: string;
  name: string;
  url: string;
  logo: string;
  isReferenceLab: boolean;
  isDefault: boolean;
  infomationOfLoggedUser?:any
}
