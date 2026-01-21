import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { hideLoader, setRefreshToken, showLoader } from "./Redux/Actions/Index";
import store from "./Redux/Store/AppStore";
import { Decrypt, Encrypt } from "./Utils/Auth";
import { getValueFromSessionStorage } from "./Utils/Common/CommonMethods";
import { PortalTypeEnum } from "./Utils/Common/Enums/Enums";
import { isJson } from "./Utils/Common/Requisition";
import { logoutUtil } from "./Utils/UserManagement/UserRoles";

// Interface for user info
interface UserInfo {
  token: string;
  // Add more fields as needed based on your userinfo object
}

// Global refresh token promise to ensure only one refresh request at a time
let refreshTokenPromise: Promise<string | null> | null = null;

const HttpClient = () => {
  const defaultOptions: AxiosRequestConfig = {
    baseURL: (store.getState()?.Reducer as any).baseUrl,
    headers: {
      Accept: "application/json",
    },
  };

  let instance = axios.create(defaultOptions);

  // Request Interceptor
  instance.interceptors.request.use(function (config) {
    store.dispatch(showLoader());
    let userInfo: UserInfo | null = sessionStorage.getItem("userinfo")
      ? JSON.parse(Decrypt(sessionStorage.getItem("userinfo") as string))
      : null;
    let facilityInfo = sessionStorage.getItem("facilityInfo");
    let facilityData = facilityInfo;

    if (facilityData) {
      const result = isJson(facilityData);
      if (result) {
        facilityData = JSON.parse(facilityData);
      }
    }

    const reducer: any = store.getState()?.Reducer;

    if (userInfo) {
      (config as any).headers = {
        ...config.headers,
        Authorization: `Bearer ${userInfo.token}`,
        "X-Portal-Key": config.headers?.["X-Portal-Key"] || reducer?.labKey,
        Lab: reducer?.loggedInInfo?.selectedTenantsInfo?.tenantId,
        "Page-Id": getValueFromSessionStorage("pageId"),
        ExternalLogin:
          getValueFromSessionStorage("externalLogin") === "true"
            ? window.location.href
            : "",
      };

      if (
        reducer?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
          PortalTypeEnum.Facility ||
        reducer?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
          PortalTypeEnum.Sales
      ) {
        config.headers["facility"] = reducer?.facilityData?.facilityId;
      }
    }

    return config;
  });

  // Response Interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      store.dispatch(hideLoader());
      return response;
    },
    async (error: any) => {
      store.dispatch(hideLoader());

      const config = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (
        error.response &&
        error.response.status === 401 &&
        !config._retry &&
        sessionStorage.getItem("userinfo")
      ) {
        config._retry = true;

        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshToken(); // Make refresh token call
        }

        try {
          const newToken = await refreshTokenPromise;
          refreshTokenPromise = null; // Reset the promise once resolved

          // Set the new token and retry the request
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return axios(config);
        } catch (refreshError) {
          refreshTokenPromise = null; // Reset on error as well
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Function to make RefreshToken API call which then returns new token.
 */
export const refreshToken = async (): Promise<string | null> => {
  const userInfoString = sessionStorage.getItem("userinfo");

  if (!userInfoString) {
    return Promise.reject(new Error("No refresh token available"));
  }

  const reducer: any = store.getState()?.Reducer;

  try {
    const parsedUserInfo: UserInfo = JSON.parse(Decrypt(userInfoString));

    const response: AxiosResponse = await axios.post(
      `${reducer.baseUrl}/api/Account/RefreshToken`,
      {
        refreshToken: reducer?.refreshToken,
      },
      {
        headers: {
          "X-Portal-Key": reducer?.labKey,
          Authorization: `Bearer ${parsedUserInfo.token}`,
        },
      }
    );

    const newToken: string = response.data.accessToken;
    const newRefreshToken: string = response.data.refreshToken;

    if (!newToken) {
      handleLoginRoute();
      return null;
    }

    // Update the refresh token in the Redux store and sessionStorage
    store.dispatch(setRefreshToken(newRefreshToken));

    const updatedUserInfo = { ...parsedUserInfo, token: newToken };

    sessionStorage.setItem(
      "userinfo",
      Encrypt(JSON.stringify(updatedUserInfo))
    );

    return newToken;
  } catch (error) {
    handleLoginRoute();
    toast.error("Session expired. Please login again.");
    return Promise.reject(error);
  }
};

/**
 * Function to log the user out and redirect them to the login page.
 */
const handleLoginRoute = () => {
  logoutUtil();
};

export default HttpClient;
