import { useEffect, useRef, useState } from "react";
import TemplateComponent from "react-mustache-template-component";
import useAutocomplete from "../../../Shared/DynamicAutoComplete/useAutocomplete";
import OutsiderAlert from "../../OutsiderAlert";

const ControlAutoDynamicComplete = (props: any) => {
  const [fieldValue, setFieldValue] = useState(props?.data?.defaultValue || "");
  const [fields, setFields] = useState(props.Inputs[props.index].fields);
  const debounceTimeout = useRef<number | null>(null);

  const {
    setSearchedValue,
    setapiCallDetails,
    setTouched,
    setActiveSuggestion,
    setSelectedSuggestion,
    suggestions,
    setSuggestions,
    handleClick,
    autoOptions,
    selectedSuggestion,
    apiCallForDynamicFormDynamicControl,
  } = useAutocomplete(props);

  useEffect(() => {
    setFields(props.Inputs[props.index].fields);
  }, [props.Inputs, props.index]);

  useEffect(() => {
    setFieldValue(props?.data?.defaultValue || "");
  }, [props?.data?.defaultValue]);

  const handleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    setFieldValue(value);
    let obj = {
      systemFieldName: name,
      text: value,
    };
    console.log(obj, "OBJECT");

    setapiCallDetails(obj);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      apiCallForDynamicFormDynamicControl(value, name);
    }, 500);
  };

  useEffect(() => {
    if (selectedSuggestion) {
      let updatedData = assignFormValue();
      props.setInputs(updatedData);
    }
  }, [selectedSuggestion]);

  const assignFormValue = () => {
    const updatedFields = fields.map((field: any, index: number) => {
      if (selectedSuggestion.hasOwnProperty(field.systemFieldName)) {
        const filteredControl = autoOptions?.DependentControls?.find(
          (control: any) => control.systemFieldName === field.systemFieldName
        );

        if (filteredControl !== undefined) {
          let e: any = {};
          e.name = field.systemFieldName;
          e.value = selectedSuggestion[field.systemFieldName];
          e.label = field.displayFieldName;
          e.id = field.controlId;
          e.fieldIndex = index;
          let selectedOption = field.options.find(
            (opt: any) => opt.value == e.value
          );
          if (selectedOption !== undefined) {
            e.checked = true;
            e.label = selectedOption.label;
            e.id = selectedOption.id;
          }
          props.handleServerSideDropdownOnChange(e, true);
        }

        if (filteredControl?.valueSetType === "options") {
          const parsedRequisitionTypeID = JSON.parse(
            selectedSuggestion[field.systemFieldName]
          );
          field.options = parsedRequisitionTypeID;
        } else {
          field.defaultValue = selectedSuggestion[field.systemFieldName];
        }
      }
      return field;
    });

    setFields(updatedFields);
    const updatedInputs = props.Inputs.map((input: any, idx: number) =>
      idx === props.index ? { ...input, fields: updatedFields } : input
    );
    return updatedInputs;
  };

  return (
    <OutsiderAlert
      setSuggestions={setSuggestions}
      setSearchedValue={setSearchedValue}
      setSelectedSuggestion={setSelectedSuggestion}
      setActiveSuggestion={setActiveSuggestion}
      setTouched={setTouched}
      displayType={props?.data?.displayType}
    >
      <label
        className={
          props?.data?.required ? "required mb-2 fw-500" : "mb-2 fw-500"
        }
      >
        {props?.data?.displayFieldName}
      </label>
      <input
        className="form-control bg-transparent mb-2"
        name={props?.data?.systemFieldName}
        onChange={handleChange}
        value={fieldValue}
      />
      {suggestions?.length ? (
        <div
          className={`bg-white card position-absolute px-3 py-2 shadow-xs w-100 position-relative`}
          style={{
            zIndex: "6",
            overflowY: "auto",
            maxHeight: "400px",
            height: "fit-content",
          }}
        >
          <div>
            {Array.isArray(suggestions) &&
              suggestions.map((item: any, index) => (
                <div
                  key={index}
                  style={{ cursor: "pointer" }}
                  className="p-1"
                  onClick={() => handleClick(item)}
                >
                  <div
                    className="bg-hover-light-primary d-flex gap-2 flex-wrap py-2 px-4 rounded-4"
                    style={{ borderBottom: "1.5px solid var(--kt-primary)" }}
                  >
                    <TemplateComponent
                      template={autoOptions?.Template}
                      data={item}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </OutsiderAlert>
  );
};

export default ControlAutoDynamicComplete;
