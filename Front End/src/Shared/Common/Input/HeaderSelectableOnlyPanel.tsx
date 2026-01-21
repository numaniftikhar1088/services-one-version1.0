import { useEffect, useRef, useState } from 'react';
import { assignFormValues } from '../../../Utils/Auth';
import {
  getICDPanelsIndex,
  getComorbiditiesPanelsIndex,
  getSpecimenSourceIndex,
  panelsArrItemRemoval,
  panelsArrMakerToSend,
} from '../../../Utils/Common/Requisition';
import useLang from './../../hooks/useLanguage';
import PanelNamesModal from './PanelNamesModal';
import Collapse from '@mui/material/Collapse';
const HeaderSelectableOnlyPanel = (props: any) => {
  // Track the open/close state of each panel
  const [openPanels, setOpenPanels] = useState(
    props?.panels.reduce((acc: any, panel: any) => {
      acc[panel.panelID] = false; // Initialize each panel as closed
      return acc;
    }, {})
  );
  // Toggle the panel's state (open/close)
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
  const { t } = useLang();
  const [panelsArrToSend, setPanelsArrToSend] = useState<any>([]);
  useEffect(() => {
    setpanelsArrToSendForEdit();
  }, [props.panels]);

  function FindIndex(arr: any[], rid: any) {
    return arr.findIndex((i: any) => i.reqId === rid);
  }
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [panelNames, setPanelNames] = useState([]); // State to store the panel names

  const handleShowModal = (panelNames: any) => {
    setPanelNames(panelNames); // Set panel names when showing modal
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };
  const handleChangeParent = (
    panelID: any,
    panelName: string,
    checked: boolean,
    index: number
  ) => {
    props.fields.enableRule = '';
    const name = panelName;
    let panelsArrToAppendCopy = [...panelsArrToSend];
    let inputsCopy = JSON?.parse(JSON?.stringify(props?.Inputs));
    let PanelIdRemove;
    props.Inputs[props.index].fields[props?.fieldIndex].panels[
      index
    ].isSelected = true;
    props.Inputs[props.index].fields[props?.fieldIndex].panels[
      index
    ].testOptions.forEach((testOptions: any) => {
      testOptions.isSelected = true;
    });
    if (props.panelCombinations.length == 0) {
      if (checked) {
        togglePanelForChecked(panelID);
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
        const updatedInputValueForSpecimen =
          props?.inputValueForSpecimen?.filter(
            (option: any) => option.panelID !== panelID.toString()
          );
        props.setInputValueForSpecimen(
          updatedInputValueForSpecimen
        );
        // if (ICDPanelIndex) {
        //   inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
        //     if (IcdPanelsFields.systemFieldName == 'ICDPanels') {
        //       IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
        //         panelsInfo.isVisible = false; // Set all ICDPanels to false initially
        //       });
        //     }
        //   });
        // }
        // if (ComorbiditiesPanelIndex) {
        //   inputsCopy[ComorbiditiesPanelIndex]?.fields?.forEach((ComorbiditiesPanelsFields: any) => {
        //     if (ComorbiditiesPanelsFields.systemFieldName == 'ComorbidityPanels') {
        //       ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
        //         panelsInfo.isVisible = false; // Set all ComorbidityPanels to false initially
        //       });
        //     }
        //   });
        // }
        // Now set the clicked ICD panel's visibility to true
        if (ICDPanelIndex) {
          inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
            if (IcdPanelsFields.systemFieldName == 'ICDPanels') {
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
            if (ComorbiditiesPanelsFields.systemFieldName == 'ComorbidityPanels') {
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
          newInputs?.then(res => {
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
        newInputs?.then(res => {
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
            if (IcdPanelsFields.systemFieldName == 'ICDPanels') {
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
            if (ComorbiditiesPanelsFields.systemFieldName == 'ComorbidityPanels') {
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
        newInputs?.then(res => {
          let infectiousDataCopy = JSON?.parse(
            JSON?.stringify(props?.infectiousData)
          );
          infectiousDataCopy[
            FindIndex(props?.infectiousData, props?.ArrayReqId)
          ].sections = res;
          props?.setInfectiousData([...infectiousDataCopy]);
        });
      }
    } else {
      if (checked) {
        togglePanelForChecked(panelID);
        // Step 1: Handle panel selection logic
        let ICDPanelIndex = getICDPanelsIndex(props?.Inputs);
        let ComorbiditiesPanelIndex = getComorbiditiesPanelsIndex(props?.Inputs);
        let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
        props.Inputs[props.index].fields[props?.fieldIndex].panels[
          index
        ].isSelected = true;
        props.Inputs[props.index].fields[props?.fieldIndex].panels[
          index
        ].testOptions.forEach((testOptions: any) => {
          testOptions.isSelected = true;
        });
        // Step 2: Make ICD Panels & specimen source visible if applicable
        if (ICDPanelIndex) {
          props.Inputs[ICDPanelIndex]?.fields?.forEach(
            (IcdPanelsFields: any) => {
              if (IcdPanelsFields.systemFieldName == 'ICDPanels') {
                IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
                  if (panelsInfo.panelName == name) {
                    panelsInfo.isVisible = true;
                  }
                });
              }
            }
          );
        }
        if (ComorbiditiesPanelIndex) {
          props.Inputs[ComorbiditiesPanelIndex]?.fields?.forEach(
            (ComorbiditiesPanelsFields: any) => {
              if (ComorbiditiesPanelsFields.systemFieldName == 'ComorbidityPanels') {
                ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
                  if (panelsInfo.panelName == name) {
                    panelsInfo.isVisible = true;
                  }
                });
              }
            }
          );
        }
        if (specimenSourceIndex) {
          props.Inputs[specimenSourceIndex]?.fields?.forEach(
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

        // Step 3: Validate panel combination if more than one panel is selected
        const selectedPanels = props.Inputs[props.index].fields[
          props?.fieldIndex
        ].panels.filter((panel: any) => panel.isSelected);

        if (selectedPanels.length > 1) {
          const selectedPanelIDs = selectedPanels.map((panel: any) =>
            parseInt(panel.panelID)
          );
          const allComboPanelIDArrays: any[] = [];
          // Push each parsed panel combination array into allComboPanelIDArrays
          props.panelCombinations.some((combo: any) => {
            const comboPanelIDArrays = JSON.parse(combo.panelCombinationJson);
            allComboPanelIDArrays.push(comboPanelIDArrays);
          });
          // Check if selectedPanelIDs are fully contained in any of the combo arrays
          const isValid = allComboPanelIDArrays.some(
            (comboPanelIDArray: any[]) => {
              const panelIds = comboPanelIDArray.map(
                (panel: any) => panel.PanelId
              );
              return selectedPanelIDs.every((id: any) => panelIds.includes(id));
            }
          );
          // Return true if valid combination is found, otherwise false
          if (!isValid) {
            props.Inputs[props.index].fields[props?.fieldIndex].panels[
              index
            ].isSelected = false;
            props.Inputs[props.index].fields[props?.fieldIndex].panels[
              index
            ].testOptions.forEach((testOptions: any) => {
              testOptions.isSelected = false;
            });
            if (specimenSourceIndex) {
              props.Inputs[specimenSourceIndex]?.fields?.forEach(
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
            if (ICDPanelIndex) {
              props.Inputs[ICDPanelIndex]?.fields?.forEach(
                (IcdPanelsFields: any) => {
                  if (IcdPanelsFields.systemFieldName == 'ICDPanels') {
                    IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
                      if (panelsInfo.panelName == name) {
                        panelsInfo.isVisible = false;
                      }
                    });
                  }
                }
              );
            }
            if (ComorbiditiesPanelIndex) {
              props.Inputs[ComorbiditiesPanelIndex]?.fields?.forEach(
                (ComorbiditiesPanelsFields: any) => {
                  if (ComorbiditiesPanelsFields.systemFieldName == 'ComorbidityPanels') {
                    ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
                      if (panelsInfo.panelName == name) {
                        panelsInfo.isVisible = false;
                      }
                    });
                  }
                }
              );
            }
            const updatedSelectedPanelIDs = selectedPanelIDs.filter(
              (id: any) => id !== parseInt(panelID)
            );
            let matchingArray = findMatchingArrays(
              updatedSelectedPanelIDs,
              allComboPanelIDArrays
            );
            console.log(matchingArray, 'matchingArray');
            handleShowModal(matchingArray);
            return;
          }
        }
        // Step 4: Update state with valid selection
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
        newInputs?.then(res => {
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
        if (specimenSourceIndex) {
          props?.Inputs[specimenSourceIndex]?.fields.forEach(
            (specimenSourceFields: any) => {
              specimenSourceFields.specimenSources?.forEach(
                (panelsInfo: any) => {
                  if (panelsInfo.panelName === name) {
                    panelsInfo.isVisible = false;
                    panelsInfo.isSelected = false;
                    panelsInfo?.specimenSourceOption?.map((option: any) => {
                      option.isSelected = false;
                    });
                    const updatedInputValueForSpecimen =
                      props?.inputValueForSpecimen?.filter(
                        (option: any) => option.panelID !== panelID.toString()
                      );
                    props.setInputValueForSpecimen(
                      updatedInputValueForSpecimen
                    );
                  }
                }
              );
            }
          );
        }
        if (ICDPanelIndex) {
          props?.Inputs[ICDPanelIndex]?.fields?.forEach(
            (IcdPanelsFields: any) => {
              if (IcdPanelsFields.systemFieldName == 'ICDPanels') {
                IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
                  if (panelsInfo.panelName == name) {
                    panelsInfo.isVisible = false;
                    panelsInfo.isSelected = false;
                  }
                });
              }
            }
          );
        }
        if (ComorbiditiesPanelIndex) {
          props?.Inputs[ComorbiditiesPanelIndex]?.fields?.forEach(
            (ComorbiditiesPanelsFields: any) => {
              if (ComorbiditiesPanelsFields.systemFieldName == 'ComorbidityPanels') {
                ComorbiditiesPanelsFields?.panels?.forEach((panelsInfo: any) => {
                  if (panelsInfo.panelName == name) {
                    panelsInfo.isVisible = false;
                    panelsInfo.isSelected = false;
                  }
                });
              }
            }
          );
        }
        props.Inputs[props.index].fields[props?.fieldIndex].panels[
          index
        ].isSelected = false;
        props.Inputs[props.index].fields[props?.fieldIndex].panels[
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
          props.Inputs,
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
        newInputs?.then(res => {
          let infectiousDataCopy = JSON?.parse(
            JSON?.stringify(props?.infectiousData)
          );
          infectiousDataCopy[
            FindIndex(props?.infectiousData, props?.ArrayReqId)
          ].sections = res;
          props?.setInfectiousData([...infectiousDataCopy]);
        });
      }
    }
  };
  function findMatchingArrays(
    selectedIDs: number[],
    allComboPanelIDArrays: any[][]
  ): any[][] {
    const matchingArrays: any[][] = []; // To store all matching combinations
    for (let comboArray of allComboPanelIDArrays) {
      // Extract all PanelIds from the current array
      const panelIDs = comboArray.map((panel: any) => panel.PanelId);
      // Check if all selectedIDs are present in panelIDs
      if (selectedIDs.every(id => panelIDs.includes(id))) {
        matchingArrays.push(comboArray); // Push the array if it's a subset match
      }
    }

    return matchingArrays;
  }

  const setpanelsArrToSendForEdit = () => {
    let panelsCopy = [...props?.panels];
    let filteredPanelsCopy = panelsCopy?.filter(
      (panelsData: any) => panelsData?.isSelected
    );
    filteredPanelsCopy?.forEach((panelData: any) => {
      setOpenPanels((prevState: any) => ({
        ...prevState,
        [panelData.panelID]: true, // Toggle the specific panel
      }));
    });

    let panelNameArr: any = [];
    filteredPanelsCopy?.forEach((panelData: any) => {
      panelNameArr?.push(panelData?.panelName);
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
      if (IcdPanelsFields.systemFieldName == 'ICDPanels') {
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
        if (ComorbiditiesPanelsFields.systemFieldName == 'ComorbidityPanels') {
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
        behavior: 'smooth',
        block: 'start',
      });
    }
    props.setErrorFocussedInput && props.setErrorFocussedInput();
  }, [props?.errorFocussedInput]);

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
                        <div className="form-check form-check-sm form-check-solid col-12">
                          <input
                            className="form-check-input mr-2 h-20px w-20px"
                            type="checkbox"
                            checked={options?.isSelected}
                            onClick={e => e.stopPropagation()} // Prevent header clicks from toggling the checkbox
                            onChange={(e: any) => {
                              handleChangeParent(
                                options?.panelID,
                                options?.panelName,
                                e.target.checked,
                                index
                              );
                            }}
                          />
                          <label className="fw-600">{options?.panelName}</label>
                        </div>
                      </div>
                    </div>

                    <Collapse
                      in={openPanels[options?.panelID]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <div className="card-body py-md-4 py-3 col-12">
                        <div className="row">
                          {Object.entries(
                            options?.testOptions?.reduce(
                              (acc: any, optionsChild: any) => {
                                const { typeOfTest } = optionsChild;
                                if (typeOfTest) {
                                  // Only add to the group if typeOfTest is truthy
                                  if (!acc[typeOfTest]) {
                                    acc[typeOfTest] = []; // Create a new array for each typeOfTest
                                  }
                                  acc[typeOfTest].push(optionsChild); // Add the current test under its typeOfTest category
                                } else {
                                  // Handle null or undefined typeOfTest: put it in a special category
                                  if (!acc['No Type']) {
                                    acc['No Type'] = [];
                                  }
                                  acc['No Type'].push(optionsChild);
                                }
                                return acc;
                              },
                              {}
                            )
                          )
                            // Sort the keys (typeOfTest) alphabetically
                            //  .sort(([a], [b]) => a.localeCompare(b)) // Sort alphabetically
                            .map(([typeOfTest, tests]: any, index: any) => (
                              <div key={index}>
                                {/* Display typeOfTest header only if it's not "No Type" */}
                                {typeOfTest && typeOfTest !== 'No Type' && (
                                  <div className="fw-bold mb-3">
                                    {typeOfTest}
                                  </div>
                                )}

                                {/* Loop through the tests for this typeOfTest */}
                                <div className="row">
                                  {tests.map(
                                    (optionsChild: any, childIndex: any) => (
                                      <div
                                        key={childIndex}
                                        className={
                                          tests.length > 1
                                            ? 'mb-3 col-xl-4 col-lg-4 col-md-4 col-sm-6'
                                            : 'col-xl-12 col-lg-12 col-md-12 col-sm-12'
                                        }
                                      >
                                        <label className="form-check form-check-sm align-items-start form-check-solid col-12">
                                          <span className="fw-400">
                                            {optionsChild?.testName}
                                          </span>
                                        </label>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </Collapse>
                  </div>

                  <PanelNamesModal
                    panelNames={panelNames}
                    showModal={showModal}
                    handleClose={handleCloseModal}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ))}
    </>
  );
};

export default HeaderSelectableOnlyPanel;
