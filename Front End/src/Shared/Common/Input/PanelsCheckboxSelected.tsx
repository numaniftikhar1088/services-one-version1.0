import { useEffect, useRef, useState } from "react";
import { assignFormValues } from "../../../Utils/Auth";
import {
  getICDPanelsIndex,
  getComorbiditiesPanelsIndex,
  getSpecimenSourceIndex,
  panelsArrItemAddChild,
  panelsArrItemRemoval,
  panelsArrItemRemovalChild,
  panelsArrMakerToSend,
} from "../../../Utils/Common/Requisition";
import useLang from "./../../hooks/useLanguage";

const PanelsCheckboxSelected = (props: any) => {
  const { t } = useLang();

  const [panelsArrToSend, setPanelsArrToSend] = useState<any>([]);
  useEffect(() => {
    setpanelsArrToSendForEdit();
  }, [props.panels]);
  const [openPanels, setOpenPanels] = useState(
    props?.panels.reduce((acc: any, panel: any) => {
      acc[panel.panelID] = false; // Initialize each panel as closed
      return acc;
    }, {})
  );
  const togglePanel = (panelId: any) => {
    setOpenPanels((prevState: any) => ({
      ...prevState,
      [panelId]: !prevState[panelId], // Toggle the specific panel
    }));
  };
  const togglePanelForChecked = (panelId: any) => {
    setOpenPanels((prevState: any) => ({
      ...prevState,
      [panelId]: true, // Toggle the specific panel
    }));
  };
  const togglePanelForUnChecked = (panelId: any) => {
    setOpenPanels((prevState: any) => ({
      ...prevState,
      [panelId]: false, // Toggle the specific panel
    }));
  };
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
    let PanelIdRemove;
    if (checked) {
      let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
      let ComorbiditiesPanelIndex = getComorbiditiesPanelsIndex(inputsCopy);
      if (specimenSourceIndex) {
        inputsCopy[specimenSourceIndex]?.fields?.forEach(
          (specimenSourceFields: any) => {
            specimenSourceFields?.specimenSources?.forEach(
              (panelsInfo: any) => {
                panelsInfo.isVisible = false;
              }
            );
          }
        );
      }
      if (ICDPanelIndex) {
        inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
          if (IcdPanelsFields.systemFieldName == "ICDPanels") {
            IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
              panelsInfo.isVisible = false; // Set all ICDPanels to false initially
            });
          }
        });
      }
      if (ComorbiditiesPanelIndex) {
        inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
          if (ComorbiditiesPanelsFields.systemFieldName == "ComorbidityPanels") {
            ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
              panelsInfo.isVisible = false; // Set all ComorbidityPanels to false initially
            });
          }
        });
      }

      // Now set the clicked ICD panel's visibility to true
      if (ICDPanelIndex) {
        inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
          if (IcdPanelsFields.systemFieldName == "ICDPanels") {
            IcdPanelsFields.defaultValue = ""
            IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = true; // Set clicked ICD panel to true
              }
            });
          }
        });
      }
      // Now set the clicked Comorbidity panel's visibility to true
      if (ComorbiditiesPanelIndex) {
        inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
          if (ComorbiditiesPanelsFields.systemFieldName == "ComorbidityPanels") {
            ComorbiditiesPanelsFields.defaultValue = ""
            ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = true; // Set clicked Comorbidity panel to true
              }
            });
          }
        });
      }
      //checking that only one parent checkbox is selected at same time
      inputsCopy[props.index]?.fields[props?.fieldIndex]?.panels?.forEach(
        (panel: any, i: number) => {
          if (i !== index) {
            panel.isSelected = false;
            PanelIdRemove = panel?.panelID;
            panel?.testOptions?.forEach((testOption: any) => {
              testOption.isSelected = false;
            });
          }
        }
      );
      if (PanelIdRemove) {
        let new_Vanished = panelsArrItemRemoval(
          PanelIdRemove,
          panelsArrToAppendCopy
        );
        let newInputs = assignFormValues(
          inputsCopy,
          // props?.dependenceyControls,
          props?.index,
          props?.depControlIndex,
          props?.fieldIndex,
          new_Vanished,
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
      //starting of specimen source
      if (specimenSourceIndex) {
        inputsCopy[specimenSourceIndex]?.fields?.forEach(
          (specimenSourceFields: any) => {
            specimenSourceFields?.specimenSources?.forEach(
              (panelsInfo: any) => {
                if (panelsInfo?.panelName === name) {
                  panelsInfo.isVisible = true;
                } else {
                  panelsInfo.isVisible = false;
                }
              }
            );
          }
        );
      }

      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].isSelected = true;
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].testOptions.forEach((testOptions: any) => {
        testOptions.isSelected = true;
      });
      let finalisedPanelsArrToSend = panelsArrMakerToSend(
        index,
        inputsCopy[props.index]?.fields[props?.fieldIndex]?.panels[index],
        panelsArrToAppendCopy,
        checked
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

    if (!checked) {
      togglePanelForUnChecked(panelID);
      let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
      let ComorbiditiesPanelIndex = getComorbiditiesPanelsIndex(inputsCopy);
      inputsCopy[specimenSourceIndex]?.fields.forEach(
        (specimenSourceFields: any) => {
          specimenSourceFields.specimenSources?.forEach((panelsInfo: any) => {
            if (panelsInfo.panelName === name) {
              panelsInfo.isVisible = false;
            }
          });
        }
      );
      if (ICDPanelIndex) {
        inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
          if (IcdPanelsFields.systemFieldName == "ICDPanels") {
            IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = false; // Set clicked ICD panel to false
              }
            });
          }
        });
      }
      if (ComorbiditiesPanelIndex) {
        inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
          if (ComorbiditiesPanelsFields.systemFieldName == "ComorbidityPanels") {
            ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = false; // Set clicked Comorbidity panel to false
              }
            });
          }
        });
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

  const handleChangeChild = (
    testID: string,
    checked: boolean,
    parentPanelName: string,
    index: number
  ) => {
    props.fields.enableRule = "";
    let PanelIdRemove;
    const name = parentPanelName;
    let inputsCopy = JSON.parse(JSON?.stringify(props?.Inputs));
    let panelsArrToAppendCopy = JSON.parse(JSON?.stringify(panelsArrToSend));
    let panelsCopy = [...props?.panels];
    if (checked) {
      let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
      let ComorbiditiesPanelIndex = getComorbiditiesPanelsIndex(inputsCopy);
      let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      inputsCopy[specimenSourceIndex]?.fields?.forEach(
        (specimenSourceFields: any) => {
          specimenSourceFields?.specimenSources?.forEach((panelsInfo: any) => {
            panelsInfo.isVisible = false;
          });
        }
      );
      if (ICDPanelIndex) {
        inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
          if (IcdPanelsFields.systemFieldName == "ICDPanels") {
            IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = false; // Set clicked ICD panel to true
              }
            });
          }
        });
      }
      if (ComorbiditiesPanelIndex) {
        inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
          if (ComorbiditiesPanelsFields.systemFieldName == "ComorbidityPanels") {
            ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = false; // Set clicked Comorbidity panel to false
              }
            });
          }
        });
      }

      if (ICDPanelIndex) {
        inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
          if (IcdPanelsFields.systemFieldName == "ICDPanels") {
            IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = true; // Set clicked ICD panel to true
              }
            });
          }
        });
      }
      if (ComorbiditiesPanelIndex) {
        inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
          if (ComorbiditiesPanelsFields.systemFieldName == "ComorbidityPanels") {
            ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == name) {
                panelsInfo.isVisible = true; // Set clicked Comorbidity panel to true
              }
            });
          }
        });
      } // Unchecking the child checkboxes with different panel name
      inputsCopy[props.index].fields[props?.fieldIndex].panels.forEach(
        (panel: any, i: number) => {
          if (i !== index && panel?.panelName !== parentPanelName) {
            PanelIdRemove = panel?.panelID;
            panel.testOptions.forEach((option: any) => {
              option.isSelected = false;
              inputsCopy[specimenSourceIndex]?.fields?.forEach(
                (specimenSourceFields: any) => {
                  specimenSourceFields?.specimenSources?.forEach(
                    (panelsInfo: any) => {
                      if (panelsInfo?.panelName !== parentPanelName) {
                        panelsInfo.isVisible = false;
                      }
                    }
                  );
                }
              );
            });
            // Uncheck the parent checkbox if all child checkboxes are unchecked
            panel.isSelected = false;
          }
        }
      );
      if (PanelIdRemove) {
        let new_Vanished = panelsArrItemRemoval(
          PanelIdRemove,
          panelsArrToAppendCopy
        );
        let newInputs = assignFormValues(
          inputsCopy,
          props?.index,
          props?.depControlIndex,
          props?.fieldIndex,
          new_Vanished,
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
      // Update child checkbox state
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].testOptions.forEach((i: any) => {
        if (i.testID === testID) {
          i.isSelected = checked;
        }
      });
      // Update parent checkbox state
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].isSelected = true;
      // Check if all child checkboxes in the parent panel are checked
      const allChildrenChecked = inputsCopy[props.index].fields[
        props?.fieldIndex
      ].panels[index].testOptions.every((option: any) => option.isSelected);
      // If all child checkboxes are checked, update parent panel visibility
      if (allChildrenChecked) {
        let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
        inputsCopy[specimenSourceIndex].fields.forEach(
          (specimenSourceFields: any) => {
            specimenSourceFields.specimenSources.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName === name) {
                panelsInfo.isVisible = true;
              }
            });
          }
        );
        inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
          if (IcdPanelsFields.systemFieldName == "ICDPanels") {
            IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName == parentPanelName) {
                panelsInfo.isVisible = true;
              } else {
                panelsInfo.isVisible = false;
              }
            });
          }
        });
        if (ComorbiditiesPanelIndex) {
          inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
            if (ComorbiditiesPanelsFields.systemFieldName == "ComorbidityPanels") {
              ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
                if (panelsInfo.panelName == parentPanelName) {
                  panelsInfo.isVisible = true;
                } else {
                  panelsInfo.isVisible = false;
                }
              });
            }
          });
        }
      }
      // Update panelsArrToSend state
      let finalisedPanelsArrToSend = panelsArrItemAddChild(
        index,
        parentPanelName,
        [
          inputsCopy[props.index].fields[props?.fieldIndex].panels[
            index
          ].testOptions.forEach((option: any) => {
            return option;
          }),
        ],
        panelsArrToAppendCopy,
        panelsCopy
      );
      setPanelsArrToSend(finalisedPanelsArrToSend);
    } else {
      // Uncheck the child checkbox
      inputsCopy[props.index].fields[props?.fieldIndex].panels[
        index
      ].testOptions.forEach((option: any) => {
        if (option.testID === testID) {
          option.isSelected = false;
        }
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
        // Update parent panel visibility
        let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);

        inputsCopy[specimenSourceIndex].fields.forEach(
          (specimenSourceFields: any) => {
            specimenSourceFields.specimenSources.forEach((panelsInfo: any) => {
              if (panelsInfo.panelName === parentPanelName) {
                panelsInfo.isVisible = false;
              }
            });
          }
        );
        let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
        let ComorbiditiesPanelIndex = getComorbiditiesPanelsIndex(inputsCopy);
        if (ICDPanelIndex) {
          inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
            if (IcdPanelsFields.systemFieldName == "ICDPanels") {
              IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
                if (panelsInfo.panelName == name) {
                  panelsInfo.isVisible = false; // Set clicked ICD panel to true
                }
              });
            }
          });
        }
        if (ComorbiditiesPanelIndex) {
          inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
            if (ComorbiditiesPanelsFields.systemFieldName == "ComorbidityPanels") {
              ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
                if (panelsInfo.panelName == name) {
                  panelsInfo.isVisible = false; // Set clicked Comorbidity panel to false
                }
              });
            }
          });
        }
      }
      // Update panelsArrToSend state
      let finalisedPanelsArrToSend = panelsArrItemRemovalChild(
        index,
        testID,
        panelsArrToAppendCopy
      );
      setPanelsArrToSend(finalisedPanelsArrToSend);
    }

    // Update inputs and infectiousData states
    let newInputs = assignFormValues(
      inputsCopy,
      props?.index,
      props?.depControlIndex,
      props?.fieldIndex,
      panelsArrToAppendCopy,
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
    filteredPanelsCopy?.forEach((panelData: any) => {
      setOpenPanels((prevState: any) => ({
        ...prevState,
        [panelData.panelID]: true, // Toggle the specific panel
      }));
    });
    let inputsCopy = [...props?.Inputs];
    let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
    inputsCopy[specimenSourceIndex]?.fields?.forEach(
      (specimenSourceFields: any) => {
        specimenSourceFields?.specimenSources?.forEach((panelsInfo: any) => {
          if (panelNameArr?.includes(panelsInfo.panelName)) {
            panelsInfo.isVisible = true;
          }
        });
      }
    );
    let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
    inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
      if (IcdPanelsFields.systemFieldName == "ICDPanels") {
        IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
          if (panelNameArr?.includes(panelsInfo.panelName)) {
            panelsInfo.isVisible = true;
          }
        });
      }
    });
    let ComorbiditiesPanelIndex = getComorbiditiesPanelsIndex(inputsCopy);
    if (ComorbiditiesPanelIndex) {
      inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
        if (ComorbiditiesPanelsFields.systemFieldName == "ComorbidityPanels") {
          ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
            if (panelNameArr?.includes(panelsInfo.panelName)) {
              panelsInfo.isVisible = true;
            }
          });
        }
      });
    }

    assignFormValues(
      inputsCopy,
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

  const groupTestsByType = (testOptions: any[]) => {
    if (!testOptions || testOptions.length === 0) return [];

    const grouped = [];
    const typeMap = new Map(); // To track already encountered typeOfTest

    for (const test of testOptions) {
      const type = test.typeOfTest;

      // If the typeOfTest has already been encountered, add the test to its group
      if (typeMap.has(type)) {
        const groupIndex = typeMap.get(type);
        grouped[groupIndex].tests.push(test);
      } else {
        // If the typeOfTest is new, create a new group
        typeMap.set(type, grouped.length); // Store the index of the new group
        grouped.push({ typeOfTest: type, tests: [test] });
      }
    }
    return grouped;
  };
  return (
    <>
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
                    <div
                      className="card-header bg-light d-flex justify-content-between align-items-center rounded min-h-35px px-4"
                      onClick={() => togglePanel(options?.panelID)}
                    >
                      <div className="col-12">
                        <label className="form-check form-check-sm form-check-solid col-12">
                          <input
                            className="form-check-input mr-2 h-20px w-20px"
                            type="checkbox"
                            checked={options?.isSelected}
                            onClick={(e) => e.stopPropagation()}
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

                    {/* <div className="card-body py-md-4 py-3 col-12">
                      <div className="row">
                        {options?.testOptions?.map(
                          (optionsChild: any, childIndex: any) => (
                            <>
                              <div className="fw-bold mb-3">
                                {optionsChild.typeOfTest}
                              </div>

                              <div
                                className={
                                  props.ArrayReqId === 38
                                    ? "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
                                    : "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
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
                                      options?.isSelected &&
                                      optionsChild?.isSelected
                                    }
                                  />
                                  <span className="fw-400">
                                    {optionsChild?.testName}
                                  </span>
                                </label>
                              </div>
                              <div className="row">
                                {group.tests.map(
                                  (optionsChild: any, childIndex: any) => (
                                    <div
                                      key={childIndex}
                                      className={
                                        props.ArrayReqId === 38
                                          ? "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
                                          : "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
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
                                              index
                                            );
                                          }}
                                          checked={
                                            options?.isSelected &&
                                            optionsChild?.isSelected
                                          }
                                        />
                                        <span className="fw-400">
                                          {optionsChild?.testName}
                                        </span>
                                      </label>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div> */}
                    <div className="card-body py-md-4 py-3 col-12">
                      <div className="row">
                        {groupTestsByType(options?.testOptions)?.map(
                          (group: any, groupIndex: any) => (
                            <div key={groupIndex} className="col-12">
                              <div className="fw-bold mb-3">
                                {group.typeOfTest}
                              </div>
                              <div className="row">
                                {group.tests.map(
                                  (optionsChild: any, childIndex: any) => (
                                    <div
                                      key={childIndex}
                                      className={
                                        props.ArrayReqId === 38
                                          ? "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
                                          : "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
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
                                              index
                                            );
                                          }}
                                          checked={
                                            options?.isSelected &&
                                            optionsChild?.isSelected
                                          }
                                        />
                                        <span className="fw-400">
                                          {optionsChild?.testName}
                                        </span>
                                      </label>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
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
    </>
  );
};

export default PanelsCheckboxSelected;
