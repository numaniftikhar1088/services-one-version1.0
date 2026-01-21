import { SetStateAction, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import OutsiderAlert from "../../Shared/OutsiderAlert";
import { assignFormValues } from "../../Utils/Auth";
import Splash from "../Common/Pages/Splash";
import useComorAutocomplete from "./ComorAutoComplete";

const ComorAutocomplete = (props: any) => {
  const { t } = useLang();
  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getApiCallName();
  }, [props.value]);

  useEffect(() => {
    clearInput();
  }, [props?.inputEmpty]);

  const {
    searchedValue,
    setSearchedValue,
    setapiCallDetails,
    setTouched,
    setActiveSuggestion,
    setSelectedSuggestion,
    suggestions,
    setSuggestions,
    selectedSuggestion,
    loading,
    handleChange,
    handleKeyDown,
    handleClick,
    touched,
  } = useComorAutocomplete(inputSearchRef.current, props.Inputs);
  const location = useLocation();

  const clearInput = () => {
    setSearchedValue("");
  };

  useEffect(() => {
    setDefaultValue();
  }, [props.defaultValue]);

  const getApiCallName = () => {
    setapiCallDetails({
      apiCallName: props?.apiCall,
    });
    setSearchedValue(props?.value);
  };

  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      // Close suggestions on Shift or Tab key press
      if (event.key === "Tab" || event.key === "Shift") {
        setTouched(false);
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleKeyDownEvent);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, []);

  const setDefaultValue = () => {
    setSearchedValue(props.defaultValue);
  };

  const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
  useEffect(() => {
    // Scroll to the div if props.error is present
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    props.setErrorFocussedInput && props.setErrorFocussedInput();
  }, [props?.errorFocussedInput]);

  // Keys relevant to ICD10, kept this for showing filtered entries or fallback display
  const allowedKeys = ["icd10id", "code", "description"];

  const filteredEntries = (item: any) => {
    return Object.entries(item).filter(([key]) => allowedKeys.includes(key));
  };


  return (
    <>
      <div className={`${props.parentDivClassName} position-relative`}>
        <OutsiderAlert
          setSuggestions={setSuggestions}
          setSearchedValue={setSearchedValue}
          setSelectedSuggestion={setSelectedSuggestion}
          setActiveSuggestion={setActiveSuggestion}
          setTouched={setTouched}
        >
          <div
            id={props?.sysytemFieldName}
            ref={divElement}
            tabIndex={-1}
          ></div>
          <div className="position-relative">
            <label
              className={
                props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"
              }
            >
              {t(props.label)}
            </label>
            <input
              disabled={props.disabled}
              className={`${props.parentDivClassName} form-control bg-transparent mb-2`}
              placeholder={t(props?.label)}
              value={
                typeof searchedValue === "string"
                  ? searchedValue
                  : typeof searchedValue === "object"
                    ? searchedValue?.code
                    : ""
              }
              id={props?.sysytemFieldName}
              onChange={async (event: {
                target: { value: SetStateAction<string> };
              }) => {
                handleChange(event);
                let newInputs = await assignFormValues(
                  props.Inputs,
                  props?.index,
                  props?.depControlIndex,
                  props?.fieldIndex,
                  event.target.value,
                  props?.isDependency,
                  props?.repeatFieldSection,
                  props?.isDependencyRepeatFields,
                  props?.repeatFieldIndex,
                  props?.repeatDependencySectionIndex,
                  props?.repeatDepFieldIndex,
                  undefined,
                  props?.setInputs
                );
                if (!location?.state?.reqId) {
                  props?.setInputs(newInputs);
                }
                props.fields.enableRule = "";
              }}
              onKeyDown={handleKeyDown}
              ref={inputSearchRef}
              color="secondary"
            />
            {props.error && (
              <div className="form__error">
                <span>{t(props.error)}</span>
              </div>
            )}

            {loading ? (
              <div className="centered-element">
                <Splash />
              </div>
            ) : null}
          </div>

          {suggestions?.length > 0 && (
            <div
              className={`bg-white card position-absolute px-3 py-2 shadow-xs w-100 position-relative  ${
                !touched ? "d-none" : ""
              }`}
              style={{
                zIndex: 6,
                overflowY: "auto",
                maxHeight: "400px",
                height: "fit-content",
              }}
            >
              <div>
                {!suggestions.length &&
                searchedValue.length &&
                !selectedSuggestion.length ? (
                  <div className="row">
                    <div>
                      <div>{t("Nothing to show :")}</div>
                    </div>
                  </div>
                ) : (
                  suggestions.map((item: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => {
                        handleClick(item);
                        props?.setValues((preVal: any) => ({
                          ...preVal,
                          description: item?.description,
                          code: item?.code,
                          comorId: item?.id,
                        }));
                      }}
                      className="d-flex gap-2 flex-wrap py-2 px-4 rounded-4 bg-hover-light-primary"
                      style={{
                        borderBottom: "1.5px solid var(--kt-primary)",
                        cursor: "pointer",
                      }}
                    >
                      {filteredEntries(item).length > 0 ? (
                        <div className="d-flex gap-2 flex-wrap">
                          {filteredEntries(item).map(([key, value], i) => (
                            <div key={i}>
                              <span className="fw-600 fs-7">
                                {key.toUpperCase()}:{" "}
                              </span>
                              <span className="pl-2 fs-7">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <span>
                            <span className="fw-600 fs-7">
                              {item?.icd10id}: {item?.code}
                            </span>
                            : {item?.description}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </OutsiderAlert>
      </div>
    </>
  );
};

export default ComorAutocomplete;
