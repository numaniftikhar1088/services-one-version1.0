import { useLayoutEffect, useState } from "react";
import useLang from "./../../../Shared/hooks/useLanguage";
import Commonservice from "Services/CommonService";
import { setWebInfo } from "Redux/Actions/Index";
import { setFaviconAndTitle } from "Utils/Common/CommonMethods";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
const ForgetPassword = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [logoUrl, setLogoUrl] = useState<any>("");
  const [loginRequest, setLoginRequest] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState<any>([]);
  const [isSecurityQuestionVisible, setIsSecurityQuestionVisible] =
    useState(false);
  const [answers, setAnswers] = useState<any>([]);
  const [errors, setErrors] = useState<any>([]);
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
  const handleInputChange = (e: any) => {
    setLoginRequest(e.target.value);
  };
  const handleNextClick = async () => {
    const validate = await validateUserNameEmail();
    if (loginRequest) {
      if (validate?.data?.result?.statusCode === 200) {
        await getUserSavedSecurityQuestions();
      }
    } else {
      toast.error(t("Enter Username/Email"), {
        position: "top-center",
      });
      return;
    }
  };

  const getUserSavedSecurityQuestions = async () => {
    await Commonservice.getUserSavedSecurityQuestions(loginRequest)
      .then((res: any) => {
        if (res.data) {
          setSecurityQuestion(res.data);
          setAnswers(
            res.data.map((question: any) => ({ id: question.id, answer: "" }))
          );
          setErrors(res.data.map(() => false));
          setIsSecurityQuestionVisible(true); // Move this inside the response check
        } else {
          toast.error(t("Invalid Username/Email"), {
            position: "top-center",
          });
          setIsSecurityQuestionVisible(false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const validateUserNameEmail = async () => {
    try {
      const res = await Commonservice.validateUserNameEmail(loginRequest);
      console.log(res, "Response data");
      if (res.data.result.statusCode === 200) {
        return res;
      } else {
        toast.error(t(res.data.result.message), {
          position: "top-center",
        });
        return null;
      }
    } catch (err) {
      console.error("Error validating username/email:", err);
      return null;
    }
  };

  const handleAnswerChange = (index: any, value: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], answer: value };
    setAnswers(updatedAnswers);
    const updatedErrors = [...errors];
    updatedErrors[index] = false;
    setErrors(updatedErrors);
  };
  const validateAnswers = () => {
    const newErrors = answers.map((answer: any) => answer.answer === "");
    setErrors(newErrors);
    return newErrors.every((error: any) => !error);
  };

  const SecurityQuestionVarification = (obj: any) => {
    Commonservice.SecurityQuestionverification(obj)
      .then((res: any) => {
        if (res.data) {
          navigate("/new-password", {
            state: { emailOrUsername: loginRequest, fromLogin: true },
          });
        } else {
          toast.error(t("Incorrect answers"), {
            position: "top-center",
          });
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const handleSubmit = async () => {
    if (validateAnswers()) {
      let obj = {
        user: loginRequest,
        securityQuestion1: answers[0]?.id,
        securityQuestion2: answers[1]?.id,
        securityAnswer1: answers[0]?.answer,
        securityAnswer2: answers[1]?.answer,
      };
      SecurityQuestionVarification(obj);
    } else {
      toast.error(t("Please answer all security questions"), {
        position: "top-center",
      });
    }
  };

  useLayoutEffect(() => {
    getLogoUrl();
  }, []);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  return (
    <>
      {!isSecurityQuestionVisible ? (
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
              <a href="#" className="mb-12 d-flex justify-content-center">
                {logoUrl && <img alt="Logo" src={logoUrl} className="h-45px" />}
              </a>
              <div className="text-center mb-10"></div>
              <div className="fv-row mb-10">
                <label className="form-label">
                  {t("Enter username or email to proceed")}
                </label>
                <input
                  placeholder={t("Username or email")}
                  required
                  name="username"
                  onChange={handleInputChange}
                  value={loginRequest}
                  className="form-control form-control-lg form-control-solid"
                  type="text"
                  autoComplete="off"
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link to="/login" className="btn btn-sm btn-secondary ">
                  Back
                </Link>
                <button
                  className="btn btn-sm btn-primary "
                  onClick={handleNextClick}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column flex-center flex-column-fluid">
          <div className="d-flex flex-column flex-center p-10">
            <div className="card card-flush w-lg-650px py-5">
              <div className="card-body py-15 py-lg-15">
                <div className="text-center">
                  <span className="fw-bolder fs-2hx mb-4">
                    {t("Security Question")}
                  </span>
                </div>
                {!securityQuestion.length ? (
                  <Alert
                    severity="error"
                    className="mt-5"
                    sx={{ justifyContent: "center" }}
                  >
                    Security questions for this user are not available.
                  </Alert>
                ) : (
                  <>
                    <div className="fw-semibold fs-6 text-gray-500 text-center">
                      {t(
                        "Please answer security questions in order to proceed"
                      )}
                    </div>
                    <div className="mt-5">
                      {securityQuestion.map((question: any, index: number) => (
                        <div key={question.id} className="mb-4">
                          <span className="fw-semibold fs-6 d-block mb-2 text-center">
                            {question.securityQuestion}
                          </span>
                          <div className="d-flex justify-content-between border rounded m-auto mb-3">
                            <input
                              className={`form-control form-control-solid ${
                                errors[index] ? "is-invalid" : ""
                              }`}
                              placeholder={t("Your Answer")}
                              value={answers[index]?.answer || ""}
                              onChange={(e) =>
                                handleAnswerChange(index, e.target.value)
                              }
                              type={isPasswordVisible ? "text" : "password"}
                            ></input>

                            <button
                              type="button"
                              className="border-0 bg-transparent d-flex align-items-center"
                              onClick={togglePasswordVisibility}
                            >
                              <i
                                className={`bi ${
                                  isPasswordVisible ? "bi-eye-slash" : "bi-eye"
                                }`}
                              ></i>
                            </button>
                          </div>
                          {errors[index] && (
                            <div className="invalid-feedback text-center">
                              {t("This field is required")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgetPassword;
