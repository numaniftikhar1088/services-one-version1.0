import types from "../ActionTypes/Index";

const initialState = {
  userInfo: {},
  labKey: "",
  Requisition: {},
  selectedTenantInfo: {},
  pageId: 0,
  refreshToken: null,
  adminId: null,
  baseUrl: null,
  labType: null,
  webInfo: null,
};

export interface Action {
  type: string;
  payload: string;
}

const Reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case types.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case types.SET_HEADERS_KEY:
      return {
        ...state,
        labKey: action.payload,
      };
    case types.SET_LAB_LOGO:
      return {
        ...state,
        labinfo: action.payload,
      };
    case types.SET_LAB_NAME:
      return {
        ...state,
        labname: action.payload,
      };
    case types.SET_FACILITY:
      return {
        ...state,
        facilityData: action.payload,
      };
    case types.SET_MULTI_FACILITIES:
      return {
        ...state,
        facilityInfo: action.payload,
      };
    case types.SET_FACILITY_CLAIMS:
      return {
        ...state,
        Menus: action.payload,
      };
    case types.SET_FACILITY_USER_TYPE:
      return {
        ...state,
        facilityUserType: action.payload,
      };
    case types.SET_LOGGEDIN_USER_INFO:
      return {
        ...state,
        loggedInInfo: action.payload,
      };
    case types.SET_DECRYPTION_ID:
      return {
        ...state,
        decryptionId: action.payload,
      };
    case types.SAVE_URLS:
      return {
        ...state,
        pdfurls: action.payload,
      };
    case types.TOKEN_DATA:
      return {
        ...state,
        token: action.payload,
      };
    case types.SELECTED_TENANT_INFO:
      return {
        ...state,
        selectedTenantInfo: action.payload,
      };
    case types.SET_LINKS_URLS:
      return {
        ...state,
        links: action.payload,
      };
    case types.SET_SELECTED_MENU:
      return {
        ...state,
        selectedMenuBreadCrum: action.payload,
      };

    case types.SET_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: action.payload,
      };
    case types.SET_ADMIN_USER_ID:
      return {
        ...state,
        adminId: action.payload,
      };
    case types.SET_BASE_URL:
      return {
        ...state,
        baseUrl: action.payload,
      };
    case types.SET_LABTYPE:
      return {
        ...state,
        labType: action.payload,
      };
    case types.SET_WEB_INFO:
      return {
        ...state,
        webInfo: action.payload,
      };
    case types.RESET_STORE:
      return initialState;
    default:
      return state;
  }
};
export default Reducer;
