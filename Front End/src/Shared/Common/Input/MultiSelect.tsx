import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { assignFormValues } from "Utils/Auth";
import { styles } from "Utils/Common";
import { isJson } from "Utils/Common/Requisition";

interface Option {
  value: string;
  label: string;
}

interface Props {
  displayType?: string;
  systemFieldName: string;
  required?: boolean;
  label: string;
  options?: Option[];
  defaultValue?: any;
  setInputs?: any;
  enableRule?: string;
  Inputs: any[];
  index: number;
  depControlIndex: number;
  fieldIndex: number;
  isDependency: boolean;
  repeatFieldSection: any;
  isDependencyRepeatFields: boolean;
  repeatFieldIndex: number;
  repeatDependencySectionIndex: number;
  repeatDepFieldIndex: number;
}

export const customStyles = {
  control: (baseStyles: any) => ({
    ...baseStyles,
    borderColor: "var(--kt-input-border-color)",
    color: "var(--kt-input-border-color)",
  }),
};

const MultiSelectComponent: FC<Props> = ({
  displayType,
  systemFieldName,
  required = false,
  label,
  defaultValue,
  setInputs,
  enableRule,
  options,
  Inputs,
  index,
  depControlIndex,
  fieldIndex,
  isDependency,
  repeatFieldSection,
  isDependencyRepeatFields,
  repeatFieldIndex,
  repeatDependencySectionIndex,
  repeatDepFieldIndex,
}) => {
  const { t } = useTranslation();
  const inputElementDropdown = useRef<HTMLDivElement>(null);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const _options =
    options?.map((option) => ({
      value: option.value,
      label: option.label,
    })) || [];

  const onValueChange = async (selectedOption: any) => {
    setSelectedOptions(selectedOption || []); // Update the state directly with the new value.

    // Call `assignFormValues` with the new state.
    let newInputs = await assignFormValues(
      Inputs,
      index,
      depControlIndex,
      fieldIndex,
      selectedOption,
      isDependency,
      repeatFieldSection,
      isDependencyRepeatFields,
      repeatFieldIndex,
      repeatDependencySectionIndex,
      repeatDepFieldIndex,
      null,
      setInputs
    );

    setInputs(newInputs);
  };

  // useEffect for default selection of template options of facility Edit
  useEffect(() => {
    if (defaultValue.length > 0) {
      setSelectedOptions(
        isJson(defaultValue) ? JSON.parse(defaultValue) : defaultValue
      );
    }
  }, [defaultValue]);

  return (
    <div className={displayType || "col-lg-6 col-md-6 col-sm-12 mb-4"}>
      <div id={systemFieldName} ref={inputElementDropdown} tabIndex={-1} />
      <label className={required ? "required mb-2 fw-500" : "mb-2 fw-500"}>
        {t(label)}
      </label>
      <Select
        isMulti
        options={_options}
        isSearchable={true}
        styles={customStyles}
        placeholder={t(label)}
        onChange={onValueChange}
        theme={(theme) => styles(theme)}
        value={selectedOptions}
        menuPortalTarget={document.body}
        id={systemFieldName}
      />
      {enableRule && (
        <div className="form__error">
          <span>{t(enableRule)}</span>
        </div>
      )}
    </div>
  );
};

export default MultiSelectComponent;
