import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  getSecurityQuestions,
  saveSecurityQuestionsOfUser,
} from "../../../Services/UserManagement/UserManagementService";
import { Decrypt } from "../../../Utils/Auth";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import useLang from "./../../../Shared/hooks/useLanguage";

const SecurityQuestions = ({ setQuestionsAnswered, userId }: any) => {
  const { t } = useLang();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion1, setSelectedQuestion1] = useState<any>(null);
  const [selectedQuestion2, setSelectedQuestion2] = useState<any>(null);
  const [answer1, setAnswer1] = useState<string>("");
  const [answer2, setAnswer2] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const _userId = useSelector((state: any) => state.Reducer.userInfo);

  const getQuestions = async () => {
    const questions = await getSecurityQuestions();
    setQuestions(
      questions.data.map((question: any) => ({
        value: question.id,
        label: question.question,
      }))
    );
  };

  useEffect(() => {
    getQuestions();
  }, [userId]);

  const handleQuestion1Change = (selectedOption: any) => {
    setSelectedQuestion1(selectedOption);
    if (selectedQuestion2 && selectedOption.value === selectedQuestion2.value) {
      setSelectedQuestion2(null);
    }
  };

  const handleQuestion2Change = (selectedOption: any) => {
    setSelectedQuestion2(selectedOption);
    if (selectedQuestion1 && selectedOption.value === selectedQuestion1.value) {
      setSelectedQuestion1(null);
    }
  };

  const filteredQuestions1 = questions.filter(
    (question) => question.value !== selectedQuestion2?.value
  );

  const filteredQuestions2 = questions.filter(
    (question) => question.value !== selectedQuestion1?.value
  );

  // const handleQuestionSubmission = async () => {
  //   if (!answer1 || !answer2) {
  //     toast.error(t("Both answers are required"));
  //     return;
  //   }

  //   setLoading(true);

  //   const questions = [
  //     {
  //       questionId: selectedQuestion1.value,
  //       answer: answer1,
  //     },
  //     {
  //       questionId: selectedQuestion2.value,
  //       answer: answer2,
  //     },
  //   ];

  //   const id = userId || JSON.parse(Decrypt(_userId ?? "") ?? "{}")?.userId;

  //   const payloadData = {
  //     userId: id,
  //     questions,
  //   };

  //   try {
  //     const res = await saveSecurityQuestionsOfUser(payloadData);

  //     if (res.data.httpStatusCode == 200) {
  //       setQuestionsAnswered && setQuestionsAnswered(true);
  //       toast.success(res.data.status);
  //       localStorage.setItem("questionsAnswered", "true");
  //       isQuestionsBeingChanged && navigate("/MyFavourite");
  //     } else {
  //       toast.error(res.data.error);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(t("Failed to save security questions"));
  //   }
  // };
  const handleQuestionSubmission = async () => {
    // Validate that both questions and answers are provided
    if (!selectedQuestion1 || !selectedQuestion1.value || !answer1) {
      toast.error(t("Fill all fields"));
      return;
    }

    if (!selectedQuestion2 || !selectedQuestion2.value || !answer2) {
      toast.error(t("Fill all fields"));
      return;
    }

    setLoading(true);

    const questions = [
      {
        questionId: selectedQuestion1.value,
        answer: answer1,
      },
      {
        questionId: selectedQuestion2.value,
        answer: answer2,
      },
    ];

    // Retrieve userId with fallback decryption logic
    const id = userId || JSON.parse(Decrypt(_userId ?? "") ?? "{}")?.userId;

    const payloadData = {
      userId: id,
      questions,
    };

    try {
      const res = await saveSecurityQuestionsOfUser(payloadData);

      if (res.data.httpStatusCode === 200) {
        if (setQuestionsAnswered) setQuestionsAnswered(true);
        toast.success(res.data.status);
        localStorage.setItem("questionsAnswered", "true");

        if (isQuestionsBeingChanged) {
          navigate("/MyFavorites");
        }
      } else {
        toast.error(
          res.data.error ||
            t("An error occurred while saving security questions")
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to save security questions"));
    } finally {
      setLoading(false); // Ensure loading state is reset after completion
    }
  };

  let isQuestionsBeingChanged =
    window.location.pathname === "/security/change-questions";

  return (
    <div className="d-flex flex-column flex-center flex-column-fluid">
      <div className="d-flex flex-column flex-center p-10">
        <div className="card card-flush w-lg-650px py-5">
          <div className="card-body py-15 py-lg-15">
            <div className="text-center">
              <span className="fw-bolder fs-2hx mb-4">
                {isQuestionsBeingChanged
                  ? t(`Change Security Questions`)
                  : t(`Security Questions`)}
              </span>
            </div>
            <div className="fw-semibold fs-6 text-gray-500 text-center">
              {t("Please add security questions")}
            </div>
            <div className="mt-8">
              <Box className="d-flex gap-2 flex-column">
                <Select
                  inputId="SecurityQuestion1"
                  menuPortalTarget={document.body}
                  theme={(theme: any) => styles(theme)}
                  options={filteredQuestions1}
                  name="securityQuestion1"
                  onChange={handleQuestion1Change}
                  value={selectedQuestion1}
                  styles={reactSelectSMStyle}
                />
                <input
                  id="Answer1"
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
                  inputId="SecurityQuestion2"
                  menuPortalTarget={document.body}
                  theme={(theme: any) => styles(theme)}
                  options={filteredQuestions2}
                  name="securityQuestion2"
                  onChange={handleQuestion2Change}
                  value={selectedQuestion2}
                  styles={reactSelectSMStyle}
                />
                <input
                  id="Answer2"
                  type="text"
                  name="answer2"
                  className="form-control bg-white mb-3 mb-lg-0 h-30px"
                  placeholder={t("Answer ...")}
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                />
              </Box>
              <Box className="d-flex gap-2 justify-content-center align-items-center mt-5">
                {isQuestionsBeingChanged ? (
                  <button
                    onClick={() => navigate("/MyFavorites")}
                    className="btn btn-secondary mt-4"
                  >
                    {t("Cancel")}
                  </button>
                ) : null}
                <button
                  id="QuestionSubmit"
                  onClick={handleQuestionSubmission}
                  type="submit"
                  className="btn btn-primary mt-4"
                  disabled={loading}
                >
                  {isQuestionsBeingChanged
                    ? t(!loading ? "Submit" : "Submitting...")
                    : t("Next")}
                </button>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestions;
