import { IconButton } from "@mui/material";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon } from "Shared/Icons";

const AdditionalResultsCodes = ({ formData, setFormData }: any) => {
  const { t } = useLang();
  const AdditionalResultsCodesObj = {
    code: "",
    reason: "",
  };

  // Function to add a new code section
  const addCode = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      additionalResultsCodes: [
        ...prevData.additionalResultsCodes,
        AdditionalResultsCodesObj,
      ],
    }));
  };

  // Function to remove a code section
  const removeCode = (index: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      additionalResultsCodes: prevData.additionalResultsCodes.filter(
        (_: any, i: number) => index !== i
      ),
    }));
  };

  // Function to handle input changes (for CPT Code)
  const handleChange = (index: number, value: string, fieldName: string) => {
    if (fieldName === "code") {
      // Check if the input is numeric (integer or floating-point number)
      setFormData((prevData: any) => ({
        ...prevData,
        additionalResultsCodes: formData.additionalResultsCodes.map(
          (row: any, i: number) =>
            index === i ? { ...row, [fieldName]: value } : row
        ),
      }));
    } else {
      setFormData((prevData: any) => ({
        ...prevData,
        additionalResultsCodes: formData.additionalResultsCodes.map(
          (row: any, i: number) =>
            index === i ? { ...row, [fieldName]: value } : row
        ),
      }));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h6 className="text-primary h5">{t("Additional Results Code")}</h6>
      </div>

      {/* Render dynamic code sections */}
      {formData?.additionalResultsCodes?.map(
        (resultCode: any, index: number) => {
          return (
            <div
              key={index}
              className="d-flex gap-3 w-100 align-items-end mt-3"
            >
              <div className="d-flex flex-column gap-1">
                <input
                  id={`AdditionalResultCodeCode_${index + 1}`}
                  className="form-control h-30px rounded"
                  name="code"
                  type="text"
                  placeholder={t("Code")}
                  value={resultCode.code || ""}
                  onChange={(event) => {
                    handleChange(index, event.target.value, "code");
                  }}
                />
              </div>
              <div>
                <input
                  id={`AdditionalResultCodeReason_${index + 1}`}
                  type="text"
                  className="form-control h-30px rounded"
                  name="reason"
                  value={resultCode.reason}
                  placeholder={t("Reason")}
                  onChange={(event: any) =>
                    handleChange(index, event.target.value, "reason")
                  }
                />
              </div>
              <div className="align-items-end">
                {formData.additionalResultsCodes.length === 1 ? null : (
                  <IconButton
                    id={`AdditionalResultCodeDelete_${index + 1}`}
                    sx={{ height: "30px", width: "30px", borderRadius: "5px" }}
                    className="bg-light-danger me-4"
                    color="error"
                    onClick={() => removeCode(index)}
                  >
                    <i className="fa fa-trash text-danger"></i>
                  </IconButton>
                )}
                {formData.additionalResultsCodes.length - 1 === index ? (
                  <button
                    id={`AdditionalResultCodeAdd`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded w-25px"
                    onClick={addCode}
                  >
                    <AddIcon />
                  </button>
                ) : null}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AdditionalResultsCodes;
