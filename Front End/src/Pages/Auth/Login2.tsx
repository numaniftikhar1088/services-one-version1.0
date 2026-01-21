import {
  setFaviconAndTitle,
  setValueIntoSessionStorage,
} from "Utils/Common/CommonMethods";
import { jwtDecode, JwtPayload } from "jwt-decode";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginReqState } from "../../Interface/Login/LoginData";
import { IApiResponse } from "../../Interface/Shared/ApiResponse";
import {
  setLabType,
  setRefreshToken,
  setTokenData,
  setUserInfo,
  setWebInfo,
} from "../../Redux/Actions/Index";
import AccountService from "../../Services/Account/AccountService";
import Commonservice from "../../Services/CommonService";
import LoadButton from "../../Shared/Common/LoadButton";
import useAuth from "../../Shared/hooks/useAuth";
import { Encrypt, getTokenData } from "../../Utils/Auth";
import useLang from "./../../Shared/hooks/useLanguage";
import { getFingerprint } from "Utils/Common/HelperFunction";

const Login = React.memo(() => {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useLang();
  const [logoUrl, setLogoUrl] = useState("");
  const dispatch = useDispatch();
  const { LoginRoute }: any = useAuth();
  const navigate = useNavigate();
  const webInfo = useSelector((state: any) => state?.Reducer?.webInfo);
  const [deviceId, setDeviceId] = useState<string>("");
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const getLogoUrl = () => {
    Commonservice.getLoginPageLogo()
      .then((res: any) => {
        setLogoUrl(res.data.logo);
        dispatch(
          setWebInfo({
            smartLogoUrl: res.data?.smartLogo,
            title: res.data?.labName,
          })
        );
        setFaviconAndTitle(res.data?.smartLogo, res.data?.labName);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const [loginRequest, setLoginRequest] = useState<loginReqState>({
    username: "",
    password: "",
    deviceId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setLoginRequest({
      ...loginRequest,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  interface CustomJwtPayload extends JwtPayload {
    Lab_Classification: string;
  }
  useLayoutEffect(() => {
    getLogoUrl();
    loadFingerprint();
  }, []);
  const loadFingerprint = async () => {
    const id = await getFingerprint();
    setDeviceId(id);
    setLoginRequest({
      username: "",
      password: "",
      deviceId: id,
    }); // You now have the fingerprint in state
  };
  const loginUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    await AccountService.userLogin(loginRequest)
      .then((res: IApiResponse<any>) => {
        if (res.data.status === 400) {
          toast.error(res.data.message);
          setLoginRequest({
            username: loginRequest.username,
            password: "",
            deviceId: deviceId,
          });
          return;
        }
        if (res.data.isNewUser) {
          navigate("/security-questions-username", {
            state: { userId: res.data.userId, username: res.data.username },
          });
          return;
        }
        const selectedTenants = res?.data?.authTenants?.find(
          (item: any) => item?.isSelected
        );

        // Uncomment the following lines if you want to handle MFA (Multi-Factor Authentication) in the future

        if (selectedTenants.isEnableMFA && !selectedTenants?.byPassMFA) {
          navigate(
            `/authentication/${selectedTenants?.tenantId}/${res.data.userId}`,
            {
              state: {
                labId: selectedTenants?.tenantId,
                userId: res?.data?.userId,
                mfaTrustedDeviceDays: selectedTenants?.mfaTrustedDeviceDays,
                username: loginRequest?.username,
                password: loginRequest?.password,
              },
            }
          );
        }

        const data = res.data;
        const encryptData: any = Encrypt(JSON.stringify(res.data));
        const decodedToken: CustomJwtPayload = jwtDecode(data.token);

        sessionStorage.setItem("userinfo", encryptData);

        dispatch(setLabType(decodedToken?.Lab_Classification));
        dispatch(setRefreshToken(data.refreshToken));
        dispatch(setUserInfo(encryptData));

        // additional Check for external Login
        if (window.location.pathname === "/externallogin") {
          setValueIntoSessionStorage("externalLogin", "true");
        }

        LoginRoute(data);
        let TokenDetails = getTokenData();
        dispatch(setTokenData(TokenDetails));

        if (process.env.NODE_ENV === "production") {
          setLoading(false);
          if (res.status === 200) {
            toast.success(t("Logged In!"));
          }
        }
      })
      .catch((err) => {
        if (err?.response?.data?.status === 401) {
          toast.error(t("Incorrect Username or Password"));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`Login ${webInfo?.title ? `| ${webInfo?.title}` : ""}`}</title>
      </Helmet>
      <div
        className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
        style={{
          backgroundImage: `url('${process.env.PUBLIC_URL}/media/illustrations/login/sketch-1.png')`,
        }}
      >
        <div
          className={
            "d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20"
          }
          style={{ minHeight: "100vh" }}
        >
          <div className="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
            <form
              className="form w-100"
              onSubmit={loginUser}
              id="kt_login_signin_form"
            >
              <a href="#" className="mb-12 d-flex justify-content-center">
                {logoUrl && <img alt="Logo" src={logoUrl} className="h-45px" />}
              </a>
              <div className="text-center mb-10">
                <h1 className="text-dark mb-3">{t("Sign In")}</h1>
              </div>
              <div className="fv-row mb-10">
                <label className="form-label fs-6 fw-bolder text-dark">
                  {t("Username")}
                </label>
                <input
                  placeholder={t("Username")}
                  required
                  name="username"
                  onChange={handleInputChange}
                  value={loginRequest.username}
                  className="form-control form-control-lg form-control-solid"
                  type="text"
                  autoComplete="off"
                />
              </div>
              <div className="fv-row mb-10">
                <div className="d-flex justify-content-between mt-n5">
                  <div className="d-flex flex-stack mb-2">
                    <label className="form-label fw-bolder text-dark fs-6 mb-0">
                      {t("Password")}
                    </label>
                  </div>
                </div>
                <div className="d-flex justify-content-between border rounded m-auto">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("Password")}
                    name="password"
                    required
                    onChange={handleInputChange}
                    value={loginRequest.password}
                    autoComplete="off"
                    className="form-control form-control-lg form-control-solid"
                  />
                  <button
                    type="button"
                    className="border-0 bg-transparent d-flex align-items-center"
                    onClick={toggleShowConfirmPassword}
                  >
                    <i
                      className={`bi ${!showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                    ></i>
                  </button>
                </div>
                <div className="d-flex justify-content-end cursor-pointer text-primary mt-2">
                  <Link
                    to="/forget-password"
                    className="text-primary text-decoration-none text-muted text-decoration-underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <LoadButton
                  loading={loading}
                  btnText={t("Sign In")}
                  loadingText="Signing In..."
                  className="btn btn-primary b-0 w-100 mb-5 h-45px"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(Login);
