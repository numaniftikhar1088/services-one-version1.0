import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setFacility,
  setFacilityClaims,
  setHeadersKey,
  setLabLogo,
  setMultiFacilitiesData,
  setPagesLinks,
  setSelectedTenantInfo,
  setUserInfo,
} from "../../Redux/Actions/Index";
import { Encrypt, getLoggedInLabDetails } from "../../Utils/Auth";
import { PortalTypeEnum, UserType } from "../../Utils/Common/Enums/Enums";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SetPortalInfoAndNavigateToSelectFacility = (
    selectedPortal: any,
    Facilities: any
  ) => {
    dispatch(setHeadersKey(selectedPortal.key));
    dispatch(
      setLabLogo({
        name: selectedPortal.name,
        logo: selectedPortal.logo,
        smartLogo: selectedPortal.smartLogo,
      })
    );
    dispatch(setMultiFacilitiesData(Facilities));
    navigate("/SelectFacility");
  };

  const SetPortalInfoAndNavigateToFavourite = (
    selectedPortal: any,
    isNavigate = true
  ) => {
    let navigated = false;

    if (isNavigate) {
      const claimsModules = selectedPortal?.infomationOfLoggedUser?.claims;

      if (Array.isArray(claimsModules)) {
        for (const module of claimsModules) {
          if (!Array.isArray(module.claims)) continue;

          for (const claim of module.claims) {
            if (claim?.isDefaultSelect) {
              navigate(claim.linkUrl);
              navigated = true;
              break;
            }
          }

          if (navigated) break;
        }
      }
    }

    // Set portal-related data
    dispatch(setHeadersKey(selectedPortal.key));
    dispatch(
      setLabLogo({
        name: selectedPortal.name,
        logo: selectedPortal.logo,
        smartLogo: selectedPortal.smartLogo,
      })
    );
    dispatch(setFacilityClaims(selectedPortal?.infomationOfLoggedUser?.claims));

    // If no default claim was found and isNavigate is true, go to MyFavorites
    if (isNavigate && !navigated) {
      navigate("/MyFavorites");
    }
  };

  const LoginRoute = (data: any) => {
    const encryptData: any = Encrypt(JSON.stringify(data));
    sessionStorage.setItem("userinfo", encryptData);
    dispatch(setUserInfo(encryptData));
    const loggedInLabUserInfo = getLoggedInLabDetails(data);

    const { selectedTenantsInfo, userType, tenantCount } = loggedInLabUserInfo;

    localStorage.setItem(
      "isHideSideMenu",
      selectedTenantsInfo?.infomationOfLoggedUser?.isHideSideMenu
    );

    if (selectedTenantsInfo) {
      dispatch(setSelectedTenantInfo(selectedTenantsInfo));
      if (
        selectedTenantsInfo?.infomationOfLoggedUser?.adminType ===
        PortalTypeEnum.Admin
      ) {
        const linkUrlIdArray: any = [];

        selectedTenantsInfo?.infomationOfLoggedUser?.claims.forEach(
          (module: any) => {
            module.claims.forEach((claim: any) => {
              linkUrlIdArray.push({
                linkUrl: claim.linkUrl,
                id: claim.id,
              });
            });
          }
        );

        dispatch(setPagesLinks(linkUrlIdArray));
      }
    }
    //let userType:UserType=UserType[userType];
    // if (
    //   (!selectedTenantsInfo && userType === 0 && tenantCount > 1) ||
    //   (!selectedTenantsInfo && userType === 1 && tenantCount > 1)
    // )

    if (
      (!selectedTenantsInfo &&
        userType === UserType.Master &&
        tenantCount > 1) ||
      (!selectedTenantsInfo && userType === UserType.LabUser && tenantCount > 1)
    ) {
      navigate("/SelectLab");
    } else if (
      selectedTenantsInfo?.infomationOfLoggedUser?.adminType ===
      PortalTypeEnum.Admin
    ) {
      SetPortalInfoAndNavigateToFavourite(selectedTenantsInfo);
    } else if (
      selectedTenantsInfo?.infomationOfLoggedUser?.adminType ===
      PortalTypeEnum.Facility
    ) {
      if (loggedInLabUserInfo?.SelectedLabFacilities.length > 1) {
        SetPortalInfoAndNavigateToSelectFacility(
          loggedInLabUserInfo?.selectedTenantsInfo,
          loggedInLabUserInfo?.SelectedLabFacilities
        );

        const linkUrlIdArray: any = [];
        selectedTenantsInfo?.infomationOfLoggedUser?.claims.forEach(
          (module: any) => {
            module.claims.forEach((claim: any) => {
              linkUrlIdArray.push({
                linkUrl: claim.linkUrl,
                id: claim.id,
              });
            });
          }
        );

        dispatch(setPagesLinks(linkUrlIdArray));
      } else {
        SetPortalInfoAndNavigateToFavourite(
          loggedInLabUserInfo?.selectedTenantsInfo,
          false
        );

        const facilityInfo = loggedInLabUserInfo?.SelectedLabFacilities[0];
        const stringfiedfacilityInfo = JSON.stringify(facilityInfo);
        dispatch(setFacility(facilityInfo));
        sessionStorage.setItem("facilityInfo", stringfiedfacilityInfo);

        const claimsModules =
          selectedTenantsInfo?.infomationOfLoggedUser?.claims;

        let navigated = false;

        if (Array.isArray(claimsModules)) {
          for (const module of claimsModules) {
            if (!Array.isArray(module.claims)) continue;

            for (const claim of module.claims) {
              if (claim?.isDefaultSelect) {
                navigate(claim.linkUrl);
                navigated = true;
                break;
              }
            }
            if (navigated) break; // stop outer loop too
          }
        }

        // fallback if no landing page found
        if (!navigated) {
          navigate("/MyFavorites");
        }

        const linkUrlIdArray: any = [];
        selectedTenantsInfo?.infomationOfLoggedUser?.claims.forEach(
          (module: any) => {
            module.claims.forEach((claim: any) => {
              linkUrlIdArray.push({
                linkUrl: claim.linkUrl,
                id: claim.id,
              });
            });
          }
        );

        dispatch(setPagesLinks(linkUrlIdArray));
      }
    } else {
      const linkUrlIdArray: any = [];
      selectedTenantsInfo?.infomationOfLoggedUser?.claims.forEach(
        (module: any) => {
          module.claims.forEach((claim: any) => {
            linkUrlIdArray.push({
              linkUrl: claim.linkUrl,
              id: claim.id,
            });
          });
        }
      );

      dispatch(setPagesLinks(linkUrlIdArray));

      if (selectedTenantsInfo) {
        SetPortalInfoAndNavigateToFavourite(selectedTenantsInfo);
      }
    }
  };
  return {
    LoginRoute,
  };
};

export default useAuth;
