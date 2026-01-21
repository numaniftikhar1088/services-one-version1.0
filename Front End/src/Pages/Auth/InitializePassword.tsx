import { AxiosError } from "axios";
import HttpClient from "HttpClient";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadButton from "../../Shared/Common/LoadButton";
import { setFaviconAndTitle } from "Utils/Common/CommonMethods";
import Splash from "../../Shared/Common/Pages/Splash";
import SecurityQuestions from "./SecurityQuestions/SecurityQuestions";
// import useLang from "Shared/hooks/useLanguage";
import useLang from "./../../Shared/hooks/useLanguage";
import Commonservice from "Services/CommonService";
import { setWebInfo } from "Redux/Actions/Index";
import { useDispatch } from "react-redux";
const InitializePassword = () => {
  const { t } = useLang();
  const [logoUrl, setLogoUrl] = useState<any>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [isNotSecurityQuestionAdded, setIsNotSecurityQuestionAdded] =
    useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(false);

  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [userId, setUserId] = useState("");
  const [ticket, setTicket] = useState<any>("");
  const dispatch = useDispatch();
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
            setIsNotSecurityQuestionAdded(
              res?.data?.data?.isNotSecurityQuestionAdded
            );
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
          setLoader(false);
          toast.error(t("Link is expired, please contact your administrator"));
        });
    } else {
      toast.error(t("Invalid URL"));
    }
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  useLayoutEffect(() => {
    getLogoUrl();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      toast.error(t("Passwords did not match"));
      return;
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setLoading(false);
      toast.error(
        t(
          "Use 8 or more characters with a mix of letters (both cases), numbers, and symbols."
        )
      );
      return;
    }

    const objToSend = {
      userId: userId,
      password: password,
      ticket: ticket,
    };

    try {
      const res = await HttpClient().post(
        `/api/Account_V2/InitializePassword`,
        objToSend
      );

      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (res?.data?.statusCode === 400) {
        toast.error(res?.data?.message);
      } else {
        toast.error(t("Something went wrong, please try again later."));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("Something went wrong, please try again later."));
    } finally {
      setLoading(false);
    }
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
          <div className="w-lg-550px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
            <form className="form w-100" id="kt_login_signin_form">
              <a href="#" className="mb-12 d-flex justify-content-center">
                {logoUrl && <img alt="Logo" src={logoUrl} className="h-45px" />}
              </a>
              <div className="text-center mb-5">
                <h2 className="mb-3">{t("Setup New Password")}</h2>
                <div className="text-center mb-5">
                  <Alert variant="danger" className="p-1">
                    {t(
                      "Use 8 or more characters with a mix of letters (both cases), numbers, and symbols."
                    )}
                  </Alert>
                </div>
              </div>

              <div className="d-flex justify-content-between border rounded m-auto">
                <input
                id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control border-0"
                  placeholder={t("Password")}
                  minLength={8}
                />
                <button
                  id="Password_Eye"
                  type="button"
                  className="border-0 bg-transparent d-flex align-items-center"
                  onClick={() => toggleShowPassword()}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </button>
              </div>
              <div className="d-flex justify-content-between border rounded m-auto my-3">
                <input
                id="RepeatPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control border-0"
                  placeholder={t("Repeat Password")}
                  minLength={8}
                />
                <button
                  id="RepeatPassword_Eye"
                  type="button"
                  className="border-0 bg-transparent d-flex align-items-center"
                  onClick={() => toggleShowConfirmPassword()}
                >
                  <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                  ></i>
                </button>
              </div>

              <div className="text-center" id="PasswordSubmit">
                <LoadButton
                  onClick={handleSubmit}
                  loading={loading}
                  btnText={t("Submit")}
                  loadingText="Submitting"
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

export default InitializePassword;
