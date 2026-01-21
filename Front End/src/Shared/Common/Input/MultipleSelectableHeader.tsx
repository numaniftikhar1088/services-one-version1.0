import { useEffect, useRef, useState } from "react";
import { assignFormValues } from "../../../Utils/Auth";
import {
  getICDPanelsIndex,
  getSpecimenSourceIndex,
  panelsArrItemAddChild,
  panelsArrItemRemoval,
  panelsArrItemRemovalChild,
  panelsArrMakerToSend,
} from "../../../Utils/Common/Requisition";
import useLang from "../../hooks/useLanguage";
import { useLocation } from "react-router-dom";

const MultipleHeaderSelectable = (props: any) => {
  const { t } = useLang();
  const [panelsArrToSend, setPanelsArrToSend] = useState<any>([]);
  const location = useLocation()
  useEffect(() => {
    const {
      Inputs,
      index,
      fieldIndex,
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

    const currentField = Inputs?.[index]?.fields?.[fieldIndex];
    let inputsCopy = JSON?.parse(JSON?.stringify(props?.Inputs));
    let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);

    if (!currentField?.panels || location.state?.reqId) return;

    const specimenInputs = specimenSourceIndex != null ? props?.Inputs[specimenSourceIndex]?.fields : null;

    currentField.panels.forEach((panel: any) => {
      if (!panel.isDefaultSelectOnRequisition) return;

      panel.isSelected = true;

      // Set visibility on matching specimenSources
      if (specimenInputs) {
        specimenInputs?.forEach((field: any) => {
          field?.specimenSources?.forEach((source: any) => {
            if (source?.panelName === panel.panelName) {
              source.isVisible = true;
              source.isSelected = true;
              source?.specimenSourceOption?.forEach((element: any) => {
                element.isSelected = true;
              });
            }
          });
        });
      }

      // Select all test options
      panel.testOptions?.forEach((option: any) => {
        option.isSelected = true;
      });
    });

    const newInputsPromise = assignFormValues(
      Inputs,
      index,
      depControlIndex,
      fieldIndex,
      currentField?.panels,
      isDependency,
      repeatFieldSection,
      isDependencyRepeatFields,
      repeatFieldIndex,
      repeatDependencySectionIndex,
      repeatDepFieldIndex,
      undefined,
      setInputs
    );

    newInputsPromise?.then((updatedSections) => {
      if (!updatedSections) return;

      const infectiousDataCopy = JSON.parse(JSON.stringify(infectiousData));
      const sectionIndex = FindIndex(infectiousData, ArrayReqId);

      if (sectionIndex !== -1) {
        infectiousDataCopy[sectionIndex].sections = updatedSections;
        setInfectiousData([...infectiousDataCopy]);
      }
    });
  }, [props?.IsSelectedByDefaultCompendiumData]);

  useEffect(() => {
    setpanelsArrToSendForEdit();
  }, [props.panels]);

  function FindIndex(arr: any[], rid: any) {
    return arr.findIndex((i: any) => i.reqId === rid);
  }
  const handleChangeParent = (
    panelID: number,
    panelName: string,
    checked: boolean,
    index: number
  ) => {
    props.fields.enableRule = "";
    const name = panelName;
    let panelsArrToAppendCopy = [...panelsArrToSend];
    let inputsCopy = JSON?.parse(JSON?.stringify(props?.Inputs));
    if (checked) {
      let ICDPanelIndex = getICDPanelsIndex(props?.Inputs);
      let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      props.Inputs[props.index].fields[props?.fieldIndex].panels[
        index
      ].isSelected = true;
      props.Inputs[props.index].fields[props?.fieldIndex].panels[
        index
      ].testOptions.forEach((testOptions: any) => {
        testOptions.isSelected = true;
      });
      if (ICDPanelIndex) {
        props.Inputs[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
          if (IcdPanelsFields.systemFieldName == "ICDPanels") {
            IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = true;
              }
            });
          }
        });
      }
      if (specimenSourceIndex) {
        props?.Inputs[specimenSourceIndex]?.fields?.forEach(
          (specimenSourceFields: any) => {
            specimenSourceFields?.specimenSources?.forEach(
              (panelsInfo: any) => {
                if (panelsInfo?.panelName === name) {
                  panelsInfo.isVisible = true;
                }
              }
            );
          }
        );
      }
      let finalisedPanelsArrToSend = panelsArrMakerToSend(
        index,
        props?.Inputs[props.index]?.fields[props?.fieldIndex]?.panels[index],
        panelsArrToAppendCopy,
        checked
      );
      setPanelsArrToSend(finalisedPanelsArrToSend);
      let newInputs = assignFormValues(
        props?.Inputs,
        props?.index,
        props?.depControlIndex,
        props?.fieldIndex,
        finalisedPanelsArrToSend,
        props?.isDependency,
        props?.repeatFieldSection,
        props?.isDependencyRepeatFields,
        props?.repeatFieldIndex,
        props?.repeatDependencySectionIndex,
        props?.repeatDepFieldIndex,
        undefined,
        props?.setInputs
      );
      newInputs?.then((res) => {
        let infectiousDataCopy = JSON?.parse(
          JSON?.stringify(props?.infectiousData)
        );
        infectiousDataCopy[
          FindIndex(props?.infectiousData, props?.ArrayReqId)
        ].sections = res;
        props?.setInfectiousData([...infectiousDataCopy]);
      });
    }
    if (!checked) {
      // debugger;
      let ICDPanelIndex = getICDPanelsIndex(props?.Inputs);
      let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      if (ICDPanelIndex !== undefined && ICDPanelIndex !== null) {
        inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
          if (IcdPanelsFields.systemFieldName == "ICDPanels") {
            IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = false; // Properly setting isVisible to false
              }
            });
          }
        });
      }
      if (specimenSourceIndex) {
        inputsCopy[specimenSourceIndex]?.fields?.forEach(
          (specimenSourceFields: any) => {
            specimenSourceFields?.specimenSources?.forEach(
              (panelsInfo: any) => {
                if (panelsInfo?.panelName === name) {
                  panelsInfo.isVisible = false;
                }
              }
            );
          }
        );
      }
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].isSelected = false;
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].testOptions.forEach((testOptions: any) => {
        testOptions.isSelected = false;
      });

      let finalisedPanelsArrToSend = panelsArrItemRemoval(
        panelID,
        panelsArrToAppendCopy
      );
      setPanelsArrToSend(finalisedPanelsArrToSend);
      let newInputs = assignFormValues(
        inputsCopy,
        props?.index,
        props?.depControlIndex,
        props?.fieldIndex,
        finalisedPanelsArrToSend,
        props?.isDependency,
        props?.repeatFieldSection,
        props?.isDependencyRepeatFields,
        props?.repeatFieldIndex,
        props?.repeatDependencySectionIndex,
        props?.repeatDepFieldIndex,
        undefined,
        props?.setInputs
      );
      newInputs?.then((res) => {
        let infectiousDataCopy = JSON?.parse(
          JSON?.stringify(props?.infectiousData)
        );
        infectiousDataCopy[
          FindIndex(props?.infectiousData, props?.ArrayReqId)
        ].sections = res;
        props?.setInfectiousData([...infectiousDataCopy]);
      });
    }
  };
  const [storeChild, setStoreChild] = useState<any>([]);
  const handleChangeChild = (
    testID: string,
    checked: boolean,
    parentPanelName: string,
    index: number,
    childIndex: number,
    panelID: any
  ) => {
    props.fields.enableRule = "";
    let inputsCopy = JSON.parse(JSON?.stringify(props?.Inputs));
    let panelsArrToAppendCopy = JSON.parse(JSON?.stringify(panelsArrToSend));
    let panelsCopy = [...props?.panels];
    let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
    if (checked) {
      let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      props.Inputs[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
        if (IcdPanelsFields.systemFieldName == "ICDPanels") {
          IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
            if (panelsInfo.panelName == parentPanelName) {
              panelsInfo.isVisible = true;
            }
          });
        }
      });
      if (specimenSourceIndex) {
        inputsCopy[specimenSourceIndex]?.fields?.forEach(
          (specimenSourceFields: any) => {
            specimenSourceFields?.specimenSources?.forEach(
              (panelsInfo: any) => {
                if (panelsInfo?.panelName === parentPanelName) {
                  panelsInfo.isVisible = true;
                }
              }
            );
          }
        );
      }
      // Update child checkbox state
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].testOptions[childIndex].isSelected = true;
      // Update parent checkbox state
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].isSelected = true;
      const currentPanel =
        inputsCopy[props.index].fields[props?.fieldIndex].panels[index];
      console.log(currentPanel, "currentPanel");
      // Store the selected panel in storeChild if not already present
      setStoreChild((prevStoreChild: any) => {
        const panelIndex = prevStoreChild.findIndex(
          (panel: any) => panel.panelName === currentPanel.panelName
        );
        if (panelIndex !== -1) {
          // Update the existing panel with the recent one
          const updatedStoreChild = [...prevStoreChild];
          updatedStoreChild[panelIndex] = currentPanel;
          return updatedStoreChild;
        }
        // Add the new panel if it doesn't exist
        return [...prevStoreChild, currentPanel];
      });
      const allChildUnchecked = inputsCopy[props.index].fields[
        props?.fieldIndex
      ].panels[index].testOptions.every((option: any) => !option.isSelected);
      // If all child checkboxes are unchecked, update parent checkbox state and panel visibility
      if (allChildUnchecked) {
        // Uncheck the parent checkbox
        inputsCopy[props.index].fields[props?.fieldIndex].panels[
          index
        ].isSelected = false;
        // Update parent panel visibility
      }

      let newInputs = assignFormValues(
        inputsCopy,
        // props?.dependenceyControls,
        props?.index,
        props?.depControlIndex,
        props?.fieldIndex,
        storeChild,
        props?.isDependency,
        props?.repeatFieldSection,
        props?.isDependencyRepeatFields,
        props?.repeatFieldIndex,
        props?.repeatDependencySectionIndex,
        props?.repeatDepFieldIndex,
        undefined,
        props?.setInputs
      );
      newInputs?.then((res) => {
        let infectiousDataCopy = JSON?.parse(
          JSON?.stringify(props?.infectiousData)
        );
        infectiousDataCopy[
          FindIndex(props?.infectiousData, props?.ArrayReqId)
        ].sections = res;
        props?.setInfectiousData([...infectiousDataCopy]);
      });
    } else {
      let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      props.Inputs[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
        if (IcdPanelsFields.systemFieldName == "ICDPanels") {
          IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
            if (panelsInfo.panelName == parentPanelName) {
              panelsInfo.isVisible = false;
            }
          });
        }
      });

      // Uncheck the child checkbox
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].testOptions[childIndex].isSelected = false;
      const currentPanel =
        inputsCopy[props.index].fields[props?.fieldIndex].panels[index];
      // Store the selected panel in storeChild if not already present
      setStoreChild((prevStoreChild: any) => {
        const panelIndex = prevStoreChild.findIndex(
          (panel: any) => panel.panelName === currentPanel.panelName
        );
        if (panelIndex !== -1) {
          // Update the existing panel with the recent one
          const updatedStoreChild = [...prevStoreChild];
          updatedStoreChild[panelIndex] = currentPanel;
          return updatedStoreChild;
        }
        // Add the new panel if it doesn't exist
        return [...prevStoreChild, currentPanel];
      });
      // Check if all child checkboxes in the parent panel are unchecked
      const allChildUnchecked = inputsCopy[props.index].fields[
        props?.fieldIndex
      ].panels[index].testOptions.every((option: any) => !option.isSelected);
      // If all child checkboxes are unchecked, update parent checkbox state and panel visibility
      if (allChildUnchecked) {
        // Uncheck the parent checkbox
        inputsCopy[props.index].fields[props?.fieldIndex].panels[
          index
        ].isSelected = false;
        if (specimenSourceIndex) {
          inputsCopy[specimenSourceIndex]?.fields?.forEach(
            (specimenSourceFields: any) => {
              specimenSourceFields?.specimenSources?.forEach(
                (panelsInfo: any) => {
                  if (panelsInfo?.panelName === parentPanelName) {
                    panelsInfo.isVisible = false;
                  }
                }
              );
            }
          );
        }
      }

      let newInputs = assignFormValues(
        inputsCopy,
        // props?.dependenceyControls,
        props?.index,
        props?.depControlIndex,
        props?.fieldIndex,
        storeChild,
        props?.isDependency,
        props?.repeatFieldSection,
        props?.isDependencyRepeatFields,
        props?.repeatFieldIndex,
        props?.repeatDependencySectionIndex,
        props?.repeatDepFieldIndex,
        undefined,
        props?.setInputs
      );
      newInputs?.then((res) => {
        let infectiousDataCopy = JSON?.parse(
          JSON?.stringify(props?.infectiousData)
        );
        infectiousDataCopy[
          FindIndex(props?.infectiousData, props?.ArrayReqId)
        ].sections = res;
        props?.setInfectiousData([...infectiousDataCopy]);
      });
    }
    // Update inputs and req states
  };

  const setpanelsArrToSendForEdit = () => {
    let panelsCopy = [...props?.panels];
    let filteredPanelsCopy = panelsCopy?.filter(
      (panelsData: any) => panelsData?.isSelected
    );
    let panelNameArr: any = [];
    filteredPanelsCopy?.forEach((panelData: any) => {
      panelNameArr?.push(panelData?.panelName);
    });
    let inputsCopy = [...props?.Inputs];
    assignFormValues(
      inputsCopy,
      // props?.dependenceyControls,
      props?.index,
      props?.depControlIndex,
      props?.fieldIndex,
      filteredPanelsCopy,
      props?.isDependency,
      props?.repeatFieldSection,
      props?.isDependencyRepeatFields,
      props?.repeatFieldIndex,
      props?.repeatDependencySectionIndex,
      props?.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    );
    setPanelsArrToSend(filteredPanelsCopy);
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
  return (
    <div ref={divElement}>
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}

      <div id={props?.name} ref={divElement} tabIndex={-1}></div>
      {props?.panels?.map((options: any, index: number) => (
        <>
          {options.isVisible && (
            <div className={`${props?.displayType}`}>
              <div className="row">
                {/* ***************** 1/4 ****************** */}
                <div className="col-lg-12">
                  <div className="card border border-gray-300 mb-3 rounded">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center rounded min-h-35px px-4">
                      <div className="col-12">
                        <label className="form-check form-check-sm form-check-solid col-12">
                          <input
                            className="form-check-input mr-2 h-20px w-20px"
                            type="checkbox"
                            checked={options?.isSelected}
                            onChange={(e: any) => {
                              handleChangeParent(
                                options?.panelID,
                                options?.panelName,
                                e.target.checked,
                                index
                              );
                            }}
                          />
                          {<span className="fw-600">{options?.panelName}</span>}
                        </label>
                      </div>
                    </div>
                    <div className="card-body py-md-4 py-3 col-12">
                      <div className="row">
                        {options?.testOptions?.map(
                          (optionsChild: any, childIndex: any) => (
                            <>
                              <div
                                className={
                                  options?.testOptions.length > 1
                                    ? "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
                                    : "mb-3 col-xl-12 col-lg-12 col-md-12 col-sm-12"
                                }
                              >
                                <label className="form-check form-check-sm align-items-start form-check-solid col-12">
                                  <input
                                    className="form-check-input mr-2 h-20px w-20px"
                                    type="checkbox"
                                    onChange={(e: any) => {
                                      handleChangeChild(
                                        optionsChild?.testID,
                                        e?.target?.checked,
                                        options?.panelName,
                                        index,
                                        childIndex,
                                        options?.panelID
                                      );
                                    }}
                                    checked={
                                      // options?.isSelected &&
                                      optionsChild?.isSelected
                                    }
                                  />

                                  <div className="d-flex justify-content-between">
                                    <span className="fw-400">
                                      {optionsChild?.testName}
                                    </span>
                                    <span className="text-muted">
                                      {optionsChild?.specimenType}
                                    </span>
                                  </div>
                                </label>
                              </div>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export { MultipleHeaderSelectable };
