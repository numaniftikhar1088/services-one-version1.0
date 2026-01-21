import React from "react";
import useLang from "Shared/hooks/useLanguage";
import { IFormValues } from "./index";

interface Props {
  // handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  values: IFormValues;
  errors: any;
  setErrors: any;
  setValues: any;
}

const AddSpecimen: React.FC<Props> = ({
  values,
  setValues,
  errors,
  setErrors,
}) => {
  const { t } = useLang();

  interface IInput {
    name: string;
    type: string;
    placeholder: string;
    label: string;
  }
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    if (type === "checkbox") {
      setValues((preVal: any) => {
        return {
          ...preVal,
          specimenStatus: e.target.checked,
        };
      });
    } else {
      setValues((preVal: any) => {
        return {
          ...preVal,
          specimenType: value,
        };
      });
      setErrors({
        TypeError: "",
        PreFixError: "",
      });
    }
  };
  const handleOnChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((preVal: any) => {
      return {
        ...preVal,
        specimenPreFix: e.target.value,
      };
    });
    setErrors({
      TypeError: "",
    });
  };

  return (
    <div className="row">
      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <label className="required mb-2 fw-500">{t("Specimen Type")}</label>
        <input
        id={`SpecimenTypeSpecimenType`}
          name="specimenType"
          type="text"
          placeholder={t("Specimen Type")}
          onChange={handleOnChange}
          value={values.specimenType}
          className={
            values.specimenTypeId
              ? "form-control bg-secondary mb-2"
              : "form-control bg-transparent mb-2"
          }
          disabled={values.specimenTypeId ? true : false}
        />
        <span style={{ color: "red" }}>{errors.TypeError}</span>
      </div>

      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <label className="mr-2 mb-2">{t("Inactive/Active")}</label>
        <div className="form-check form-switch mt-2">
          <input
          id={`SpecimenTypeSwitchButton`}
            className="form-check-input"
            type="checkbox"
            role="switch"
            name="specimenStatus"
            onChange={handleOnChange}
            checked={values?.specimenStatus ? true : false}
          />
        </div>
      </div>
    </div>
  );
};

export default AddSpecimen;
