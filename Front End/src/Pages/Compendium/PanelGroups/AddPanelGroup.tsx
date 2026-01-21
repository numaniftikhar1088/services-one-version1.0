import React from "react";
import FormInput from "../../../Shared/FormInput";
import useLang from "Shared/hooks/useLanguage";
import { PanelGroupInputs } from "../../../Utils/Compendium/Inputs";
import { IFormValues } from "./index";

interface Props {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  values: IFormValues;
}
export interface IInput {
  name: string;
  type: string;
  placeholder: string;
  label: string;
  required: boolean;
}

const AddPanelGroup: React.FC<Props> = ({ handleOnChange, values }) => {
  const { t } = useLang()


  return (
    <div className="row">
      {PanelGroupInputs?.map((input: IInput, index: number) => (
        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <FormInput
            key={index}
            {...input}
            value={values[input?.name]}
            onChange={handleOnChange}
          />
        </div>
      ))}
      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
        <label className="mr-2 mb-2">{t("Status")}</label>
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            name="isActive"
            id="flexSwitchCheckDefault"
            onChange={handleOnChange}
            checked={values?.isActive ? true : false}
          />
        </div>
      </div>
    </div>
  );
};

export default AddPanelGroup;
