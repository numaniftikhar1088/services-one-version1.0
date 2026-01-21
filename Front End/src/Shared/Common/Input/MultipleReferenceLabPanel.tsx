import { useEffect, useRef, useState } from "react";
import { assignFormValues } from "../../../Utils/Auth";
import {
  getICDPanelsIndex,
  getSpecimenSourceIndex,
  panelsArrItemRemoval,
  panelsArrMakerToSend,
} from "../../../Utils/Common/Requisition";
import useLang from "./../../hooks/useLanguage";
import PanelNamesModal from "./PanelNamesModal";
import Collapse from "@mui/material/Collapse";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
const MultipleReferenceLabPanel = (props: any) => {
  const params = new URLSearchParams(window.location.search);
  const workflowId = params.get("workflowId");
  const location = useLocation()
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
    if (!location?.state?.reqId) return;
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
    referenceLabName: string
  ) => {
    props.fields.enableRule = "";
    const name = panelName;
    let panelsArrToAppendCopy = [...panelsArrToSend];
    let inputsCopy = JSON?.parse(JSON?.stringify(props?.Inputs));
    let PanelIdRemove;
    if (props.panelCombinations.length == 0) {
      if (checked) {
        togglePanelForChecked(panelID);
        let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
        let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
        const panelIndex = props.Inputs[props.index].fields[
          props.fieldIndex
        ].panels.findIndex(
          (panel: any) =>
            panel.panelID === panelID &&
            panel.referenceLabName === referenceLabName
        );
        if (specimenSourceIndex) {
          inputsCopy[specimenSourceIndex]?.fields?.forEach(
            (specimenSourceFields: any) => {
              if (specimenSourceFields.systemFieldName === "SpecimenSource") {
                specimenSourceFields.defaultValue = [];
                specimenSourceFields?.specimenSources?.forEach(
                  (panelsInfo: any) => {
                    panelsInfo.isVisible = false;
                    panelsInfo.specimenSourceOption.map((i: any) => {
                      i.isSelected = false;
                    });
                  }
                );
              }
            }
          );
          props.setInputValueForSpecimen([]);
        }

        // Only remove ICD-10 panels if workflowId is not present
        if (ICDPanelIndex && !workflowId) {
          inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
            if (IcdPanelsFields.systemFieldName == "ICDPanels") {
              IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
                panelsInfo.isVisible = false;
                panelsInfo.testOptions.forEach((i: any) => {
                  i.isSelected = false;
                });
              });
            }
          });
          inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
            if (IcdPanelsFields.systemFieldName == "ICDPanels") {
              IcdPanelsFields.defaultValue = [];
            }
          });
        }

        // Now set the clicked ICD panel's visibility to true
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
        //checking that only one parent checkbox is selected at same time
        inputsCopy[props.index]?.fields[props?.fieldIndex]?.panels?.forEach(
          (panel: any, i: number) => {
            if (i !== panelIndex) {
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
          panelIndex
        ].isSelected = true;
        inputsCopy[props.index].fields[props?.fieldIndex].panels[
          panelIndex
        ].testOptions.forEach((testOptions: any) => {
          testOptions.isSelected = true;
        });
        let finalisedPanelsArrToSend = panelsArrMakerToSend(
          panelIndex,
          inputsCopy[props.index]?.fields[props?.fieldIndex]?.panels[
          panelIndex
          ],
          panelsArrToAppendCopy,
          checked
        );
        const filtered = finalisedPanelsArrToSend.filter((panel: any) => panel.panelID === panelID);
        finalisedPanelsArrToSend = filtered.length
          ? [filtered[filtered.length - 1]]
          : [];
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
        const panelIndex = props.Inputs[props.index].fields[
          props.fieldIndex
        ].panels.findIndex(
          (panel: any) =>
            panel.panelID === panelID &&
            panel.referenceLabName === referenceLabName
        );
        togglePanelForUnChecked(panelID);
        let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
        let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
        if (specimenSourceIndex) {
          inputsCopy[specimenSourceIndex]?.fields?.forEach(
            (specimenSourceFields: any) => {
              if (specimenSourceFields.systemFieldName === "SpecimenSource") {
                specimenSourceFields.defaultValue = Array.isArray(
                  specimenSourceFields.defaultValue
                )
                  ? specimenSourceFields.defaultValue.filter(
                    (i: any) => parseInt(i.panelID) !== parseInt(panelID)
                  )
                  : [];

                // rest of your code remains unchanged
                specimenSourceFields?.specimenSources?.forEach(
                  (panelsInfo: any) => {
                    if (
                      panelsInfo?.panelName === name &&
                      panelsInfo.panelID === panelID
                    ) {
                      panelsInfo.isVisible = false;
                      panelsInfo.specimenSourceOption.map((i: any) => {
                        i.isSelected = false;
                      });
                    }
                  }
                );
              }
            }
          );
          let updated = props.inputValueForSpecimen.filter(
            (item: any) => parseInt(item.panelID) != parseInt(panelID)
          );
          props.setInputValueForSpecimen(updated);
        }
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
        inputsCopy[props.index].fields[props?.fieldIndex].panels[
          panelIndex
        ].isSelected = false;
        inputsCopy[props.index].fields[props?.fieldIndex].panels[
          panelIndex
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

      // if (checked) {
      //   togglePanelForChecked(panelID);
      //   let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      //   let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
      //   const panelIndex = props.Inputs[props.index].fields[
      //     props.fieldIndex
      //   ].panels.findIndex(
      //     (panel: any) =>
      //       panel.panelID === panelID &&
      //       panel.referenceLabName === referenceLabName
      //   );
      //   const selectedPanels = props.Inputs[props.index].fields[
      //     props?.fieldIndex
      //   ].panels.filter((panel: any) => panel.isSelected);
      //   if (!selectedPanels.length) {
      //     if (specimenSourceIndex) {
      //       inputsCopy[specimenSourceIndex]?.fields?.forEach(
      //         (specimenSourceFields: any) => {
      //           specimenSourceFields?.specimenSources?.forEach(
      //             (panelsInfo: any) => {
      //               if (
      //                 panelsInfo?.panelName === name &&
      //                 panelsInfo.panelID === panelID
      //               ) {
      //                 panelsInfo.isVisible = true;
      //               }
      //             }
      //           );
      //         }
      //       );
      //     }
      //     if (ICDPanelIndex) {
      //       inputsCopy[ICDPanelIndex]?.fields?.forEach(
      //         (IcdPanelsFields: any) => {
      //           if (IcdPanelsFields.systemFieldName == "ICDPanels") {
      //             IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
      //               if (panelsInfo.panelName == name) {
      //                 panelsInfo.isVisible = true; // Set clicked ICD panel to true
      //               }
      //             });
      //           }
      //         }
      //       );
      //     }
      //     inputsCopy[props.index].fields[props?.fieldIndex].panels[
      //       panelIndex
      //     ].isSelected = true;
      //     inputsCopy[props.index].fields[props?.fieldIndex].panels[
      //       panelIndex
      //     ].testOptions.forEach((testOptions: any) => {
      //       testOptions.isSelected = true;
      //     });
      //     let finalisedPanelsArrToSend = panelsArrMakerToSend(
      //       panelIndex,
      //       inputsCopy[props.index]?.fields[props?.fieldIndex]?.panels[
      //         panelIndex
      //       ],
      //       panelsArrToAppendCopy,
      //       checked
      //     );
      //     setPanelsArrToSend(finalisedPanelsArrToSend);
      //     let newInputs = assignFormValues(
      //       inputsCopy,
      //       props?.index,
      //       props?.depControlIndex,
      //       props?.fieldIndex,
      //       finalisedPanelsArrToSend,
      //       props?.isDependency,
      //       props?.repeatFieldSection,
      //       props?.isDependencyRepeatFields,
      //       props?.repeatFieldIndex,
      //       props?.repeatDependencySectionIndex,
      //       props?.repeatDepFieldIndex,
      //       undefined,
      //       props?.setInputs
      //     );
      //     newInputs?.then((res) => {
      //       let infectiousDataCopy = JSON?.parse(
      //         JSON?.stringify(props?.infectiousData)
      //       );
      //       infectiousDataCopy[
      //         FindIndex(props?.infectiousData, props?.ArrayReqId)
      //       ].sections = res;
      //       props?.setInfectiousData([...infectiousDataCopy]);
      //     });
      //   }

      //   if (selectedPanels.length) {
      //     if (
      //       inputsCopy[props.index].fields[props?.fieldIndex].panels[panelIndex]
      //         .referenceLabId === selectedPanels[0].referenceLabId
      //     ) {
      //       if (specimenSourceIndex) {
      //         inputsCopy[specimenSourceIndex]?.fields?.forEach(
      //           (specimenSourceFields: any) => {
      //             specimenSourceFields?.specimenSources?.forEach(
      //               (panelsInfo: any) => {
      //                 if (
      //                   panelsInfo?.panelName === name &&
      //                   panelsInfo.panelID === panelID
      //                 ) {
      //                   panelsInfo.isVisible = true;
      //                 }
      //               }
      //             );
      //           }
      //         );
      //       }
      //       if (ICDPanelIndex) {
      //         inputsCopy[ICDPanelIndex]?.fields?.forEach(
      //           (IcdPanelsFields: any) => {
      //             if (IcdPanelsFields.systemFieldName == "ICDPanels") {
      //               IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
      //                 if (panelsInfo.panelName == name) {
      //                   panelsInfo.isVisible = true; // Set clicked ICD panel to true
      //                 }
      //               });
      //             }
      //           }
      //         );
      //       }
      //       inputsCopy[props.index].fields[props?.fieldIndex].panels[
      //         panelIndex
      //       ].isSelected = true;
      //       inputsCopy[props.index].fields[props?.fieldIndex].panels[
      //         panelIndex
      //       ].testOptions.forEach((testOptions: any) => {
      //         testOptions.isSelected = true;
      //       });
      //       let finalisedPanelsArrToSend = panelsArrMakerToSend(
      //         panelIndex,
      //         inputsCopy[props.index]?.fields[props?.fieldIndex]?.panels[
      //           panelIndex
      //         ],
      //         panelsArrToAppendCopy,
      //         checked
      //       );
      //       setPanelsArrToSend(finalisedPanelsArrToSend);
      //       let newInputs = assignFormValues(
      //         inputsCopy,
      //         props?.index,
      //         props?.depControlIndex,
      //         props?.fieldIndex,
      //         finalisedPanelsArrToSend,
      //         props?.isDependency,
      //         props?.repeatFieldSection,
      //         props?.isDependencyRepeatFields,
      //         props?.repeatFieldIndex,
      //         props?.repeatDependencySectionIndex,
      //         props?.repeatDepFieldIndex,
      //         undefined,
      //         props?.setInputs
      //       );
      //       newInputs?.then((res) => {
      //         let infectiousDataCopy = JSON?.parse(
      //           JSON?.stringify(props?.infectiousData)
      //         );
      //         infectiousDataCopy[
      //           FindIndex(props?.infectiousData, props?.ArrayReqId)
      //         ].sections = res;
      //         props?.setInfectiousData([...infectiousDataCopy]);
      //       });
      //     } else {
      //       toast.error("Select Panel from same reference lab");
      //       return;
      //     }
      //   }
      // }
      // if (!checked) {
      //   const panelIndex = props.Inputs[props.index].fields[
      //     props.fieldIndex
      //   ].panels.findIndex(
      //     (panel: any) =>
      //       panel.panelID === panelID &&
      //       panel.referenceLabName === referenceLabName
      //   );
      //   togglePanelForUnChecked(panelID);
      //   let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      //   let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
      //   // if (specimenSourceIndex) {
      //   //   inputsCopy[specimenSourceIndex]?.fields?.forEach(
      //   //     (specimenSourceFields: any) => {
      //   //       if (specimenSourceFields.systemFieldName === "SpecimenSource") {
      //   //         specimenSourceFields.defaultValue = Array.isArray(
      //   //           specimenSourceFields.defaultValue
      //   //         )
      //   //           ? specimenSourceFields.defaultValue.filter(
      //   //               (i: any) => parseInt(i.panelID) !== parseInt(panelID)
      //   //             )
      //   //           : [];

      //   //         // rest of your code remains unchanged
      //   //         specimenSourceFields?.specimenSources?.forEach(
      //   //           (panelsInfo: any) => {
      //   //             if (
      //   //               panelsInfo?.panelName === name &&
      //   //               panelsInfo.panelID === panelID
      //   //             ) {
      //   //               panelsInfo.isVisible = false;
      //   //               panelsInfo.specimenSourceOption.map((i: any) => {
      //   //                 i.isSelected = false;
      //   //               });
      //   //             }
      //   //           }
      //   //         );
      //   //       }
      //   //     }
      //   //   );
      //   //   let updated = props.inputValueForSpecimen.filter(
      //   //     (item: any) => parseInt(item.panelID) != parseInt(panelID)
      //   //   );
      //   //   props.setInputValueForSpecimen(updated);
      //   // }
      //   if (specimenSourceIndex) {
      //     inputsCopy[specimenSourceIndex]?.fields?.forEach(
      //       (specimenSourceFields: any) => {
      //         if (specimenSourceFields.systemFieldName === "SpecimenSource") {
      //           // Ensure defaultValue is always an array before using .filter()
      //           const defaultValueArray = Array.isArray(
      //             specimenSourceFields.defaultValue
      //           )
      //             ? specimenSourceFields.defaultValue
      //             : [];

      //           specimenSourceFields.defaultValue = defaultValueArray.filter(
      //             (i: any) => parseInt(i.panelID) !== parseInt(panelID)
      //           );

      //           // Safely iterate over specimenSources
      //           specimenSourceFields?.specimenSources?.forEach(
      //             (panelsInfo: any) => {
      //               if (
      //                 panelsInfo?.panelName === name &&
      //                 panelsInfo.panelID === panelID
      //               ) {
      //                 panelsInfo.isVisible = false;
      //                 panelsInfo.specimenSourceOption?.forEach((i: any) => {
      //                   i.isSelected = false;
      //                 });
      //               }
      //             }
      //           );
      //         }
      //       }
      //     );

      //     let updated = props.inputValueForSpecimen.filter(
      //       (item: any) => parseInt(item.panelID) != parseInt(panelID)
      //     );
      //     props.setInputValueForSpecimen(updated);
      //   }

      //   if (ICDPanelIndex) {
      //     inputsCopy[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
      //       if (IcdPanelsFields.systemFieldName == "ICDPanels") {
      //         IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
      //           if (panelsInfo.panelName == name) {
      //             panelsInfo.isVisible = false; // Set clicked ICD panel to false
      //           }
      //         });
      //       }
      //     });
      //   }
      //   inputsCopy[props.index].fields[props?.fieldIndex].panels[
      //     panelIndex
      //   ].isSelected = false;
      //   inputsCopy[props.index].fields[props?.fieldIndex].panels[
      //     panelIndex
      //   ].testOptions.forEach((testOptions: any) => {
      //     testOptions.isSelected = false;
      //   });
      //   let finalisedPanelsArrToSend = panelsArrItemRemoval(
      //     panelID,
      //     panelsArrToAppendCopy
      //   );
      //   setPanelsArrToSend(finalisedPanelsArrToSend);
      //   let newInputs = assignFormValues(
      //     inputsCopy,
      //     props?.index,
      //     props?.depControlIndex,
      //     props?.fieldIndex,
      //     finalisedPanelsArrToSend,
      //     props?.isDependency,
      //     props?.repeatFieldSection,
      //     props?.isDependencyRepeatFields,
      //     props?.repeatFieldIndex,
      //     props?.repeatDependencySectionIndex,
      //     props?.repeatDepFieldIndex,
      //     undefined,
      //     props?.setInputs
      //   );
      //   newInputs?.then((res) => {
      //     let infectiousDataCopy = JSON?.parse(
      //       JSON?.stringify(props?.infectiousData)
      //     );
      //     infectiousDataCopy[
      //       FindIndex(props?.infectiousData, props?.ArrayReqId)
      //     ].sections = res;
      //     props?.setInfectiousData([...infectiousDataCopy]);
      //   });
      // }
    } else {
      // if (checked) {
      //   togglePanelForChecked(panelID);
      //   // Step 1: Handle panel selection logic
      //   let ICDPanelIndex = getICDPanelsIndex(props?.Inputs);
      //   let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
      //   const panelIndex = props.Inputs[props.index].fields[
      //     props.fieldIndex
      //   ].panels.findIndex(
      //     (panel: any) =>
      //       panel.panelID === panelID &&
      //       panel.referenceLabName === referenceLabName
      //   );
      //   const panel = props.Inputs?.[props.index]?.fields?.[
      //     props?.fieldIndex
      //   ]?.panels?.find(
      //     (panel: any) => panel.isSelected // Adjust condition as needed
      //   );

      //   // if (!panel) {
      //   props.Inputs[props.index].fields[props?.fieldIndex].panels[
      //     panelIndex
      //   ].isSelected = true;

      //   props.Inputs[props.index].fields[props?.fieldIndex].panels[
      //     panelIndex
      //   ].testOptions.forEach((testOptions: any) => {
      //     testOptions.isSelected = true;
      //   });
      //   if (ICDPanelIndex) {
      //     props.Inputs[ICDPanelIndex]?.fields?.forEach(
      //       (IcdPanelsFields: any) => {
      //         if (IcdPanelsFields.systemFieldName == "ICDPanels") {
      //           IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
      //             if (panelsInfo.panelName == name) {
      //               panelsInfo.isVisible = true;
      //             }
      //           });
      //         }
      //       }
      //     );
      //   }
      //   if (specimenSourceIndex) {
      //     props.Inputs[specimenSourceIndex]?.fields?.forEach(
      //       (specimenSourceFields: any) => {
      //         specimenSourceFields?.specimenSources?.forEach(
      //           (panelsInfo: any) => {
      //             if (
      //               panelsInfo?.panelName === name &&
      //               panelsInfo.panelID === panelID
      //             ) {
      //               panelsInfo.isVisible = true;
      //             }
      //           }
      //         );
      //       }
      //     );
      //   }
      //   //   }
      //   // Step 2: Make ICD Panels & specimen source visible if applicable

      //   // Step 3: Validate panel combination if more than one panel is selected
      //   const selectedPanels = props.Inputs[props.index].fields[
      //     props?.fieldIndex
      //   ].panels.filter((panel: any) => panel.isSelected);
      //   if (selectedPanels.length > 1) {
      //     const selectedPanelIDs = selectedPanels.map((panel: any) =>
      //       parseInt(panel.panelID)
      //     );

      //     const allComboPanelIDArrays: any[] = [];
      //     // Push each parsed panel combination array into allComboPanelIDArrays
      //     props.panelCombinations.some((combo: any) => {
      //       const comboPanelIDArrays = JSON.parse(combo.panelCombinationJson);
      //       allComboPanelIDArrays.push(comboPanelIDArrays);
      //     });

      //     // Check if selectedPanelIDs are fully contained in any of the combo arrays
      //     const isValid = allComboPanelIDArrays.some(
      //       (comboPanelIDArray: any[]) => {
      //         const panelIds = comboPanelIDArray.map(
      //           (panel: any) => panel.PanelId
      //         );
      //         return selectedPanelIDs.every((id: any) => panelIds.includes(id));
      //       }
      //     );
      //     // Return true if valid combination is found, otherwise false
      //     if (!isValid) {
      //       props.Inputs[props.index].fields[props?.fieldIndex].panels[
      //         panelIndex
      //       ].isSelected = false;
      //       props.Inputs[props.index].fields[props?.fieldIndex].panels[
      //         panelIndex
      //       ].testOptions.forEach((testOptions: any) => {
      //         testOptions.isSelected = false;
      //       });
      //       if (specimenSourceIndex) {
      //         props.Inputs[specimenSourceIndex]?.fields?.forEach(
      //           (specimenSourceFields: any) => {
      //             specimenSourceFields?.specimenSources?.forEach(
      //               (panelsInfo: any) => {
      //                 if (
      //                   panelsInfo?.panelName === name &&
      //                   panelsInfo.panelID === panelID
      //                 ) {
      //                   panelsInfo.isVisible = false;
      //                 }
      //               }
      //             );
      //           }
      //         );
      //       }
      //       if (ICDPanelIndex) {
      //         props.Inputs[ICDPanelIndex]?.fields?.forEach(
      //           (IcdPanelsFields: any) => {
      //             if (IcdPanelsFields.systemFieldName == "ICDPanels") {
      //               IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
      //                 if (panelsInfo.panelName == name) {
      //                   panelsInfo.isVisible = false;
      //                 }
      //               });
      //             }
      //           }
      //         );
      //       }
      //       const updatedSelectedPanelIDs = selectedPanelIDs.filter(
      //         (id: any) => id !== parseInt(panelID)
      //       );
      //       let matchingArray = findMatchingArrays(
      //         updatedSelectedPanelIDs,
      //         allComboPanelIDArrays
      //       );
      //       console.log(matchingArray, "matchingArray");
      //       handleShowModal(matchingArray);
      //       return;
      //     }
      //   }
      //   // Step 4: Update state with valid selection
      //   let finalisedPanelsArrToSend = panelsArrMakerToSend(
      //     panelIndex,
      //     props?.Inputs[props.index]?.fields[props?.fieldIndex]?.panels[
      //       panelIndex
      //     ],
      //     panelsArrToAppendCopy,
      //     checked
      //   );
      //   setPanelsArrToSend(finalisedPanelsArrToSend);
      //   let newInputs = assignFormValues(
      //     props?.Inputs,
      //     props?.index,
      //     props?.depControlIndex,
      //     props?.fieldIndex,
      //     finalisedPanelsArrToSend,
      //     props?.isDependency,
      //     props?.repeatFieldSection,
      //     props?.isDependencyRepeatFields,
      //     props?.repeatFieldIndex,
      //     props?.repeatDependencySectionIndex,
      //     props?.repeatDepFieldIndex,
      //     undefined,
      //     props?.setInputs
      //   );
      //   newInputs?.then((res) => {
      //     let infectiousDataCopy = JSON?.parse(
      //       JSON?.stringify(props?.infectiousData)
      //     );
      //     infectiousDataCopy[
      //       FindIndex(props?.infectiousData, props?.ArrayReqId)
      //     ].sections = res;
      //     props?.setInfectiousData([...infectiousDataCopy]);
      //   });
      // }

      if (checked) {
        togglePanelForChecked(panelID);

        let ICDPanelIndex = getICDPanelsIndex(props?.Inputs);
        let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
        const panelIndex = props.Inputs[props.index].fields[
          props.fieldIndex
        ].panels.findIndex(
          (panel: any) =>
            panel.panelID === panelID &&
            panel.referenceLabName === referenceLabName
        );

        // Select this panel
        props.Inputs[props.index].fields[props.fieldIndex].panels[
          panelIndex
        ].isSelected = true;
        props.Inputs[props.index].fields[props.fieldIndex].panels[
          panelIndex
        ].testOptions.forEach((testOptions: any) => {
          testOptions.isSelected = true;
        });

        // Show ICD Panels
        if (ICDPanelIndex) {
          props.Inputs[ICDPanelIndex]?.fields?.forEach(
            (IcdPanelsFields: any) => {
              if (IcdPanelsFields.systemFieldName == "ICDPanels") {
                IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
                  if (panelsInfo.panelName == name) {
                    panelsInfo.isVisible = true;
                  }
                });
              }
            }
          );
        }

        // Show Specimen Source
        if (specimenSourceIndex) {
          props.Inputs[specimenSourceIndex]?.fields?.forEach(
            (specimenSourceFields: any) => {
              specimenSourceFields?.specimenSources?.forEach(
                (panelsInfo: any) => {
                  if (
                    panelsInfo?.panelName === name &&
                    panelsInfo.panelID === panelID
                  ) {
                    panelsInfo.isVisible = true;
                  }
                }
              );
            }
          );
        }

        //Get all selected panels (no filter yet)
        const allPanels =
          props.Inputs[props.index].fields[props.fieldIndex].panels;
        const selectedPanels = allPanels.filter(
          (panel: any) => panel.isSelected
        );

        // Check if all selected panels have the same reference lab
        const selectedLabNames = [
          ...new Set(
            selectedPanels.map((panel: any) => panel.referenceLabName)
          ),
        ];

        if (selectedLabNames.length > 1) {
          // Deselect the current panel
          props.Inputs[props.index].fields[props.fieldIndex].panels[
            panelIndex
          ].isSelected = false;
          props.Inputs[props.index].fields[props.fieldIndex].panels[
            panelIndex
          ].testOptions.forEach((testOptions: any) => {
            testOptions.isSelected = false;
          });

          // Reset ICD/specimen visibility
          if (specimenSourceIndex) {
            props.Inputs[specimenSourceIndex]?.fields?.forEach(
              (specimenSourceFields: any) => {
                specimenSourceFields?.specimenSources?.forEach(
                  (panelsInfo: any) => {
                    if (
                      panelsInfo?.panelName === name &&
                      panelsInfo.panelID === panelID
                    ) {
                      panelsInfo.isVisible = false;
                      panelsInfo.specimenSourceOption.map((i: any) => {
                        i.isSelected = false;
                      });
                    }
                  }
                );
              }
            );
          }

          if (ICDPanelIndex) {
            props.Inputs[ICDPanelIndex]?.fields?.forEach(
              (IcdPanelsFields: any) => {
                if (IcdPanelsFields.systemFieldName == "ICDPanels") {
                  IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
                    if (panelsInfo.panelName == name) {
                      panelsInfo.isVisible = false;
                    }
                  });
                }
              }
            );
          }

          //  Show error and exit early
          toast.error("Select same reference lab test");
          return;
        }

        //  Proceed with combination validation now (same lab ensured)
        if (selectedPanels.length > 1) {
          const selectedPanelIDs = selectedPanels.map((panel: any) =>
            parseInt(panel.panelID)
          );

          const allComboPanelIDArrays: any[] = [];
          props.panelCombinations.some((combo: any) => {
            const comboPanelIDArrays = JSON.parse(combo.panelCombinationJson);
            allComboPanelIDArrays.push(comboPanelIDArrays);
          });

          const isValid = allComboPanelIDArrays.some(
            (comboPanelIDArray: any[]) => {
              const panelIds = comboPanelIDArray.map(
                (panel: any) => panel.PanelId
              );
              return selectedPanelIDs.every((id: any) => panelIds.includes(id));
            }
          );

          if (!isValid) {
            props.Inputs[props.index].fields[props.fieldIndex].panels[
              panelIndex
            ].isSelected = false;
            props.Inputs[props.index].fields[props.fieldIndex].panels[
              panelIndex
            ].testOptions.forEach((testOptions: any) => {
              testOptions.isSelected = false;
            });

            if (specimenSourceIndex) {
              props.Inputs[specimenSourceIndex]?.fields?.forEach(
                (specimenSourceFields: any) => {
                  specimenSourceFields?.specimenSources?.forEach(
                    (panelsInfo: any) => {
                      if (
                        panelsInfo?.panelName === name &&
                        panelsInfo.panelID === panelID
                      ) {
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
                  if (IcdPanelsFields.systemFieldName == "ICDPanels") {
                    IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
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
            console.log(matchingArray, "matchingArray");
            handleShowModal(matchingArray);
            return;
          }
        }

        // Step 4: Update state with valid selection
        let finalisedPanelsArrToSend = panelsArrMakerToSend(
          panelIndex,
          props?.Inputs[props.index]?.fields[props?.fieldIndex]?.panels[
          panelIndex
          ],
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
        const panelIndex = props.Inputs[props.index].fields[
          props.fieldIndex
        ].panels.findIndex(
          (panel: any) =>
            panel.panelID === panelID &&
            panel.referenceLabName === referenceLabName
        );
        togglePanelForUnChecked(panelID);
        let specimenSourceIndex = getSpecimenSourceIndex(inputsCopy);
        let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
        // if (specimenSourceIndex) {
        //   props?.Inputs[specimenSourceIndex]?.fields.forEach(
        //     (specimenSourceFields: any) => {
        //       specimenSourceFields.defaultValue =
        //         specimenSourceFields.defaultValue.filter(
        //           (i: any) => i.panelID !== panelID
        //         );
        //       specimenSourceFields.specimenSources?.forEach(
        //         (panelsInfo: any) => {
        //           if (
        //             panelsInfo.panelName === name &&
        //             panelsInfo.panelID === panelID
        //           ) {
        //             panelsInfo.isVisible = false;
        //             panelsInfo.isSelected = false;
        //             panelsInfo?.specimenSourceOption?.map((option: any) => {
        //               option.isSelected = false;
        //             });
        //             const updatedInputValueForSpecimen =
        //               props?.inputValueForSpecimen?.filter(
        //                 (option: any) => option.panelID !== panelID.toString()
        //               );
        //             props.setInputValueForSpecimen(
        //               updatedInputValueForSpecimen
        //             );
        //           }
        //         }
        //       );
        //     }
        //   );
        // }
        if (specimenSourceIndex) {
          props?.Inputs[specimenSourceIndex]?.fields.forEach(
            (specimenSourceFields: any) => {
              //Safely handle defaultValue
              const defaultValueArray = Array.isArray(
                specimenSourceFields.defaultValue
              )
                ? specimenSourceFields.defaultValue
                : [];

              specimenSourceFields.defaultValue = defaultValueArray.filter(
                (i: any) => i.panelID !== panelID
              );

              specimenSourceFields.specimenSources?.forEach(
                (panelsInfo: any) => {
                  if (
                    panelsInfo.panelName === name &&
                    panelsInfo.panelID === panelID
                  ) {
                    panelsInfo.isVisible = false;
                    panelsInfo.isSelected = false;

                    panelsInfo?.specimenSourceOption?.forEach((option: any) => {
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
              if (IcdPanelsFields.systemFieldName == "ICDPanels") {
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
        props.Inputs[props.index].fields[props?.fieldIndex].panels[
          panelIndex
        ].isSelected = false;
        props.Inputs[props.index].fields[props?.fieldIndex].panels[
          panelIndex
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
      if (selectedIDs.every((id) => panelIDs.includes(id))) {
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
    console.log(panelNameArr, "panelNameArr");
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
          } else {
            panelsInfo.isVisible = false;
          }
        });
      }
    });
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
      const type = test.referenceLabName;
      // If the typeOfTest has already been encountered, add the test to its group
      if (typeMap.has(type)) {
        const groupIndex = typeMap.get(type);
        grouped[groupIndex].tests.push(test);
      } else {
        // If the typeOfTest is new, create a new group
        typeMap.set(type, grouped.length); // Store the index of the new group
        grouped.push({ referenceLabName: type, tests: [test] });
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

      <div className="mb-4">
        {groupTestsByType(props?.panels).map((options: any) => (
          <>
            <div className="fw-bold text-primary mb-3">
              {options.referenceLabName}
            </div>
            {options.tests.map(
              (test: any, index: any) =>
                test.isVisible && (
                  <div key={index} className={`${props?.displayType}`}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="card border border-gray-300 mb-3 rounded">
                          <div
                            className="card-header bg-light d-flex justify-content-between align-items-center rounded min-h-35px px-4"
                            onClick={() => togglePanel(test?.panelID)}
                          >
                            <div className="col-12">
                              <div className="form-check form-check-sm form-check-solid col-12">
                                <input
                                  className="form-check-input mr-2 h-20px w-20px"
                                  type="checkbox"
                                  checked={test?.isSelected}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e: any) => {
                                    handleChangeParent(
                                      test?.panelID,
                                      test?.panelName,
                                      e.target.checked,
                                      options.referenceLabName
                                    );
                                  }}
                                />
                                <label className="fw-600">
                                  {test?.panelName}{" "}
                                </label>
                              </div>
                            </div>
                          </div>
                          <Collapse
                            in={openPanels[test?.panelID]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <div className="card-body py-md-4 py-3 col-12">
                              <div className="row">
                                {test?.testOptions?.map(
                                  (optionsChild: any, childIndex: any) => (
                                    <div
                                      key={childIndex}
                                      className={
                                        test?.testOptions.length > 1
                                          ? "mb-3 col-xl-4 col-lg-4 col-md-4 col-sm-6"
                                          : "col-xl-12 col-lg-12 col-md-12 col-sm-12"
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
                )
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default MultipleReferenceLabPanel;
