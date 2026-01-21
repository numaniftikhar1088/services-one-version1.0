import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import MuiSkeleton from "../MuiSkeleton";
import { assignFormValues, clearSignature } from "Utils/Auth";

const Checkbox = (props: any) => {
  const { t } = useLang();
  const location = useLocation();
  const [checked, setChecked] = useState<any>(
    location?.state?.reqId ? props.checked : false
  );
  function FindIndex(arr: any[], rid: any) {
    return arr.findIndex((i: any) => i.reqId === rid);
  }
  useEffect(() => {
    setChecked(location?.state?.reqId ? props.checked : false);
  }, [props?.apiCallCondition]);

  useEffect(() => {

    if (!location?.state?.reqId) return

    if (props.systemFieldName === "NoMedication") {
      if (props?.defaultValue) props.setNoActiveMedication(true)
    }
    assignFormValues(
      props.Inputs,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      props.defaultValue,
      props.isDependency,
      props.repeatFieldSection,
      props.isDependencyRepeatFields,
      props.repeatFieldIndex,
      props.repeatDependencySectionIndex,
      props.repeatDepFieldIndex,
      props.label,
      props?.setInputs,
      location?.state?.reqId,
      props?.patientId
    );

  }, [props?.defaultValue]);

  const SplitStringByDollarSign = (inputString: any) => {
    const splitIndex = inputString.indexOf("$");
    if (splitIndex === -1) {
      return <span>{inputString}</span>;
    } else {
      const part1 = inputString.substring(0, splitIndex);
      const part2 = inputString.substring(splitIndex + 1);
      return (
        <>
          <span>{part1}</span> <br />
          <span className="text-muted">{part2}</span>
        </>
      );
    }
  };

  const clearSectionProviderValidation = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      props.Inputs[props.index].fields[props.fieldIndex].systemFieldName ===
      "IsNoProvider" &&
      props.Inputs[props.index].sectionId === 30
    ) {
      const validationBackupTemp: any[] = [];
      props.Inputs[props.index].fields.forEach((item: any) => {
        if (item.systemFieldName !== "IsNoProvider") {
          if (event.target.checked === true) {
            // when isNoProvider is checked (true)
            item.displayType += " overlay";

            validationBackupTemp.push({
              systemFieldName: item.systemFieldName,
              validationExpression: item.validationExpression,
            });

            item.validationExpression = "";

            props.setProviderInfoValidation((prevBackup: any) => [
              ...prevBackup,
              ...validationBackupTemp,
            ]);

            clearSignature();
          } else {
            // when isNoProvider is unchecked (false)
            item.displayType = item.displayType
              .replace(/\s*overlay\s*/, " ")
              .trim();

            // Restore the validation expression from the backup
            const backup = props.providerInfoValidation.find(
              (b: any) => b.systemFieldName === item.systemFieldName
            );
            if (backup) {
              item.validationExpression = backup.validationExpression;
            }
          }
          item.defaultValue = "";
          item.signatureText = "";
        }
      });

      props.Inputs[props.index].dependencyControls.forEach(
        (dependencyFields: any) => {
          dependencyFields.dependecyFields.map((item: any) => {
            if (item.systemFieldName !== "IsNoProvider") {
              if (event.target.checked === true) {
                // when isNoProvider is checked (true)
                item.displayType += " overlay";

                validationBackupTemp.push({
                  systemFieldName: item.systemFieldName,
                  validationExpression: item.validationExpression,
                });

                item.validationExpression = "";

                props.setProviderInfoValidation((prevBackup: any) => [
                  ...prevBackup,
                  ...validationBackupTemp,
                ]);

                clearSignature();
              } else {
                // when isNoProvider is unchecked (false)
                item.displayType = item.displayType
                  .replace(/\s*overlay\s*/, " ")
                  .trim();

                // Restore the validation expression from the backup
                const backup = props.providerInfoValidation.find(
                  (b: any) => b.systemFieldName === item.systemFieldName
                );
                if (backup) {
                  item.validationExpression = backup.validationExpression;
                }
              }
              item.defaultValue = "";
              item.signatureText = "";
            }
          });
        }
      );
      props.setInputs(props.Inputs);
    }
    if (
      props?.Inputs[props?.index]?.fields[props?.fieldIndex]
        ?.systemFieldName === "DeclineToProvide"
    ) {
      props.Inputs[props.index].fields.forEach((item: any) => {
        if (item.systemFieldName !== "IsNoProvider") {
          if (event.target.checked === true) {
            props.Inputs[props.index].fields.map((item: any) => {
              if (item.systemFieldName === "SocialSecurityNumber") {
                item.defaultValue = "";
                props.setDisableSSN(true);
              }
            });
          } else {
            props.setDisableSSN(false);
          }
        }
      });
      props.setInputs(props.Inputs);
    }
  };

  //DeclineToProvide
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.systemFieldName === "NoSecondaryInsurance") {
      if (event.target.checked) {
        props.onChange(event);
        props.setCheckbox && props.setCheckbox(true);
        props.setIns(true);
      } else {
        props.onChange(event);
        props.setCheckbox && props.setCheckbox(false);
        props.setIns(false);
      }
    }
    if (props.systemFieldName === "NoMedication") {
      props.onChange(event);

      const isChecked = event.target.checked;
      props.setNoActiveMedication(isChecked);

      const fields = props.Inputs[props.index].fields;

      if (isChecked) {
        // 1️⃣ Reset all fields except "NoMedication"
        fields.forEach((field: any) => {
          if (field.systemFieldName === "NoMedication") return;

          switch (field.systemFieldName) {
            case "MedicationType":
              field.defaultValue = "";
              field.options?.forEach((option: any) => (option.isSelectedDefault = false));
              break;

            case "AssignedMedications":
              if (Array.isArray(field.medicationList)) {
                field.medicationList.forEach((med: any) => (med.isSelected = false));
                field.defaultValue = [];
              }
              break;

            case "OtherMedication":
              field.defaultValue = [];
              field.medicationList = []
              break;

            case "MedicationPanel":
              field.defaultValue = [
                {
                  name: event.target.name,
                  value: isChecked,
                },
              ];
              break;

            case "RepeatStart":
              field.defaultValue = "";
              field.repeatFields?.forEach((rf: any) => {
                if (rf.systemFieldName !== "RepeatStart") rf.defaultValue = "";
              });
              break;

            default:
              break;
          }
        });

        // 2️⃣ Keep only the first RepeatStart
        const seenRepeatStart = new Set();
        props.Inputs[props.index].fields = fields.filter((f: any) => {
          if (f.systemFieldName !== "RepeatStart") return true;

          if (!seenRepeatStart.has("RepeatStart")) {
            seenRepeatStart.add("RepeatStart");
            return true;
          }

          return false;
        });
      }

      else {
        // If unchecked → reset MedicationPanel only
        fields.forEach((field: any) => {
          if (field.systemFieldName === "MedicationPanel") {
            field.defaultValue = [];
          }
        });
      }
    }


    else {
      props.onChange(event);
      setChecked(event.target.checked);
      clearSectionProviderValidation(event);
    }
  };

  const inputElement = useRef<any>(null);

  useEffect(() => {
    if (inputElement.current && props.error) {
      inputElement.current.focus();
    }
  }, [props.error]);

  const isNoProvider =
    props?.Inputs?.[props.index]?.fields[props?.fieldIndex]?.systemFieldName ===
    "IsNoProvider" &&
    props?.Inputs?.[props.index]?.fields[props?.fieldIndex]?.defaultValue ===
    "True";

  useEffect(() => {
    if (isNoProvider && props.Inputs[props.index].sectionId === 30) {
      setChecked(props.defaultValue);

      props.Inputs[props.index].fields.forEach((item: any) => {
        if (item.systemFieldName !== "IsNoProvider") {
          item.displayType += " overlay";
        }
      });
    }

    if (
      props?.Inputs &&
      Array.isArray(props?.Inputs) &&
      props?.Inputs[props?.index] &&
      Array.isArray(props?.Inputs[props?.index]?.fields) &&
      props?.Inputs[props?.index]?.fields[props?.fieldIndex] &&
      props?.Inputs[props?.index]?.fields[props?.fieldIndex]
        ?.systemFieldName === "DeclineToProvide"
    ) {
      if (props?.defaultValue === true || props?.defaultValue === "True") {
        props?.setDisableSSN(true);
      }
    }

    if (
      props?.Inputs &&
      Array.isArray(props?.Inputs) &&
      props?.Inputs[props?.index] &&
      Array.isArray(props?.Inputs[props?.index]?.fields) &&
      props?.Inputs[props?.index]?.fields[props?.fieldIndex] &&
      props?.Inputs[props?.index]?.fields[props?.fieldIndex]
        ?.systemFieldName === "NoKnownFamilyHistory"
    ) {
      if (
        props?.Inputs[props?.index]?.fields[props?.fieldIndex]?.defaultValue
      ) {
        props.setNoFamilyHistory(true);
      }
    }
  }, [props.defaultValue]);
  useEffect(() => {
    if (props.formState) {
      if (
        props.formState.BillingType === "Client Bill" ||
        props.formState.BillingType === "Self Pay"
      ) {
        if (props?.repeatControlLength == 1) {
          props.setIns(true);
          props.setShowButton(false);
        }
      } else {
        if (props?.repeatControlLength == 1) {
          props.setShowButton(true);
          props.setDisableCheckbox(false);
          props.setCheckbox(false);
        }
      }
    }
  }, [props?.formState]);
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
  return (
    <>
      <div
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mb-4`
            : "col-lg-6 col-md-6 col-sm-12 mb-4"
        }
      >
        <div className="form__group form__group--checkbox">
          <label
            className={
              props?.labelClassName
                ? `${props?.labelClassName} fw-500 ` + `${props?.required}`
                : "form-check form-check-inline form-check-solid m-0 fw-500" +
                `${props?.required}`
            }
          >
            {props.sectionId === 12 ? (
              <input
                className="form-check-input h-20px w-20px"
                type="checkbox"
                name={props.label}
                id={props.label.split(" ").join("")}
                value={props.value}
                onChange={props.onChange}
                checked={props.checked}
                ref={inputElement}
              />
            ) : props.sectionId === 53 ? (
              <input
                className="form-check-input h-20px w-20px"
                type="checkbox"
                id={props.label.split(" ").join("")}
                name={props.label}
                onChange={props.onChange}
                defaultChecked={props.defaultValue}
                checked={props.checked}
                disabled={props?.isEnable}
                ref={inputElement}
              />
            ) : props.sectionId === 17 ||
              props.sectionId === 35 ||
              props.sectionId === 21 ? (
              <>
                {" "}
                <input
                  className="form-check-input h-20px w-20px"
                  type="checkbox"
                  id={props.label.split(" ").join("")}
                  name={props.label}
                  value={props.value}
                  onChange={props.onChange}
                  defaultChecked={props.defaultValue === "True" ? true : false}
                  checked={props.checked}
                  disabled={props?.disabled}
                  ref={inputElement}
                />
              </>
            ) : props.systemFieldName === "NoSecondaryInsurance" &&
              props.showButton ? (
              <>
                <input
                  className="form-check-input h-20px w-20px"
                  type="checkbox"
                  id={props.label.split(" ").join("")}
                  name={props?.label}
                  value={props?.value}
                  onChange={handleCheckboxChange}
                  checked={props?.defaultValue}
                  defaultChecked={props?.checked}
                  disabled={props?.disableCheckbox}
                  ref={inputElement}
                />
              </>
            ) : props.sectionId === 14 ? (
              <>
                <input
                  className="form-check-input h-20px w-20px"
                  type="checkbox"
                  id={props.label.split(" ").join("")}
                  name={props?.label}
                  value={props?.value}
                  onChange={props?.onChange}
                  checked={props?.defaultValue}
                  defaultChecked={props?.checked}
                  disabled={props?.disabled}
                  ref={inputElement}
                />
              </>
            ) : props.systemFieldName === "VMA" ? (
              <>
                <input
                  className="form-check-input h-20px w-20px"
                  type="checkbox"
                  id={props.label.split(" ").join("")}
                  name={props.label}
                  value={props.value}
                  checked={
                    props.defaultValue === "True" ||
                    props.value === "True" ||
                    props.defaultValue === true ||
                    props.value === true
                  }
                  disabled={true}
                  ref={inputElement}
                />
              </>
            ) :
              props.sectionId === 89 ? (
                <>
                  <input
                    className="form-check-input h-20px w-20px"
                    type="checkbox"
                    id={props.label.split(" ").join("")}
                    name={props.label}
                    value={props.value}
                    onChange={handleCheckboxChange}
                    checked={
                      props.defaultValue === "True" ||
                      props.value === "True" ||
                      props.defaultValue === true ||
                      props.value === true
                    }
                    // disabled={props.noActiveMedication}
                    ref={inputElement}
                  />
                </>
              ) : (
                <>
                  <input
                    className="form-check-input h-20px w-20px"
                    type="checkbox"
                    id={props.label.split(" ").join("")}
                    name={props.label}
                    value={props.value}
                    onChange={handleCheckboxChange}
                    checked={
                      props.defaultValue === "True" ||
                      props.value === "True" ||
                      props.defaultValue === true ||
                      props.value === true
                    }
                    disabled={props?.disabled || isNoProvider}
                    ref={inputElement}
                  />
                </>
              )}

            {props?.loading ? (
              <MuiSkeleton height={22} />
            ) : props.systemFieldName === "Paternal" ||
              props.systemFieldName === "Maternal" ? null : (
              <span
                className={
                  props?.spanClassName
                    ? `${props.spanClassName} text-break fw-400${props.required ? " required" : ""
                    }`
                    : ""
                }
              >
                {props?.testCode ? `${props.testCode}:` : ""}
                {SplitStringByDollarSign(t(props.label))}
              </span>
            )}
          </label>
          {props.error && (
            <div className="form__error">
              <span>{t(props.error)}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkbox;
