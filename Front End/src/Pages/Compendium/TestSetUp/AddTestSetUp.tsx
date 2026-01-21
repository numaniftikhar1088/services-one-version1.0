import React from "react";
import AsyncSelect from "react-select/async";
import FormInput from "../../../Shared/FormInput";
import useLang from "../../../Shared/hooks/useLanguage";
import { styles } from "../../../Utils/Common";
import { TestSetUpInputs } from "../../../Utils/Compendium/Inputs";
import { IFormValues } from "./index";


interface Props {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setValues: any;
  values: IFormValues;
  requisitionList: Item[];
}
export interface Item {
  [x: string]: any;
  reqTypeId: number;
  requisitionTypeName: string;
}
const AddTestSetup: React.FC<Props> = ({ handleOnChange,
  values,
  setValues,
  requisitionList }) => {

  const { t } = useLang()

  interface IInput {
    name: string;
    type: string;
    placeholder: string;
    label: string;
    required: boolean;

  }
  const filterOptions = (inputValue: string) => {
    return requisitionList.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };
  return (
    <div className="row">
      {TestSetUpInputs?.map((input: IInput, index: number) => (
        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <FormInput
            key={index}
            {...input}
            value={values[input.name]}
            onChange={handleOnChange}
          />
        </div>
      ))}

      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
        <label className="mb-2">{t("Requisition Type")}</label>
        <AsyncSelect
          theme={(theme) => styles(theme)}
          cacheOptions
          onChange={(event: any) => {
            return setValues((preVal: any) => {
              return {
                ...preVal,
                reqTypeId: event?.value,
              };
            });
          }}
          defaultValue={{ value: values.reqTypeId, label: values.label }}
          loadOptions={loadOptions}
          defaultOptions
        />
      </div>
      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
        <label className="mr-2 mb-2">{t('Status')}</label>
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            name="testStatus"
            id="flexSwitchCheckDefault"
            onChange={handleOnChange}
            checked
          // {values?.testStatus ? true : false}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTestSetup;
