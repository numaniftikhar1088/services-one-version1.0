import { useEffect, useState } from "react";
import Select from "react-select";
import { styles } from "../../../Utils/Common";
import useAutocomplete from "../../DynamicAutoComplete/useAutocomplete";

const ControlDynamicDropDown = (props: any) => {
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<any>(null);
  const [fields, setFields] = useState(props.Inputs[props.index].fields);

  const { suggestions, autoOptions, apiCallForDynamicControlDropdown } =
    useAutocomplete(props);

  const dropdownOptions = suggestions.map((suggestion) => ({
    value: suggestion.Value,
    label: suggestion.Label,
  }));

  useEffect(() => {
    if (
      props?.data?.systemFieldName &&
      Object.keys(autoOptions || {}).length > 0
    ) {
      apiCallForDynamicControlDropdown(
        props?.data?.systemFieldName,
        autoOptions
      );
    }
  }, [props?.data?.systemFieldName, autoOptions]);

  useEffect(() => {
    if (selectedDropdownValue) {
      let filteredValue = suggestions.find(
        (option: any) => option.Value === selectedDropdownValue.value
      );
      if (filteredValue) {
        let updatedData = assignFormValue(filteredValue);

        if (
          updatedData[props?.index]?.fields?.[props.fieldIndex]?.repeatFields
        ) {
          const dynamicObj: { [key: string]: any } = {};

          updatedData[props?.index].fields[
            props.fieldIndex
          ].repeatFields.forEach((field: any) => {
            if (field.systemFieldName !== "RepeatStart") {
              dynamicObj[field.systemFieldName] = field.defaultValue;
            }
          });

          updatedData[props?.index].fields[props.fieldIndex].defaultValue =
            JSON.stringify(dynamicObj);

          props.setInputs(updatedData);
        } else {
          console.error(
            "Invalid updatedData structure or missing fields at fieldIndex",
            updatedData
          );
        }
      }
    }
  }, [selectedDropdownValue, suggestions]);

  useEffect(() => {
    setFields(props.Inputs[props.index].fields);
  }, [props.Inputs, props.index]);

  const assignFormValue = (filteredValue: any) => {
    const updatedFields = props.Inputs[props.index].fields.map(
      (field: any, fieldsIndex: number) => {
        if (!field.repeatFields) return field;

        const updatedRepeatFields = field.repeatFields.map(
          (repeatField: any) => {
            if (
              filteredValue.hasOwnProperty(repeatField.systemFieldName) &&
              fieldsIndex === props.fieldIndex
            ) {
              return {
                ...repeatField,
                defaultValue: filteredValue[repeatField.systemFieldName],
              };
            } else if (
              filteredValue.hasOwnProperty("Value") &&
              fieldsIndex === props.fieldIndex
            ) {
              props.Inputs[props.index].fields[props.fieldIndex].repeatFields[
                props.repeatFieldIndex
              ].defaultValue = filteredValue.Value;
            }
            return repeatField;
          }
        );

        // If no changes were made, return the original field
        if (
          JSON.stringify(updatedRepeatFields) ===
          JSON.stringify(field.repeatFields)
        ) {
          return field;
        }

        // Return the field with updated repeatFields
        return {
          ...field,
          repeatFields: updatedRepeatFields,
        };
      }
    );

    setFields(updatedFields);

    const updatedInputs = props.Inputs.map((input: any, idx: number) =>
      idx === props.index ? { ...input, fields: updatedFields } : input
    );

    return updatedInputs;
  };

  return (
    <div
      className={
        props?.data?.displayType
          ? props?.data?.displayType
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
    >
      <div id={props?.data?.systemFieldName} tabIndex={-1}></div>
      <label
        className={
          props?.data?.required ? "required mb-2 fw-500" : "mb-2 fw-500"
        }
      >
        {props?.data?.displayFieldName}
      </label>
      <Select
        menuPortalTarget={document.body}
        placeholder={props?.data?.displayFieldName}
        theme={(theme) => styles(theme)}
        options={dropdownOptions}
        value={dropdownOptions.filter((option) => {
          return option.value === +props.data.defaultValue;
        })}
        onChange={(e: any) => {
          setSelectedDropdownValue(e);
        }}
        isSearchable={true}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: "var(--kt-input-border-color)",
            color: "var(--kt-input-border-color)",
          }),
        }}
      />
      {props?.data.enableRule && (
        <div className="form__error">
          <span>{props?.data.enableRule}</span>
        </div>
      )}
    </div>
  );
};

export default ControlDynamicDropDown;
