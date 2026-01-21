import HttpClient from "HttpClient";
import { IApiResponse, IUserInfo } from "../../Interface/Shared/ApiResponse";
import store from "../../Redux/Store/AppStore";
import routes from "../../Routes/Routes.json";

const isExternalLoginPath =
  window.location.pathname.toLowerCase().replace(/\/$/, "") ===
  "/externallogin";

const userLogin = async (user: any) => {
  const response: IApiResponse<IUserInfo> = await HttpClient().post(
    `/${routes.Login}`,
    user,
    {
      headers: {
        ExternalLogin: isExternalLoginPath ? window.location.href : "",
      },
    }
  );
  return response;
};

const switchPortal = async (key: string, token: string, labId: number) => {
  const response = await HttpClient().post(
    `/${routes.UserManagement.SelectTenantLogin}?labId=${labId}`,
    null,
    {
      headers: {
        "X-Portal-Key": key,
        Authorization: `Bearer ${token}`,
        Lab: labId,
      },
    }
  );

  return response;
};

const userLogout = () => {
  return HttpClient().post(`/${routes.Logout}`, {
    refreshToken: (store as any).getState()?.Reducer?.refreshToken,
  });
};

const AccountService = {
  userLogin,
  userLogout,
  switchPortal,
};
export default AccountService;
