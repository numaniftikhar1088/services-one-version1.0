import React, { useLayoutEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ISelectLabProps } from "../../Interface/Lab";
import { loginReqState } from "../../Interface/Login/LoginData";
import { IApiResponse } from "../../Interface/Shared/ApiResponse";
import {
  setFacilityClaims,
  setFacilityUserType,
  setHeadersKey,
  setLabLogo,
  setLoggedInUserInfo,
  setMultiFacilitiesData,
  setUserInfo,
} from "../../Redux/Actions/Index";
import AccountService from "../../Services/Account/AccountService";
import Commonservice from "../../Services/CommonService";
import LoadButton from "../../Shared/Common/LoadButton";
import {
  Decrypt,
  Encrypt,
  getLoggedInLabDetails,
  getParameterByName,
  setLabCredentials,
} from "../../Utils/Auth";
import { PortalTypeEnum, UserType } from "../../Utils/Common/Enums/Enums";
// import useLang from "Shared/hooks/useLanguage";
import useLang from "./../../Shared/hooks/useLanguage";

const Login = ({ User }: ISelectLabProps) => {
  const { t } = useLang();
  const [logoUrl, setLogoUrl] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    getLogoUrl();
  }, []);
  useLayoutEffect(() => {
    CheckForRedirect();
    // return cleanUp = () => {
    // }
  }, []);
  const getLogoUrl = () => {
    Commonservice.getLoginPageLogo()
      .then((res: any) => {
        setLogoUrl(res.data);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const CheckForRedirect = async () => {
    let selectedLabFacility: any = localStorage.getItem("selectedLabFacility");
    let parsedSelectedLabFacility = JSON.parse(selectedLabFacility);
    //dispatch(setLabName(selectedLab));
    let decryptionId = getParameterByName("key", window.location.href);

    let decryptedData;
    if (decryptionId) {
      await Commonservice.getEncodedText(decryptionId)
        .then((res: any) => {
          var decryteddata = Decrypt(res?.data?.data?.encodedText);

          //   localStorage.setItem("userinfo", tokendata);
          //   var decryteddata = Decrypt(tokendata);
          //
          let parsedData = JSON.parse(decryteddata);
          // dispatch(setDecryptionId(decryptionId));
          dispatch(setUserInfo(parsedData));

          //   // decryteddata = Decrypt(tokendata);

          let uri = "";
          if (parsedData?.authTenants?.length == 0) return;
          parsedData?.authTenants?.forEach((item: any) => {
            if (item?.name === parsedSelectedLabFacility?.lab) {
              item.isSelected = true;
              uri = item.url;
            } else item.isSelected = false;
          });

          LoginRoute(parsedData);
          const encryptData: any = Encrypt(decryteddata);
          localStorage.setItem("userinfo", encryptData);
          //   // localStorage.setItem("userinfo", JSON.stringify(decryteddata));
          //window.location.href = "/MyFavourite";
        })
        .catch((err: any) => {});
    }

    // let userinfoExist = localStorage.getItem("userinfo");
    //

    // if (tokendata) {
    //   localStorage.setItem("userinfo", tokendata);
    //   var decryteddata = Decrypt(tokendata);
    //
    //   dispatch(setUserInfo(decryteddata));
    //   // decryteddata = Decrypt(tokendata);
    //   //
    //   LoginRoute(decryteddata);
    //   // localStorage.setItem("userinfo", JSON.stringify(decryteddata));
    //   // window.location.href = "/MyFavorites";
    // }
  };
  const [loginRequest, setLoginRequest] = useState<any>({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  // const {
  //   run,
  //   apiData: { data, loading, error },
  // } = UseApi(`${process.env.REACT_APP_BASE_URL}/${routes.Login}`, "POST", loginRequest);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setLoginRequest({
      ...loginRequest,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  // const [isDefaultCount, setIsDefaultCount] = useState(0);
  // const userDefaultLab = ({ isDefault }: AuthTenantsEntity) => {
  //   if (isDefault === true) {
  //     setIsDefaultCount(isDefaultCount + 1);
  //   }
  // };

  const SetPortalInfoAndNavigateToFavourite = (
    selectedPortal: any,
    isNavigate = true
  ) => {
    dispatch(setHeadersKey(selectedPortal.key));
    dispatch(
      setLabLogo({
        name: selectedPortal.name,
        logo: selectedPortal.logo,
      })
    );
    if (isNavigate) navigate("/MyFavourite");
  };
  const SetPortalInfoAndNavigateToSelectFacility = (
    selectedPortal: any,
    Facilities: any
  ) => {
    dispatch(setHeadersKey(selectedPortal.key));
    dispatch(
      setLabLogo({
        name: selectedPortal.name,
        logo: selectedPortal.logo,
      })
    );
    dispatch(setMultiFacilitiesData(Facilities));
    navigate("/SelectFacility");
  };
  const SetFacilityInfoAndNavigateToFavourite = (facilityInfo: any) => {
    //dispatch(setFacility({ facilityInfo }));
    let stringfiedfacilityInfo = JSON.stringify(facilityInfo);
    sessionStorage.setItem("facilityInfo", stringfiedfacilityInfo);
    navigate("/MyFavorites");
  };
  const LoginRoute = (data: any) => {
    let loggedInLabUserInfo = getLoggedInLabDetails(data);
    let info = { ...loggedInLabUserInfo };
    dispatch(setLoggedInUserInfo(info));
    dispatch(setFacilityUserType(info?.userType));
    dispatch(
      setFacilityClaims(
        info?.selectedTenantsInfo?.infomationOfLoggedUser?.claims
      )
    );
    if (
      loggedInLabUserInfo.selectedTenantsInfo &&
      loggedInLabUserInfo.userType === UserType.LabUser &&
      loggedInLabUserInfo.adminType === PortalTypeEnum.Admin
    ) {
      SetPortalInfoAndNavigateToFavourite(
        loggedInLabUserInfo.selectedTenantsInfo
      );
    } else if (
      !loggedInLabUserInfo.selectedTenantsInfo &&
      loggedInLabUserInfo.authTenants.length > 1 &&
      loggedInLabUserInfo.userType === UserType.Master &&
      loggedInLabUserInfo.adminType === PortalTypeEnum.Admin
    ) {
      navigate("/SelectLab");
    } else if (
      loggedInLabUserInfo.selectedTenantsInfo &&
      loggedInLabUserInfo.authTenants.length > 1 &&
      loggedInLabUserInfo.userType === UserType.Master &&
      loggedInLabUserInfo.adminType === PortalTypeEnum.Admin
    ) {
      SetPortalInfoAndNavigateToFavourite(
        loggedInLabUserInfo.selectedTenantsInfo
      );
    } else if (
      !loggedInLabUserInfo.selectedTenantsInfo &&
      loggedInLabUserInfo.authTenants.length > 1 &&
      loggedInLabUserInfo.userType === UserType.LabUser &&
      loggedInLabUserInfo.adminType === PortalTypeEnum.Admin
    ) {
      navigate("/SelectLab");
    } else if (
      loggedInLabUserInfo.selectedTenantsInfo &&
      loggedInLabUserInfo.adminType === PortalTypeEnum.Facility
    ) {
      if (loggedInLabUserInfo?.SelectedLabFacilities.length > 1) {
        SetPortalInfoAndNavigateToSelectFacility(
          loggedInLabUserInfo?.selectedTenantsInfo,
          loggedInLabUserInfo?.SelectedLabFacilities
        );
      } else {
        SetPortalInfoAndNavigateToFavourite(
          loggedInLabUserInfo?.selectedTenantsInfo,
          false
        );
        SetFacilityInfoAndNavigateToFavourite(
          loggedInLabUserInfo?.SelectedLabFacilities[0]
        );
      }
    }
  };

  const loginUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    await AccountService.userLogin(loginRequest)
      .then((res: IApiResponse<any>) => {
        const data = res.data;

        const encryptData: any = Encrypt(JSON.stringify(res.data));
        localStorage.setItem("userinfo", encryptData);
        dispatch(setUserInfo(data));
        // data.authTenants?.map((tenant: AuthTenantsEntity) =>
        //   userDefaultLab(tenant)
        // );
        LoginRoute(data);

        if (process.env.NODE_ENV === "production") {
          const labCredentials = setLabCredentials(
            window.location.href,
            res.data
          );
          const currentLabCrendials = setLabCredentials(
            window.location.protocol + "//" + window.location.hostname,
            res.data
          );
          setLoading(false);
          if (res.status === 200) {
            toast.success(t("Logged In!"));

            // if (labCredentials) {
            //   dispatch(setHeadersKey(labCredentials?.key));
            //   dispatch(
            //     setLabLogo({
            //       name: labCredentials?.name,
            //       logo: labCredentials?.logo,
            //     })
            //   );
            //   navigate("/MyFavourite");
            // }
            // if (currentLabCrendials) {
            //   dispatch(setHeadersKey(labCredentials?.key));
            //   dispatch(
            //     setLabLogo({
            //       name: labCredentials?.name,
            //       logo: labCredentials?.logo,
            //     })
            //   );
            //   navigate("/MyFavourite");
            // }
            // if (!labCredentials && !currentLabCrendials) {
            //   navigate("/SelectLab");
            // }
          }

          // if (isDefaultCount === 0) {
          //   navigate("/SelectLab");
          // } else {
          //   if (isDefaultCount === 1) {
          //     navigate("/home");
          //   }
          // }
        }
      })
      .catch((err) => {
        //
        if (err.response.data.status === 401) {
          toast.error(t("Incorrect Username or Password"));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div
        className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
        style={{
          backgroundImage: `url('${process.env.PUBLIC_URL}/media/illustrations/login/sketch-1.png')`,
        }}
      >
        <div
          className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
            <form
              className="form w-100"
              onSubmit={loginUser}
              id="kt_login_signin_form"
            >
              <a href="#" className="mb-12 d-flex justify-content-center">
                <img alt="Logo" src={logoUrl} className="h-45px" />
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
                <input
                  type="password"
                  placeholder={t("Password")}
                  name="password"
                  required
                  onChange={handleInputChange}
                  value={loginRequest.password}
                  autoComplete="off"
                  className="form-control form-control-lg form-control-solid"
                />
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
};

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(Login);
