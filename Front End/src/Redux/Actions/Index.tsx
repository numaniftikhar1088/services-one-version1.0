import types from "../ActionTypes/Index";
import { IUserInfo } from "../../Interface/Shared/ApiResponse";

const setUserInfo = (loginData: IUserInfo | {}) => {
  return {
    type: types.SET_USER_INFO,
    payload: loginData,
  };
};
const setHeadersKey = (labKey: string) => {
  return {
    type: types.SET_HEADERS_KEY,
    payload: labKey,
  };
};
const setLabName = (labName: any) => {
  return {
    type: types.SET_LAB_NAME,
    payload: labName,
  };
};
const setTokenData = (token: any) => {
  return {
    type: types.TOKEN_DATA,
    payload: token,
  };
};
const setLabLogo = (obj: any) => {
  return {
    type: types.SET_LAB_LOGO,
    payload: obj,
  };
};
const setFacility = (obj: any) => {
  return {
    type: types.SET_FACILITY,
    payload: obj,
  };
};
const setFacilityUserType = (userType: number) => {
  return {
    type: types.SET_FACILITY_USER_TYPE,
    payload: userType,
  };
};
const setMultiFacilitiesData = (arr: any) => {
  return {
    type: types.SET_MULTI_FACILITIES,
    payload: arr,
  };
};

const setFacilityClaims = (arr: any) => {
  return {
    type: types.SET_FACILITY_CLAIMS,
    payload: arr,
  };
};

const setLoggedInUserInfo = (loggedInUserInfo: any) => {
  return {
    type: types.SET_LOGGEDIN_USER_INFO,
    payload: loggedInUserInfo,
  };
};
const setDecryptionId = (decryptionId?: string | null) => {
  return {
    type: "SET_DECRYPTION_ID",
    payload: decryptionId,
  };
};
const savePdfUrls = (pdfurls: any) => {
  return {
    type: "SAVE_URLS" as const,
    payload: pdfurls,
  };
};

const setSelectedTenantInfo = (selectedTenantInfo: any) => ({
  type: types.SELECTED_TENANT_INFO,
  payload: selectedTenantInfo,
});

export const showLoader = () => ({
  type: types.SHOW_LOADER,
});

export const hideLoader = () => ({
  type: types.HIDE_LOADER,
});

export const setPagesLinks = (LinkUrls: number) => ({
  type: types.SET_LINKS_URLS,
  payload: LinkUrls,
});

export const setSelectedMenu = (SelectedValue: any) => ({
  type: types.SET_SELECTED_MENU,
  payload: SelectedValue,
});

export const setRefreshToken = (payload: string) => ({
  type: types.SET_REFRESH_TOKEN,
  payload: payload,
});
export const setAdminUserId = (payload: any) => ({
  type: types.SET_ADMIN_USER_ID,
  payload: payload,
});

export const setBaseUrl = (url: string) => ({
  type: types.SET_BASE_URL,
  payload: url,
});

export const setLabType = (labtype: string) => ({
  type: types.SET_LABTYPE,
  payload: labtype,
});

export const setWebInfo = ({
  smartLogoUrl,
  title,
}: {
  smartLogoUrl: string;
  title: string;
}) => ({
  type: types.SET_WEB_INFO,
  payload: { smartLogoUrl, title },
});

export const setReqErrors = (error: any) => ({
  type: "REQ_ERROR",
  payload: error,
});

export const clearReduxStore = () => ({
  type: types.RESET_STORE,
});

export const setPhysicianSignature = (payload: string | null) => ({
  type: types.SET_PHYSICIAN_SIGN,
  payload,
});

export {
  setUserInfo,
  setHeadersKey,
  setLabName,
  setLabLogo,
  setFacility,
  setMultiFacilitiesData,
  setFacilityClaims,
  setFacilityUserType,
  setLoggedInUserInfo,
  setDecryptionId,
  savePdfUrls,
  setTokenData,
  setSelectedTenantInfo,
};
