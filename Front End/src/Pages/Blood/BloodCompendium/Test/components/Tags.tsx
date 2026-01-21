import { IconButton } from "@mui/material";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon } from "Shared/Icons";

const Tags = ({ formData, setFormData }: any) => {
  const { t } = useLang();
  // Function to add a new tag section
  const addTag = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      tags: [...prevData.tags, ""],
    }));
  };

  // Function to remove a tag section
  const removeTag = (index: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      tags: prevData.tags.filter((_: any, i: number) => index !== i),
    }));
  };

  // Function to handle change a tag
  const handleChange = (index: number, value: string, field: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      tags: formData.tags.map((row: any, i: number) =>
        index === i ? value : row
      ),
    }));
  };

  return (
    <div>
      <div className="d-flex">
        <h6 className="text-primary h5">{t("Tags")}</h6>
      </div>

      {/* Render dynamic tag sections */}
      {formData?.tags?.map((tag: string, index: number) => (
        <div key={index} className="d-flex gap-3 w-100 mt-3 align-items-end">
          <div className="d-flex align-items-center gap-5">
            <input
              id={`TagEnterTag_${index + 1}`}
              type="text"
              className="form-control h-30px rounded"
              placeholder={t("Enter tag")}
              name="tag"
              value={tag}
              onChange={(event) =>
                handleChange(index, event.target.value, "tag")
              }
            />
          </div>
          <div className="align-items-end">
            {formData.tags.length === 1 ? null : (
              <IconButton
                id={`TagDelete_${index + 1}`}
                sx={{ height: "30px", width: "30px" }}
                className="bg-light-danger me-4 rounded"
                color="error"
                onClick={() => removeTag(index)}
              >
                <i className="fa fa-trash text-danger"></i>
              </IconButton>
            )}
            {formData.tags.length - 1 === index ? (
              <button
                id={`AddTagRow`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded w-25px"
                onClick={addTag}
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

export default Tags;
