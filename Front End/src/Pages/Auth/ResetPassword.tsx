import { AxiosError } from "axios";
import HttpClient from "HttpClient";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setWebInfo } from "Redux/Actions/Index";
import Commonservice from "Services/CommonService";
import Splash from "Shared/Common/Pages/Splash";
import useLang from "Shared/hooks/useLanguage";
import { setFaviconAndTitle } from "Utils/Common/CommonMethods";
import LoadButton from "../../Shared/Common/LoadButton";
import SecurityQuestions from "./SecurityQuestions/SecurityQuestions";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [valid, setValid] = useState(true);
  const [isNotSecurityQuestionAdded, setIsNotSecurityQuestionAdded] =
    useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(false);

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [ticket, setTicket] = useState<any>("");
  const [loader, setLoader] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const dispatch = useDispatch();
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const questionsAnsweredState = localStorage.getItem("questionsAnswered");
    if (questionsAnsweredState === "true") {
      setQuestionsAnswered(true);
    }

    setLoader(true);
    const url = window?.location?.search;
    const urlParams = new URLSearchParams(url.split("??")[1]);
    const ticket = urlParams.get("ticket");
    const type = urlParams.get("type");
    setTicket(ticket);

    if (ticket && type) {
      const requestBody = {
        ticket: ticket,
        ticketType: parseInt(type),
      };
      HttpClient()
        .post(`/api/Account/ValidateTicketV2`, requestBody)
        .then((res) => {
          if (res?.data?.status === 200) {
            setValid(true);
            setLoader(false);
            setUserId(res?.data?.data?.id);
            setIsNotSecurityQuestionAdded(res?.data?.data?.id);
          } else if (
            res?.data?.status === 400 &&
            res?.data?.title === "Invalid/Expired"
          ) {
            setValid(false);
            setLoader(false);
            toast.error(
              t("Link is expired, please contact your administrator")
            );
          }
        })
        .catch((error: AxiosError) => {
          console.error(error);
          setValid(false);
          toast.error(t("Link is expire, please contact your administrator"));
        })
        .finally(() => {
          setLoader(false);
        });
    } else {
      toast.error(t("Invalid url"));
    }
  }, []);

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setLoading(false);
      toast.error(t("Passwords did not match"));
      return;
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/;
      
    if (!passwordRegex.test(newPassword)) {
      setLoading(false);
      toast.error(
        t(
          "Use 8 or more characters with a mix of letters (both cases), numbers, and symbols."
        )
      );
      return;
    }
    e.preventDefault();

    const objToSend = {
      userId: userId,
      newPassword: newPassword,
      ticket: ticket,
    };

    HttpClient()
      .post(`/api/Account_V2/ResetPassword`, objToSend)
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.message);
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else if (res?.data?.statusCode === 400) {
          toast.error(res?.data?.message);
        } else {
          toast.error(t("something went wrong please try again later"));
        }
      })
      .catch((err: string) => {
        console.trace("tesarbombaaa💣💣💣💣💣", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loader) {
    return <Splash />;
  }

  if (!valid) {
    return (
      <div className="d-flex flex-column flex-center flex-column-fluid">
        <div className="d-flex flex-column flex-center text-center p-10">
          <div className="card card-flush w-lg-650px py-5">
            <div className="card-body py-15 py-lg-15">
              <h1 className="fw-bolder fs-2hx text-gray-900 mb-4">
                {t("Oops!")}
              </h1>
              <div className="fw-semibold fs-6 text-gray-500">
                {t("Link is Expired")}
              </div>

              <div className="mb-1">
                <img
                  src={`${
                    process.env.PUBLIC_URL +
                    "/media/menu-svg/password-expiry.svg"
                  }`}
                  className="mw-100 mh-300px"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (valid && isNotSecurityQuestionAdded && !questionsAnswered) {
    return (
      <SecurityQuestions
        setQuestionsAnswered={setQuestionsAnswered}
        userId={userId}
      />
    );
  }

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
          <div className="w-lg-560px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
            <form className="form w-100" id="kt_login_signin_form">
              <a href="#" className="mb-12 d-flex justify-content-center">
                {logoUrl && <img alt="Logo" src={logoUrl} className="h-45px" />}
              </a>
              <div className="text-center mb-5">
                <h2 className="mb-3">{t("Reset Password")}</h2>
                <Alert variant="danger" className="p-1">
                  {t(
                    "Your new Password should not be the same as your current password"
                  )}
                </Alert>
              </div>
              <div className="d-flex justify-content-between border rounded m-auto">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              <div className="d-flex justify-content-between border rounded m-auto my-3">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control border-0"
                  placeholder={t("Confirm Password")}
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
              <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center pb-lg-0">
                <LoadButton
                  className="btn btn-sm fw-bold btn-primary"
                  btnText={t("Submit")}
                  loading={loading}
                  loadingText="Please wait..."
                  onClick={handleSubmit}
                />
                <Link to="/" className="btn btn-sm fw-bold btn-secondary">
                  {t("Cancel")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
