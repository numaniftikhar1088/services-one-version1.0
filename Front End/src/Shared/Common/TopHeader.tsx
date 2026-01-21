import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { connect, useDispatch } from "react-redux";
import { setFacility, setUserInfo } from "../../Redux/Actions/Index";
import { Decrypt, getTokenData } from "../../Utils/Auth";
import { PortalTypeEnum, UserType } from "../../Utils/Common/Enums/Enums";
import useLang from "./../hooks/useLanguage";
import AsideMenu from "./AsideMenu";
import UserDropdown from "./UserDropdown";

const TopHeader = (props: any) => {
  const { t } = useLang();
  const { User } = props;
  const [defaultLabList, setDefaultLabList] = useState([]);
  const dispatch = useDispatch();

  const isHideSideMenu = JSON.parse(
    localStorage.getItem("isHideSideMenu") || "false"
  );

  useEffect(() => {
    try {
      const decryptedData = Decrypt(User?.userInfo);
      const parsedData = JSON.parse(decryptedData);
      setDefaultLabList(parsedData.authTenants);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onSelectLabs = async (e: any) => {
    const tokenData = getTokenData();
    const selectedText = e.target.outerText;
    const selectedLabFacility: any = {
      lab:
        User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
          PortalTypeEnum.Facility &&
        User?.selectedTenantInfo?.infomationOfLoggedUser?.userType ===
          UserType.LabUser
          ? User?.labinfo?.name
          : selectedText,
      facility:
        User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
          PortalTypeEnum.Facility &&
        User?.selectedTenantInfo?.infomationOfLoggedUser?.userType ===
          UserType.LabUser &&
        selectedText,
    };
    const jsonObjSelectedLabFacility = JSON.stringify(selectedLabFacility);
    sessionStorage.setItem("selectedLabFacility", jsonObjSelectedLabFacility);
    let uri = "";
    let key = "";
    let labId = "";
    tokenData?.authTenants?.forEach((item: any) => {
      if (item?.name === selectedText) {
        item.isSelected = true;
        uri = item.url;
        key = item.key;
        labId = item.tenantId;
      } else item.isSelected = false;
    });

    if (
      User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
        PortalTypeEnum.Facility &&
      User?.selectedTenantInfo?.infomationOfLoggedUser?.userType ===
        UserType.LabUser
    ) {
      const filteredFacilityInfo = User?.facilityInfo?.filter(
        (items: any) => items?.facilityName === selectedText
      );

      dispatch(setFacility(filteredFacilityInfo[0]));
      window.location.reload();
      return;
    }

    const t = tokenData.token;

    sessionStorage.clear();
    localStorage.clear();
    dispatch(setUserInfo({}));
    if (process.env.NODE_ENV === "development") {
      window.location.href = `http://localhost:3000/switching?ot=${t}&sk=${key}&pi=${labId}`;
    } else {
      window.location.href = `${uri}/switching?ot=${t}&sk=${key}&pi=${labId}`;
    }
  };

  const [isShown, setIsShown] = useState<any>(false);
  const AsideMenuShowOnMobileFn = () => {
    setIsShown((current: any) => !current);
  };

  const classesName: any = "drawer drawer-start drawer-on";

  return (
    <>
      <div id="kt_app_header" className="app-header d-lg-none d-flex">
        {isShown && (
          <div>
            <div
              className="drawer-overlay"
              style={{ zIndex: 105 }}
              onClick={AsideMenuShowOnMobileFn}
            ></div>
            <AsideMenu data={classesName} />
          </div>
        )}
        {/*  mobile issue==> Ticket # 45132 */}
        <div className="app-container container-fluid d-flex align-items-stretch justify-content-between ">
          {isHideSideMenu ? null : (
            <div
              className="d-flex align-items-center d-lg-none ms-n2 me-2"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <span
                  className="svg-icon svg-icon-1"
                  onClick={AsideMenuShowOnMobileFn}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
                      fill="currentColor"
                    />
                    <path
                      opacity="0.3"
                      d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </div>
            </div>
          )}
          <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
            {isHideSideMenu ? (
              <div className="d-lg-none">
                <img
                  alt="Logo"
                  src={props?.User?.labinfo?.logo}
                  className="h-30px d-none d-sm-block"
                />
                <img
                  alt="Logo"
                  src={props?.User?.labinfo?.smartLogo}
                  className="h-30px d-block d-sm-none"
                />
              </div>
            ) : (
              <a href="/" className="d-lg-none">
                <img
                  alt="Logo"
                  src={props?.User?.labinfo?.logo}
                  className="h-30px d-none d-sm-block"
                />
                <img
                  alt="Logo"
                  src={props?.User?.labinfo?.smartLogo}
                  className="h-30px d-block d-sm-none"
                />
              </a>
            )}
          </div>
          <div
            className="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
            id="kt_app_header_wrapper"
          >
            <div className="app-navbar flex-shrink-0">
              <div
                className="app-navbar-item ms-1 ms-lg-3 gap-3"
                id="kt_header_user_menu_toggle"
              >
                {/* **************** Select A Portal Dropdown ***************** */}

                {User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
                PortalTypeEnum.Facility ? (
                  <>
                    {User?.facilityInfo?.length > 1 ? (
                      <>
                        <span className="d-none d-sm-block">
                          {t("Select Facility")}
                        </span>
                        <Dropdown
                          onSelect={(eventKey: any, e: any) => onSelectLabs(e)}
                          className="w-200px w-md-300px w-lg-400px select-a-portal-dropdown z-index-5"
                        >
                          <Dropdown.Toggle
                            variant="white"
                            className="cursor-pointer dropdown-toggle show w-100 del-before h-35px h-md-40px d-flex align-items-center justify-content-between"
                          >
                            <span>{User?.facilityData?.facilityName}</span>
                            <i className="bi bi-chevron-down p-0"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold fs-6 py-2">
                            {User?.facilityInfo?.map(
                              (facility: any, i: any) => (
                                <Dropdown.Item
                                  key={i}
                                  className="menu-item my-1 bg-transparent "
                                >
                                  <span className="menu-link d-flex justify-content-between align-items-center bg-trans">
                                    {facility.facilityName}
                                  </span>
                                </Dropdown.Item>
                              )
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    {User?.token?.authTenants?.length > 1 ? (
                      <>
                        <span className="d-none d-sm-block">
                          {t("Select Lab")}
                        </span>
                        <Dropdown
                          onSelect={(eventKey: any, e: any) => onSelectLabs(e)}
                          className="w-200px w-md-300px w-lg-400px select-a-portal-dropdown"
                        >
                          <Dropdown.Toggle
                            variant="white"
                            className="cursor-pointer dropdown-toggle show w-100 del-before h-35px h-md-40px d-flex align-items-center justify-content-between"
                          >
                            <span>{props?.User?.labinfo?.name}</span>
                            <i className="bi bi-chevron-down p-0"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold fs-6 py-2">
                            {defaultLabList?.map((lab: any, i) => (
                              <Dropdown.Item
                                key={i}
                                className="menu-item my-1 bg-transparent "
                              >
                                <span className="menu-link d-flex justify-content-between align-items-center bg-trans">
                                  {lab.name}
                                </span>
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    ) : null}
                  </>
                )}
                <UserDropdown />
              </div>
              <div
                className="app-navbar-item d-lg-none ms-2 me-n3"
                title="Show header menu"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(TopHeader);
