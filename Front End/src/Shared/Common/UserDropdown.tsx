import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Decrypt } from "../../Utils/Auth";
import useLogoutListener from "../hooks/useLogoutListener";
import TranslationMenu from "../TranslationMenu";
import useLang from "./../hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

const UserDropdown = (props: any) => {
  const { t } = useLang();
  const { User } = props;
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const logout = useLogoutListener();



// for mobile responsiveness
// Add this hook at the top of your file (or in a utils/hooks file)



const isMobile = useIsMobile();

  useEffect(() => {
    if (Object.keys(User?.userInfo).length) {
      let decryptedData = Decrypt(User?.userInfo);
      let parsedData = JSON.parse(decryptedData);
      setUserName(parsedData.username);
    }
  }, [User]);

  
  const navigate = useNavigate();

  const logOutUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    logout();
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (User?.userInfo) {
      try {
        const decryptedData = Decrypt(User.userInfo);
        const parsedData = JSON.parse(decryptedData);
        if (parsedData && parsedData.userId) {
          setUserId(parsedData.userId);
        } else {
          console.error(
            "Decrypted data does not contain userId:",
            decryptedData
          );
        }
      } catch (error) {
        console.error("Error decrypting or parsing userInfo:", error);
      }
    }
  }, [User]);
  return (
    <>
   
      <div className={`position-relative   ${isMobile && 'ms-15'}`}>
      
        {/* **************** User Detail Dropdown ***************** */}
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="cursor-pointer symbol p-0 del-before  min-w-25px "
          onClick={handleClick}
        >
           
          <div
            className={!isMobile ? "d-flex align-items-center text-gray-900" : ""}
             
              style={!isMobile ? { width: 250 } : undefined}  
         
            data-test-id="user-menu-button"
          >
            <div
              className="symbol symbol-35px me-3 "
              data-test-id="user-menu-button-img"
            >
              <div className="  symbol-label align-items-start bg-light-primary justify-content-start"> 
                <div className=" text-primary fs-2 first-letter ">{userName}</div>
              </div> 
            </div>
          


{/* Hide username on mobile */}
    {!isMobile && !props.isOpen && (
      <Tooltip title={userName}>
        <span
          className="fw-semibold text-wrap lh-1"
          data-test-id="user-menu-button-label"
        >
          {userName}
        </span>
      </Tooltip>
    )} 


          </div>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ "aria-labelledby": "basic-button" }}
          className="menu-rounded menu-gray-800 menu-state-bg menu-state-color py-4 user-sign-dropdown"
        >
          <MenuItem
            className="menu-item w-275px m-0 px-3"
            onClick={handleClose}
            data-test-id="user-menu"
          >
            <div className="d-flex align-items-center text-gray-900">
              <div className="symbol symbol-35px me-3">
                <div className="symbol-label bg-light-primary justify-content-start">
                  <div className="text-primary fs-2 first-letter text-uppercase">
                    {userName}
                  </div>
                </div>
              </div>
              <span className="fw-semibold">{userName}</span>
            </div>
          </MenuItem>

          {/*begin::Menu separator*/}
          <div className="separator my-2" />
          {/*end::Menu separator*/}

          <div className="m-4">
            <TranslationMenu handleClose={handleClose} />
          </div>
          <MenuItem
            data-test-id="user-account-setting"
            className="menu-item w-275px m-0 px-5 my-1"
            onClick={() => navigate("account-settings")}
          >
            <span className="menu-link p-0">{t("Account Settings")}</span>
          </MenuItem>

          <MenuItem
            className="menu-item w-275px m-0 px-5"
            onClick={handleClose}
          >
            <Link
              className="menu-link p-0"
              to={`/ChangePassword/${userId}`}
              data-test-id="user-change-password"
            >
              {t("Change Password")}
            </Link>
          </MenuItem>
          <MenuItem
            className="menu-item w-275px m-0 px-5"
            onClick={handleClose}
          >
            <Link
              className="menu-link p-0"
              to={"security/password"}
              data-test-id="user-change-security-question"
            >
              {t("Change Security Questions")}
            </Link>
          </MenuItem>
          <MenuItem
            data-test-id="user-sign-out"
            className="menu-item w-275px m-0 px-5"
          >
            <span onClick={logOutUser} className="menu-link p-0">
              {t("Sign Out")}
            </span>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(UserDropdown);
