import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { connect, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setFacility, setUserInfo } from "../../Redux/Actions/Index";
import { Decrypt, Encrypt, getTokenData } from "../../Utils/Auth";
import { PortalTypeEnum, UserType } from "../../Utils/Common/Enums/Enums";
import useLang from "./../hooks/useLanguage";

const SelectLab = (props: any) => {
  const { t } = useLang();
  const { User } = props;
  const [userName, setUserName] = useState("");
  const [defaultLabList, setDefaultLabList] = useState([]);
  const dispatch = useDispatch();

  const tokenData = getTokenData();
  let jsonToken = JSON.stringify(tokenData);
  const encryptedInfo = Encrypt(jsonToken);

  const location = useLocation();
  useEffect(() => {
    let decryptedData = Decrypt(User?.userInfo);
    let parsedData = JSON.parse(decryptedData);
    setUserName(parsedData.username);
    setDefaultLabList(parsedData.authTenants);
  }, []);
  const navigate = useNavigate();

  const logOutUser = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(setFacility({}));
    dispatch(setUserInfo({}));
    localStorage.clear();
    sessionStorage.clear();

    navigate("/login");
  };

  const onSelectLabs = async (e: any) => {
    const tokenData = getTokenData();
    let selectedText = e.target.outerText;
    let selectedLabFacility: any = {
      lab:
        User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ==
          PortalTypeEnum.Facility &&
        User?.selectedTenantInfo?.infomationOfLoggedUser?.userType ==
          UserType.LabUser
          ? User?.labinfo?.name
          : selectedText,
      facility:
        User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ==
          PortalTypeEnum.Facility &&
        User?.selectedTenantInfo?.infomationOfLoggedUser?.userType ==
          UserType.LabUser &&
        selectedText,
    };
    const jsonObjSelectedLabFacility = JSON.stringify(selectedLabFacility);
    //localStorage.setItem("selectedLabFacility", jsonObjSelectedLabFacility);
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
    //   const jsonToken = JSON.stringify(tokenData);

    //const encryptedInfo = Encrypt(jsonToken);
    // let encryptedData;
    // try {
    //   encryptedData = await Commonservice.saveEncodedText(encryptedInfo);
    // } catch (error) {
    //   console.trace(error);
    // }
    if (
      User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ==
        PortalTypeEnum.Facility &&
      User?.selectedTenantInfo?.infomationOfLoggedUser?.userType ==
        UserType.LabUser
    ) {
      let filteredFacilityInfo = User?.facilityInfo?.filter(
        (items: any) => items?.facilityName === selectedText
      );

      //dispatch(setMultiFacilitiesData(filteredFacilityInfo));
      dispatch(setFacility(filteredFacilityInfo[0]));
      // window.location.href = "/MyFavorites";
      window.location.reload();
      return;
    }

    let t = tokenData.token;

    sessionStorage.clear();
    localStorage.clear();
    dispatch(setUserInfo({}));
    if (process.env.NODE_ENV === "development") {
      window.location.href = `http://localhost:3000/switching?ot=${t}&sk=${key}&pi=${labId}`;
    } else {
      window.location.href = `${uri}/switching?ot=${t}&sk=${key}&pi=${labId}`;
    }

    // if (process.env.NODE_ENV === "development") {
    //   //navigate(`/MyFavorites/${encryptedInfo}`);
    //   window.location.href = `http://localhost:3000/Login?key=${encryptedData?.data?.data}`;
    // }
    // if (process.env.NODE_ENV === "production") {
    //   window.location.href = `${uri}/Login?key=${encryptedData?.data?.data}`;
    // }
  };

  // const onSelectLabs = (e: any) => {
  //   let selectedText = e.target.outerText;
  //   let filteredArray: any[] = defaultLabList.filter(
  //     (items: any) => items?.name === selectedText
  //   );
  //   let filterIndex = filteredArray[0];
  //   const labInfo = {
  //     name: filterIndex?.name,
  //     logo: filterIndex?.logo,
  //     url: filterIndex?.url,
  //   };

  //   dispatch(setHeadersKey(filterIndex?.key));
  //   dispatch(setLabLogo(labInfo));

  //   if (process.env.NODE_ENV === "development") {
  //     //navigate(`/MyFavorites/${encryptedInfo}`);
  //     window.location.href = `http://localhost:3000/Login?key=${encryptedInfo}`;
  //   }
  //   if (process.env.NODE_ENV === "production") {
  //     window.location.href = `${filterIndex?.url}/Login?key=${encryptedInfo}`;
  //   }
  // };
  //let route = "/MyFavorites";
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isShown, setIsShown] = useState<any>(false);
  const AsideMenuShowOnMobileFn = () => {
    setIsShown((current: any) => !current);
  };
  const classesna: any = "drawer drawer-start drawer-on";

  return (
    <>
      {/* **************** Select A Portal Dropdown ***************** */}

      {User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ==
        PortalTypeEnum.Facility ||
      User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
        PortalTypeEnum.Sales ? (
        <>
          {User?.facilityInfo?.length > 1 ? (
            <>
              <span className="d-none d-sm-block">{t("Select Facility")}</span>
              <Dropdown
                onSelect={(eventKey: any, e: any) => onSelectLabs(e)}
                className="w-200px w-md-300px w-lg-400px select-a-portal-dropdown"
              >
                <Dropdown.Toggle
                  variant="white"
                  className="cursor-pointer dropdown-toggle show w-100 del-before h-35px h-md-40px d-flex align-items-center justify-content-between"
                >
                  <span>{User?.facilityData?.facilityName}</span>
                  <i className="bi bi-chevron-down p-0"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold fs-6 py-2">
                  {User?.facilityInfo?.map((facility: any, i: any) => (
                    <Dropdown.Item
                      key={i}
                      className="menu-item my-1 bg-transparent "
                    >
                      <span className="menu-link d-flex justify-content-between align-items-center bg-trans">
                        {facility.facilityName}
                      </span>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : null}
        </>
      ) : (
        <>
          {User?.token?.authTenants?.length > 1 ? (
            <>
              <span className="d-none d-sm-block">{t("Select Lab")}</span>
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
                <Dropdown.Menu className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold fs-6 py-2"
                style={{ zIndex: 9999 }}
                >
                   
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
    </>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(SelectLab);
