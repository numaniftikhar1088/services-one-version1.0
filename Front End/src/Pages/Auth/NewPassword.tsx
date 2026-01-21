import { useEffect, useLayoutEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useLang from "./../../Shared/hooks/useLanguage";
import Commonservice from "Services/CommonService";
import { useDispatch } from "react-redux";
import { setWebInfo } from "Redux/Actions/Index";
import { setFaviconAndTitle } from "Utils/Common/CommonMethods";

const NewPassword = () => {
  const { t } = useLang();
  const [password, setPassword] = useState("");
  const [logoUrl, setLogoUrl] = useState<any>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const location = useLocation();
  const emailOrUsername = location.state?.emailOrUsername;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePasswordStrength = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (!validatePasswordStrength(value)) {
      setConfirmPasswordError("");
      setPasswordError(
        t(
          "Password must be at least 8 characters long, include uppercase, lowercase, numbers, and special characters."
        )
      );
    } else {
      if (confirmPassword !== value) {
        if (confirmPassword === "") {
          setConfirmPasswordError("");
        } else setConfirmPasswordError(t("Passwords do not match."));
      } else {
        setConfirmPasswordError("");
      }
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError(t("Passwords do not match."));
    }
    if (password !== value) {
      setConfirmPasswordError(t("Passwords do not match."));
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error(t("Please fill in all fields"));
      return;
    }
    if (passwordError || confirmPasswordError) {
      toast.error(t("Please fix the errors before submitting"), {
        position: "top-center",
      });
      return;
    }
    if (password && confirmPassword) {
      let obj = {
        user: emailOrUsername,
        newPassword: password,
      };

      SetNewPassword(obj);
    }
  };
  const SetNewPassword = (obj: any) => {
    Commonservice.setnewpassword(obj)
      .then((res: any) => {
        if (res.data?.status === 400) {
          toast.warning(t(res.data.message), {
            position: "top-center",
          });
          return;
        }
        if (res.data?.status === 200) {
          toast.success(t(res.data.message), {
            position: "top-center",
          });
          navigate("/login");
          return;
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  useLayoutEffect(() => {
    getLogoUrl();
  }, []);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (location.state?.fromLogin) {
      setIsValid(true);
    } else {
      navigate("/"); // Redirect to login if accessed directly
    }
  }, [location, navigate]);

  if (!isValid) return null;
  return (
    <div>
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
          <div className="w-lg-550px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
            <form
              className="form w-100"
              id="kt_login_signin_form"
              onSubmit={handleSubmit}
            >
              <a href="#" className="mb-12 d-flex justify-content-center">
                {logoUrl && <img alt="Logo" src={logoUrl} className="h-45px" />}
              </a>
              <div className="text-center mb-5">
                <h2 className="mb-3">{t("Setup New Password")}</h2>
                <div className="text-center mb-5">
                  <Alert variant="info" className="p-1">
                    {t(
                      "Use 8 or more characters with a mix of letters (both cases), numbers, and symbols."
                    )}
                  </Alert>
                </div>
              </div>

              <div className="d-flex justify-content-between border rounded m-auto mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="form-control border-0"
                  placeholder={t("New Password")}
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
              {passwordError && (
                <div className="text-danger mb-3">{passwordError}</div>
              )}

              <div className="d-flex justify-content-between border rounded m-auto">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className="form-control border-0"
                  placeholder={t("Re-enter Password")}
                  minLength={8}
                />
                <button
                  type="button"
                  className="border-0 bg-transparent d-flex align-items-center"
                  onClick={toggleShowConfirmPassword}
                >
                  <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  ></i>
                </button>
              </div>
              {confirmPasswordError && (
                <div className="text-danger mb-3">{confirmPasswordError}</div>
              )}

              <div className="text-center mt-5">
                <button
                  type="submit"
                  className="btn btn-primary b-0 w-100 mb-5 h-45px"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
