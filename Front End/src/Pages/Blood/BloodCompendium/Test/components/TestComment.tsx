import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Select from "react-select";
import { GetGenderLookup } from "Services/Compendium/BloodLisCompendium/BloodLisCompendium";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import { closeMenuOnScroll } from "../Shared";

const TestComment = ({ formData, setFormData }: any) => {
  const { t } = useLang();
  const testCommentsObj = {
    gender: "",
    comments: "",
  };
  const [genderOptions, setGenderOptions] = useState<any>([]);

  // Function to add a new comment section
  const addSection = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      testComments: [...prevData.testComments, testCommentsObj],
    }));
  };

  // Function to remove a comment section
  const removeSection = (index: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      testComments: prevData.testComments.filter(
        (_: any, i: number) => index !== i
      ),
    }));
  };

  // Function to handle change a testComments
  const handleChange = (index: number, fieldName: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      testComments: formData.testComments.map((row: any, i: number) =>
        index === i ? { ...row, [fieldName]: value } : row
      ),
    }));
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const response = await GetGenderLookup();

        setGenderOptions(response.data);
      } catch (error) {
        console.error(t("Failed to fetch lookup data:"), error);
      }
    };

    fetchLookupData();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h6 className="text-primary h5">{t("Test Comment")}</h6>
      </div>
      {/* Render dynamic comment sections */}
      {formData?.testComments?.map((section: any, index: number) => (
        <div key={index} className="d-flex gap-3 w-100 mt-3 align-items-end">
          <div className="d-flex align-items-center gap-5">
            <Select
              inputId={`TestCommentSelectGender_${index + 1}`}
              menuPortalTarget={document.body}
              theme={(theme: any) => styles(theme)}
              options={genderOptions} // Replace with your options
              name="gender"
              styles={reactSelectSMStyle}
              placeholder={t("Select Gender")}
              onChange={(event: any) =>
                handleChange(index, "gender", "" + event.value)
              }
              closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
              value={genderOptions.filter(
                (gender: any) => gender.value == section.gender
              )}
              isSearchable={true}
              className="w-100"
            />
            <input
              id={`TestCommentComents_${index + 1}`}
              type="text"
              className="form-control h-30px rounded"
              name="comments"
              placeholder={t("Comments")}
              value={section.comments}
              onChange={(event: any) =>
                handleChange(index, "comments", event.target.value)
              }
            />
          </div>
          <div className="align-items-end">
            {formData.testComments.length === 1 ? null : (
              <IconButton
                id={`TestCommentDelete_${index + 1}`}
                sx={{
                  height: "30px",
                  width: "30px",
                  borderRadius: "5px",
                }}
                className="bg-light-danger me-4"
                color="error"
                onClick={() => removeSection(index)}
              >
                <i className="fa fa-trash text-danger"></i>
              </IconButton>
            )}
            {formData.testComments.length - 1 === index ? (
              <button
                id={`TestCommentAdd`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded w-25px"
                onClick={addSection}
              >
                <AddIcon />
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestComment;
