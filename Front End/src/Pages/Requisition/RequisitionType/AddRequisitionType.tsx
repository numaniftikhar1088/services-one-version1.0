import chroma from "chroma-js";
import React from "react";
import Select, { StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";
import FormInput from "../../../Shared/FormInput";
import { styles } from "../../../Utils/Common";
import { RequisitionTypeInputs } from "../../../Utils/Requisition/Input";
import { ColourOption, colourOptions } from "./data";
import { IFormValues } from "./index";
import useLang from "Shared/hooks/useLanguage";
const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",
  ":before": {
    backgroundColor: color,

    content: '" "',
    display: "block",
    marginRight: 8,
    height: 12,
    width: 12,
  },
});
const colourStyles: StylesConfig<ColourOption> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,

      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? color.alpha(0.8).css()
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",
      display: "flex",
      alignItems: "center",
      paddingLeft: 8,
      ":before": {
        content: `" "`,
        display: "block",
        marginRight: 8,
        height: 12,
        width: 12,
        backgroundColor: data.color,
      },
      ":hover:before": {
        backgroundColor: chroma(data.color).alpha(0.7).css(),
      },
    };
  },
  input: (styles) => ({ ...styles, borderRadius: "10px", ...dot() }),
  placeholder: (styles) => ({
    ...styles,
    ...dot("#ccc"),
  }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};
interface Props {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setValues: any;
  values: IFormValues;
  requisitionList: Item[];
  requisitionColorList: any;
}
export interface Item {
  [x: string]: any;
  reqTypeId: number;
  requisitionTypeName: string;
}
export interface Color {
  [x: string]: any;
  reqColorId: number;
  reqColor: string;
}
const AddRequisition: React.FC<Props> = ({
  handleOnChange,
  setValues,
  values,
  requisitionList,
  requisitionColorList,
}) => {
  const { t } = useLang();

  interface IInput {
    name: string;
    type: string;
    placeholder: string;
    label: string;
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

  const handleCheck = (event: any) => {
    return setValues((preVal: any) => {
      return {
        ...preVal,
        reqTypeId: event?.value,
        type: event?.label,
      };
    });
  };
  const handleCheckInput = (event: any) => {
    setValues((prevVal: any) => ({
      ...prevVal,
      reqColorId: event.value,
      requisitionColor: event.label,
    }));
  };
  //
  return (
    <div className="row">
      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
        <label className="mb-2 fw-500 text-dark">{t("Requisition Type")}</label>
        <AsyncSelect
          theme={(theme) => styles(theme)}
          cacheOptions
          onChange={(event) => {
            handleCheck(event);
          }}
          defaultValue={{ value: values.reqTypeId, label: values.type }}
          loadOptions={loadOptions}
          defaultOptions
        />
      </div>

      {RequisitionTypeInputs?.map((input: IInput, index: number) => (
        <div className="col-xxl-6 col-xl-`6 col-lg-6 col-md-6 col-sm-12 col-12">
          <FormInput
            key={index}
            {...input}
            value={values[input.name]}
            onChange={handleOnChange}
          />
        </div>
      ))}

      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
        <label className="mb-2 fw-500 text-dark">
          {t("Requisition Color")}
        </label>

        <Select
          menuPortalTarget={document.body}
          options={colourOptions}
          styles={colourStyles}
          defaultValue={requisitionColorList}
          onChange={(event) => {
            handleCheckInput(event);
          }}
        />
      </div>
      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
        <label className="mr-2 mb-2 fw-500 text-dark">
          {t("Inactive/Active")}
        </label>
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

export default AddRequisition;
