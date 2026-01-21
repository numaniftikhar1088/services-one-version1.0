import HttpClient from "HttpClient";
import React, { useLayoutEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import {
  setAdminUserId,
  setFacility,
  setMultiFacilitiesData,
  setSelectedMenu,
  setUserInfo,
  setWebInfo,
} from "../../Redux/Actions/Index";
import AccountService from "../../Services/Account/AccountService";
import { Decrypt } from "../../Utils/Auth";
import Commonservice from "Services/CommonService";
import { setFaviconAndTitle } from "Utils/Common/CommonMethods";

const ChangePassword: React.FC = () => {
  const { t } = useLang();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleVisibility = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };

  const logOutUser = async () => {
    await AccountService.userLogout();
    dispatch(setAdminUserId(null));
    dispatch(setFacility({}));
    dispatch(setUserInfo({}));
    dispatch(setSelectedMenu(null));
    dispatch(setMultiFacilitiesData(null));
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(t("Passwords did not match"));
      return;
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        t(
          "Use 8 or more characters with a mix of letters (both cases), numbers, and symbols."
        )
      );
      return;
    }

    const localUserInfo = sessionStorage.getItem("userinfo");
    let userInfo = localUserInfo ? JSON.parse(Decrypt(localUserInfo)) : {};

    const objToSend = {
      userId: userInfo.userId,
      newPassword,
      oldPassword,
    };

    HttpClient()
      .post(`/api/Account_V2/ChangePassword`, objToSend)
      .then((res) => {
        const { statusCode, message } = res?.data || {};
        if (statusCode === 200) {
          toast.success(message);
          logOutUser();
        } else if (statusCode === 400) {
          toast.error(message);
        } else {
          toast.error(t("something went wrong please try again later"));
        }
      })
      .catch((err: unknown) => console.trace("Error:", err));
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
  useLayoutEffect(() => {
    getLogoUrl();
  }, []);
  return (
    <div
      className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
      style={{
        backgroundImage: 'url("/media/illustrations/login/sketch-1.png")',
      }}
    >
      <div
        className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-lg-560px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
          <form
            className="form w-100"
            id="kt_login_signin_form"
            onSubmit={handleSubmit}
          >
            <a href="#" className="mb-12 d-flex justify-content-center">
              {logoUrl && <img alt="Logo" src={logoUrl} className="h-45px" />}
            </a>
            <div className="text-center mb-5">
              <h2 className="mb-3">{t("Change Password")}</h2>
              <Alert variant="danger" className="p-1">
                {t(
                  "Your new Password should not be the same as your current password"
                )}
              </Alert>
            </div>

            <PasswordInput
              showPassword={showOldPassword}
              setShowPassword={() => toggleVisibility(setShowOldPassword)}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={t("Old Password")}
            />

            <PasswordInput
              showPassword={showPassword}
              setShowPassword={() => toggleVisibility(setShowPassword)}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("New Password")}
            />

            <PasswordInput
              showPassword={showPassword}
              setShowPassword={() => toggleVisibility(setShowPassword)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("Confirm Password")}
            />

            <div className="d-flex flex-wrap justify-content-center pb-lg-0">
              <button type="submit" className="btn btn-primary me-4 h-45px">
                <span className="indicator-label">{t("Submit")}</span>
                <span className="indicator-progress">
                  {t("Please wait...")}
                  <span className="spinner-border spinner-border-sm align-middle ms-2" />
                </span>
              </button>
              <Link
                to="/MyFavorites"
                className="d-flex align-items-center btn btn-sm fw-bold btn-cancel h-45px"
              >
                {t("Cancel")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface PasswordInputProps {
  showPassword: boolean;
  setShowPassword: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  showPassword,
  setShowPassword,
  value,
  onChange,
  placeholder,
}) => (
  <div className="d-flex my-4 mx-4">
    <input
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      className="form-control"
      placeholder={placeholder}
      minLength={8}
    />
    <div className="input-group-btn">
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={setShowPassword}
      >
        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
      </button>
    </div>
  </div>
);

export default ChangePassword;
