import { useState } from "react";
import TemplateComponent from "react-mustache-template-component";
import useLang from "Shared/hooks/useLanguage";
import { FindIndex } from "Utils/Common/CommonMethods";
import useAutocomplete from "../../../Shared/DynamicAutoComplete/useAutocomplete";
import { assignFormValues } from "../../../Utils/Auth";
import { isJson } from "../../../Utils/Common/Requisition";
import OutsiderAlert from "../../OutsiderAlert";
const DynamicAutoComplete = (props: any) => {
  const { t } = useLang();
  const [fieldValue, setFieldValue] = useState("");
  const {
    setSearchedValue,
    setapiCallDetails,
    setTouched,
    setActiveSuggestion,
    setSelectedSuggestion,
    suggestions,
    setSuggestions,
    handleClick,
    apiCall,
    autoOptions,
  } = useAutocomplete(props);
  const handleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;
    setFieldValue(value);
    let obj = {
      inputValue: value,
      apiUri: autoOptions?.Uri,
      name: e.target.name === "ICD10Code" ? 0 : 1,
    };
    setapiCallDetails(obj);
    apiCall(value, autoOptions?.Uri, name === "ICD10Code" ? 0 : 1);
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
        placeholder={
          props?.data?.systemFieldName === "ICD10Code"
            ? "Search by code"
            : props?.data?.systemFieldName === "ICD10Description"
              ? "Search by description"
              : props?.data?.systemFieldName
        }
        value={fieldValue}
      />
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}
      {suggestions?.length ? (
        <div
          className={`bg-white card h-400px overflow-scroll position-absolute px-3 py-2 shadow-xs w-100 position-relative 
              `}
          style={{ zIndex: "6" }}
        >
          <div>
            <>
              {Array.isArray(suggestions) &&
                suggestions?.map((item: any, index) => (
                  <div
                    key={index}
                    style={{ cursor: "pointer" }}
                    className="p-1"
                    onClick={async () => {

                      handleClick(item);
                      const {
                        Inputs,
                        index,
                        depControlIndex,
                        isDependency,
                        repeatFieldSection,
                        isDependencyRepeatFields,
                        repeatFieldIndex,
                        repeatDependencySectionIndex,
                        repeatDepFieldIndex,
                        setInputs,
                        infectiousData,
                        ArrayReqId,
                        setInfectiousData,
                      } = props;

                      const inputFields = Inputs[index].fields;
                      const fieldIndex = inputFields.findIndex(
                        (icdPanelsInfo: any) =>
                          icdPanelsInfo?.systemFieldName === "ICDPanels" || icdPanelsInfo?.systemFieldName === "ComorbidityPanels"
                      );

                      let inputValue: any = [];
                      if (item) {
                        const newItem = {
                          Code: item.code,
                          Description: item.description,
                          icd10id: item.icd10id,
                        };

                        // Check if the item already exists in inputValue
                        if (
                          !inputValue.some(
                            (value: any) => value.icd10id === newItem.icd10id
                          )
                        ) {
                          inputValue.push(newItem);
                        }
                      }

                      let defaultVal = inputFields[fieldIndex].defaultValue;
                      if (defaultVal && defaultVal.length > 0) {
                        if (isJson(defaultVal)) {
                          defaultVal = JSON.parse(defaultVal);
                        }

                        // Merge without duplicates
                        inputValue = [
                          ...inputValue,
                          ...defaultVal.filter(
                            (defaultItem: any) =>
                              !inputValue.some(
                                (value: any) => value.Code === defaultItem.Code
                              )
                          ),
                        ];
                      }

                      const newInputs = await assignFormValues(
                        Inputs,
                        index,
                        depControlIndex,
                        fieldIndex,
                        inputValue,
                        isDependency,
                        repeatFieldSection,
                        isDependencyRepeatFields,
                        repeatFieldIndex,
                        repeatDependencySectionIndex,
                        repeatDepFieldIndex,
                        undefined,
                        setInputs
                      );

                      const infectiousDataCopy = [...infectiousData];
                      const dataIndex = FindIndex(
                        infectiousDataCopy,
                        ArrayReqId
                      );
                      if (dataIndex !== -1) {
                        infectiousDataCopy[dataIndex].sections = newInputs;
                      }
                      setInfectiousData(infectiousDataCopy);
                      setFieldValue("");
                    }}
                  >
                    <>
                      <div
                        key={index}
                        className="bg-hover-light-primary d-flex gap-2 flex-wrap py-2 px-4 rounded-4"
                        style={{
                          borderBottom: "1.5px solid var(--kt-primary)",
                        }}
                      >
                        <div>
                          <TemplateComponent
                            template={autoOptions?.Template}
                            data={item}
                          />
                        </div>
                      </div>
                    </>
                  </div>
                ))}
            </>
          </div>
        </div>
      ) : null}
    </OutsiderAlert>
  );
};

export default DynamicAutoComplete;
