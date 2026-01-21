import { Box } from "@mui/material";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import CommonService from "Services/CommonService";
import { getSecurityQuestions } from "../../../Services/UserManagement/UserManagementService";
import useLang from "../../../Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import Commonservice from "Services/CommonService";

type Question = {
  id: number;
  question: string;
};

type SelectOptions = {
  value: number;
  label: string;
};

const SecurityQuestionsUserName = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;

  const [password, setPassword] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [questions, setQuestions] = useState<SelectOptions[]>([]);
  const [selectedQuestion1, setSelectedQuestion1] =
    useState<SelectOptions | null>(null);
  const [selectedQuestion2, setSelectedQuestion2] =
    useState<SelectOptions | null>(null);
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [currentScreen, setCurrentScreen] = useState("questions");
  const questionsFetched = useRef(false);

  const getLogoUrl = () => {
    Commonservice.getLoginPageLogo()
      .then((res: any) => {
        setLogoUrl(res.data.logo);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionsFetched.current) {
        const response = await getSecurityQuestions();
        setQuestions(
          response.data.map((question: Question) => ({
            value: question.id,
            label: question.question,
          }))
        );
        questionsFetched.current = true;
      }
    };
    fetchQuestions();
    getLogoUrl();
  }, []);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleQuestionChange = (
    setter: Dispatch<SetStateAction<SelectOptions | null>>,
    otherSelected: any,
    selectedOption: SelectOptions | null
  ) => {
    setter(selectedOption);
    if (otherSelected && selectedOption?.value === otherSelected.value) {
      otherSelected(null);
    }
  };

  const filteredQuestions = (excludeValue: number | undefined) => {
    return questions.filter((question) => question.value !== excludeValue);
  };

  const handleQuestionSubmission = () => {
    const validations = [
      { condition: !selectedQuestion1, message: t("Please Select Question 1") },
      { condition: !answer1, message: t("Please answer Question 1") },
      { condition: !selectedQuestion2, message: t("Please Select Question 2") },
      { condition: !answer2, message: t("Please answer Question 2") },
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        toast.error(message);
        return;
      }
    }

    setCurrentScreen("password");
  };

  console.log(selectedQuestion2, "selectedQuestion2");

  const validatePasswordStrength = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!validatePasswordStrength(value)) {
      setPasswordError(
        t(
          "Password must be at least 8 characters long, include uppercase, lowercase, numbers, and special characters."
        )
      );
      setConfirmPasswordError("");
    } else {
      setPasswordError("");
      if (value !== confirmPassword && confirmPassword) {
        setConfirmPasswordError(t("Passwords do not match."));
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(
      value !== password ? t("Passwords do not match.") : ""
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if passwords are empty
    if (!password || !confirmPassword) {
      toast.error(t("Please type password and confirm password!"));
      return;
    }

    // Validate password strength
    if (!validatePasswordStrength(password)) {
      setPasswordError(
        t(
          "Password must be at least 8 characters long, include uppercase, lowercase, numbers, and special characters."
        )
      );
      toast.error(t("Password does not meet security requirements!"));
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError(t("Passwords do not match."));
      toast.error(t("Passwords do not match!"));
      return;
    }

    const payload = {
      userId,
      password,
      questions: [
        {
          questionId: questions[0].value,
          answer: answer1,
        },
        {
          questionId: questions[1].value,
          answer: answer2,
        },
      ],
    };

    try {
      const response = await CommonService.setNewPasswordV2(payload);
      if (response.data?.status === 400) {
        toast.warning(t(response.data.message));
      } else if (response.data?.status === 200) {
        toast.success(t(response.data.message));
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex flex-column flex-center flex-column-fluid">
      <div className="d-flex flex-column flex-center p-10">
        <div className="card-body py-15 py-lg-15">
          {currentScreen === "questions" ? (
            <>
              <div className="card card-flush w-lg-650px p-10">
                <div className="text-center">
                  <h2 className="fw-bolder fs-2hx mb-4">
                    {t("Security Questions")}
                  </h2>
                </div>
                <p className="fw-semibold fs-6 text-gray-500 text-center">
                  {t("Please add security questions")}
                </p>
                <div className="mt-8">
                  <Box className="d-flex gap-2 flex-column">
                    <Select
                      menuPortalTarget={document.body}
                      theme={(theme) => styles(theme)}
                      options={filteredQuestions(selectedQuestion2?.value)}
                      name="securityQuestion1"
                      onChange={(option) =>
                        handleQuestionChange(
                          setSelectedQuestion1,
                          selectedQuestion2,
                          option
                        )
                      }
                      value={selectedQuestion1}
                      styles={reactSelectSMStyle}
                    />
                    <input
                      type="text"
                      name="answer1"
                      className="form-control bg-white mb-3 mb-lg-0 h-30px"
                      placeholder={t("Answer ...")}
                      value={answer1}
                      onChange={(e) => setAnswer1(e.target.value)}
                    />
                  </Box>
                  <Box className="d-flex gap-2 flex-column mt-2">
                    <Select
                      menuPortalTarget={document.body}
                      theme={(theme) => styles(theme)}
                      options={filteredQuestions(selectedQuestion1?.value)}
                      name="securityQuestion2"
                      onChange={(option) =>
                        handleQuestionChange(
                          setSelectedQuestion2,
                          selectedQuestion1,
                          option
                        )
                      }
                      value={selectedQuestion2}
                      styles={reactSelectSMStyle}
                    />
                    <input
                      type="text"
                      name="answer2"
                      className="form-control bg-white mb-3 mb-lg-0 h-30px"
                      placeholder={t("Answer ...")}
                      value={answer2}
                      onChange={(e) => setAnswer2(e.target.value)}
                    />
                  </Box>
                  <Box className="d-flex gap-2 justify-content-center align-items-center mt-5">
                    <button
                      onClick={() => navigate("/login")}
                      type="button"
                      className="btn btn-secondary mt-4"
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      onClick={handleQuestionSubmission}
                      type="button"
                      className="btn btn-primary mt-4"
                    >
                      {t("Next")}
                    </button>
                  </Box>
                </div>
              </div>
            </>
          ) : (
            <div
              className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
              style={{
                backgroundImage:
                  'url("/media/illustrations/login/sketch-1.png")',
              }}
            >
              <div className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
                <div className="w-lg-550px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
                  <form
                    className="form w-100"
                    id="kt_login_signin_form"
                    onSubmit={handleSubmit}
                  >
                    <a href="#" className="mb-12 d-flex justify-content-center">
                      {logoUrl && (
                        <img alt="Logo" src={logoUrl} className="h-45px" />
                      )}
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
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
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
                        onChange={(e) =>
                          handleConfirmPasswordChange(e.target.value)
                        }
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
                      <div className="text-danger mb-3">
                        {confirmPasswordError}
                      </div>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestionsUserName;
