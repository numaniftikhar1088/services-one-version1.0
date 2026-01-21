import { Box, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IApiResponse } from "../../../Interface/Shared/ApiResponse";
import AccountService from "../../../Services/Account/AccountService";
import { Decrypt } from "../../../Utils/Auth";
// import useLang from "Shared/hooks/useLanguage";
import useLang from "./../../../Shared/hooks/useLanguage";

function ChangeSecurityQuestions() {
  const { t } = useLang();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const user = sessionStorage.getItem("userinfo");
  if (!user) {
    toast.error(t("User information is missing"));
    return null;
  }

  const parsedUserInfo = JSON.parse(Decrypt(user));
  if (!parsedUserInfo) {
    toast.error(t("Failed to decrypt user information"));
    return null;
  }

  const { username } = parsedUserInfo;

  const loginUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error(t("Password is required"));
      return;
    }

    setLoading(true);

    try {
      const userLoginData = { userName: username, password };
      const res: IApiResponse<any> = await AccountService.userLogin(
        userLoginData
      );
      const data = res.data.token;
      if (data) {
        navigate("/security/change-questions", { replace: true });
      } else {
        toast.error("Password Incorrect!");
      }
    } catch (err: any) {
      toast.error(t("An error occurred during login"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-center flex-column-fluid">
      <div className="d-flex flex-column flex-center p-10">
        <div className="card card-flush w-lg-650px py-5">
          <div className="card-body py-15 py-lg-15">
            <div className="text-center">
              <span className="fw-bolder fs-2hx mb-4">
                {t("Change Security Questions?")}
              </span>
            </div>
            <div className="fw-semibold fs-6 text-gray-500 text-center">
              {t("Enter your password to reset security questions")}
            </div>
          </div>
          <div className="d-flex justify-content-between border rounded w-75 m-auto">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control border-0"
              placeholder={t("Password")}
              minLength={8}
            />
            <button
              type="button"
              className="border-0 bg-transparent d-flex align-items-center"
              onClick={toggleShowPassword}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </button>
          </div>
          <Box className="d-flex gap-2 justify-content-center align-items-center mt-5">
            <button
              onClick={() => navigate("/MyFavorites")}
              className="btn btn-secondary mt-4"
            >
              {t("Cancel")}
            </button>
            <button onClick={loginUser} className="btn btn-primary mt-4">
              {loading ? (
                <>
                  <CircularProgress size={15} color="inherit" /> {t("Next")}
                </>
              ) : (
                t("Next")
              )}
            </button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default ChangeSecurityQuestions;
