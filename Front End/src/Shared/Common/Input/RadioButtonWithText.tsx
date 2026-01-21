import React, { useEffect, useRef, useState } from "react";
import useLang from "./../../hooks/useLanguage";
import { useBilling } from "Shared/hooks/useBilling";
import { getToxTestingOption } from "Utils/Common/Requisition";
import InsuranceService from "Services/InsuranceService/InsuranceService";

const RadioButtonWithText = (props: any) => {
  const { t } = useLang();
  const { addBillingInfo, removeBillingInfo } = useBilling();
  const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
  useEffect(() => {
    // Scroll to the div if props.error is present
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    props.setErrorFocussedInput && props.setErrorFocussedInput();
  }, [props?.errorFocussedInput]);

  let inputsCopy = JSON?.parse(JSON?.stringify(props?.Inputs));
  let toxtestingoptionindex = getToxTestingOption(inputsCopy);

  const fetchedOptions = useRef(false);

  // Fetch insurance providers based on insurance ID
  const getOptions = async (id: any) => {
    fetchedOptions.current = true;
    try {
      const res = await InsuranceService.GetInsuranceProvidersDropdown(id);
      return res?.data;
    } catch (err) {
      console.error("Error fetching insurance providers", err);
    }
  };

  const autoBillingSelection = async () => {
    if (props?.name === "BillingType") {
      const billingSelected = props?.RadioOptions?.find(
        (option: any) => option?.label === props?.defaultValue
      );

      if (billingSelected) {
        const response = await getOptions(billingSelected?.optionDataID);
        addBillingInfo(props?.fieldIndex, response);
      }
    }
  };

  useEffect(() => {
    // this is for pre-fetching insurance
    autoBillingSelection();
  }, [props.defaultValue]);

  useEffect(() => {
    if (props.defaultValue === "Samplenotcollected") {
      const validationBackupTemp: any[] = [];
      props?.Inputs[FindIndex(props.Inputs, 4)].fields.forEach((i: any) => {
        if (
          i.systemFieldName === "DateofCollection" ||
          i.systemFieldName === "TimeofCollection" ||
          i.systemFieldName === "DateReceived" ||
          i.systemFieldName === "CollectorID" ||
          i.systemFieldName === "StatOrder" ||
          i.systemFieldName === "CollectedBy"
        ) {
          // Add to temporary backup array
          validationBackupTemp.push({
            systemFieldName: i.systemFieldName,
            validationExpression: i.validationExpression,
          });

          // Modify the field
          i.visible = false;
          i.validationExpression = "";
        }
      });

      // Update state with all backups at once
      props.setValidationBackup((prevBackup: any) => [
        ...prevBackup,
        ...validationBackupTemp,
      ]);
    }
  }, [props.defaultValue]);

  const emptySectionOnBillingType = () => {
    if (
      props?.Inputs[props?.index]?.fields[props?.fieldIndex]?.repeatFields[
        props?.repeatFieldIndex
      ]?.systemFieldName === "BillingType"
    ) {
      props?.Inputs[props?.index].fields[props?.fieldIndex].repeatFields.map(
        (i: any) => {
          i.defaultValue = "";
          i.selectedText = "";
        }
      );
      props?.setInputs(props?.Inputs);
    }
  };
  function FindIndex(arr: any[], id: any) {
    return arr.findIndex((i: any) => i.sectionId === id);
  }

  const removeFields = (billingInfoSectionid: number, fieldsId: number) => {
    removeBillingInfo(props.fieldIndex);
    let inputsCopy = [...props.Inputs];
    inputsCopy[fieldsId].fields.splice(billingInfoSectionid, 1);
    props?.setInputs && props?.setInputs(inputsCopy);
  };


  return (
    <>
      <div
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mt-5 mb-5 d-flex flex-wrap gap-2`
            : "col-lg-6 col-md-6 col-sm-12 d-flex flex-wrap gap-2 mt-5 mb-5"
        }
        id={props?.name}
        ref={divElement}
        tabIndex={-1}
      >
        <label
          className={`d-block mb-2 fw-500 text-dark${props.required ? " required" : ""
            }`}
        >
          {t(props?.label)}
        </label>
        <div className="d-flex gap-2 justify-content-start">
          {Array.isArray(props?.RadioOptions) &&
            props?.RadioOptions?.map((choice: any) => {
              return (
                choice?.isVisable && (
                  <label
                    key={choice?.id}
                    className={
                      props.name === "POCTestResult"
                        ? "col-12 fw-400 d-flex justify-content-start align-items-start"
                        : "col-12 col-lg-6 fw-400 d-flex justify-content-start align-items-start"
                    }
                    htmlFor={choice?.name + choice?.id}
                    id={choice?.name + choice?.id}
                  >
                    <input
                      className="form-check-input ifuser flex-column-auto h-20px w-20px"
                      type="radio"
                      name={
                        props?.name +
                        props?.repeatFieldIndex +
                        window.crypto.randomUUID()
                      }
                      id={choice?.id}
                      data-nameCheck={props?.name}
                      data-test-id={choice.label.split(" ").join("")}
                      data-name={choice?.name}
                      data-id={choice?.id}
                      data-optionDataId={choice?.optionDataID}
                      value={choice?.value}
                      checked={
                        props?.defaultValue
                          ? String(choice?.value || "").split(" ").join("") ===
                          String(props?.defaultValue || "").split(" ").join("")
                          : choice?.isSelectedDefault
                      }
                      defaultChecked={choice.isSelectedDefault ? true : false}
                      onChange={async (e: any) => {
                        // for emptying billing section on changing billingType
                        emptySectionOnBillingType();
                        const { value } = e.target;
                        const optionDataId =
                          e.target.getAttribute("data-optiondataid");
                        const dataId = e.target.getAttribute("data-id");
                        const nameCheck = e.target.getAttribute("data-namecheck");
                        if (nameCheck === "BillingType") {
                          localStorage.setItem("insurnceID", dataId);
                          localStorage.setItem("insuranceOptionId", optionDataId);
                        }

                        props?.onChange(
                          e,
                          value,
                          choice?.value,
                          props.systemFieldName === "SpecimenType" ||
                            props.systemFieldName === "BillingType"
                            ? choice?.label
                            : choice?.value
                        );

                        if (nameCheck === "BillingType") {
                          if (
                            e.target.value === "Client Bill" ||
                            e.target.value === "Self Pay"
                          ) {
                            props.setCheckbox(true);
                            props?.Inputs[props?.index].fields.map(
                              (arr: any, index: any) => {
                                if (arr.displayFieldName === "Repeat Start") {
                                  if (index != 0) {
                                    removeFields(index, props?.index);
                                  }
                                }
                              }
                            );
                          } else {
                            props.setCheckbox(false);
                            props.setShowButton(true);
                            props.setDisableCheckbox(false);
                            props.setIns(false);
                          }
                          const response = await getOptions(optionDataId);
                          addBillingInfo(props?.fieldIndex, response);
                        }

                        // Check for Tox testing option based on specimen type
                        const isToxTesting =
                          props?.ArrayReqId === 3 &&
                          props.systemFieldName === "SpecimenType";

                        if (isToxTesting) {
                          let panelType: any = [];
                          const panelTypeSet = new Set<string>();
                          props?.Inputs[toxtestingoptionindex]?.fields?.forEach(
                            (field: any) => {
                              if (field.systemFieldName === "Compendium") {
                                const panels = field?.panels;
                                panels.forEach((panel: any) => {
                                  // Initialize a flag to check if any testOption in the panel is visible
                                  let anyTestOptionVisible = false;

                                  panel.testOptions.forEach((testOption: any) => {
                                    const specimenType = testOption?.specimenType
                                      .trim()
                                      .toLowerCase();
                                    const label = choice.label
                                      .trim()
                                      .toLowerCase();

                                    // Check if specimenType matches the label
                                    if (specimenType === label) {

                                      panelTypeSet.add(panel.panelType);
                                      testOption.isVisible = true; // Make the test option visible
                                      anyTestOptionVisible = true; // Mark the panel to be visible
                                    } else {
                                      testOption.isVisible = false; // Otherwise, hide the test option
                                    }
                                  });

                                  // If no test option is visible, make the panel invisible
                                  panel.isVisible = anyTestOptionVisible;
                                });
                              }
                            }
                          );
                          panelType = Array.from(panelTypeSet);
                          props?.Inputs[toxtestingoptionindex]?.fields?.forEach((field: any) => {
                            if (field.systemFieldName === "TestingOprtionCheckboxes") {
                              field.options.forEach((option: any) => {
                                if (panelType.includes(option.name)) {
                                  option.isVisable = true;
                                }
                                else {
                                  option.isVisable = false;
                                }
                              });
                            }
                          })
                        }

                        if (props.sectionId === 4) {
                          if (choice?.value === "Sample not collected") {
                            // Temporary array to store backups
                            const validationBackupTemp: any[] = [];
                            props?.Inputs[
                              FindIndex(props.Inputs, 4)
                            ].fields.forEach((i: any) => {
                              if (
                                i.systemFieldName === "DateofCollection" ||
                                i.systemFieldName === "TimeofCollection" ||
                                i.systemFieldName === "DateReceived" ||
                                i.systemFieldName === "CollectorID" ||
                                i.systemFieldName === "StatOrder" ||
                                i.systemFieldName === "CollectedBy"
                              ) {
                                // Add to temporary backup array
                                validationBackupTemp.push({
                                  systemFieldName: i.systemFieldName,
                                  validationExpression: i.validationExpression,
                                });

                                // Modify the field
                                i.visible = false;
                                i.validationExpression = "";
                                i.defaultValue = "";
                              }
                            });

                            // Update state with all backups at once
                            props.setValidationBackup((prevBackup: any) => [
                              ...prevBackup,
                              ...validationBackupTemp,
                            ]);
                          } else {
                            props?.Inputs[
                              FindIndex(props.Inputs, 4)
                            ].fields.forEach((i: any) => {
                              if (
                                i.systemFieldName === "DateofCollection" ||
                                i.systemFieldName === "TimeofCollection" ||
                                i.systemFieldName === "DateReceived" ||
                                i.systemFieldName === "CollectorID" ||
                                i.systemFieldName === "StatOrder" ||
                                i.systemFieldName === "CollectedBy"
                              ) {
                                // Set visibility back to true
                                i.visible = true;
                                // Restore the validation expression from the backup
                                const backup = props.validationBackup.find(
                                  (b: any) =>
                                    b.systemFieldName === i.systemFieldName
                                );
                                if (backup) {
                                  i.validationExpression =
                                    backup.validationExpression;
                                }
                              }
                            });
                            props?.Inputs[
                              FindIndex(props.Inputs, 4)
                            ].dependencyControls.forEach((i: any) => {
                              if (i.label == "Sample not collected") {
                                i.dependecyFields.forEach((j: any) => {
                                  if (!j.displayType.includes("d-none")) {
                                    j.displayType =
                                      j.displayType + " " + "d-none";
                                  }
                                });
                              }
                            });
                          }
                        }
                        if (props.sectionId === 89) {
                          const inputIndex = FindIndex(props.Inputs, 89);
                          const input = props?.Inputs?.[inputIndex];

                          if (!input?.fields) return;

                          props?.Inputs?.[inputIndex].fields.forEach(
                            (field: any) => {
                              if (
                                field.systemFieldName === "MedicalNessityPanel"
                              ) {
                                field.defaultValue = [choice];
                              }
                            }
                          );
                        }
                        //setting VMA checkbox true on selection of any Test from POC except POCTestingwasNotPerformed
                        if (
                          props?.sectionId === 36 &&
                          props?.systemFieldName !== "POCTestResult"
                        ) {
                          props?.Inputs[props.index]?.dependencyControls?.forEach(
                            (control: any) => {
                              control?.dependecyFields?.forEach((field: any) => {
                                if (field?.systemFieldName === "VMA") {
                                  field.defaultValue = true;
                                  props.setScreening(true);
                                }
                              });
                            }
                          );
                        }
                        //resetting dependency controls if POCTestingwasNotPerformed is selected
                        if (
                          props?.sectionId === 36 &&
                          props?.systemFieldName == "POCTestResult" &&
                          props?.fields?.defaultValue ===
                          "POC Testing was Not Performed"
                        ) {
                          props?.Inputs[props.index]?.dependencyControls?.forEach(
                            (control: any) => {
                              control?.dependecyFields?.forEach((field: any) => {
                                field.defaultValue = "";
                                props.setScreening(false);
                              });
                            }
                          );
                        }
                      }}
                      disabled={
                        props.sectionId === 45 || props.sectionId === 46
                          ? props.isEnable : props?.sectionId === 20 ? props.noActiveMedication
                            : props?.disabled
                      }
                      required={props.required}
                    />
                    <span className="ps-2 text-break">{t(choice?.label)}</span>
                  </label>
                )
              );
            })}
        </div>
        {props.error && (
          <div className="form__error">
            <span>{t(props.error)}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(RadioButtonWithText);
