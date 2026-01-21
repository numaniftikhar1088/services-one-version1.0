import { useEffect, useRef, useState } from 'react';
import { assignFormValues } from '../../../Utils/Auth';
import {
  getICDPanelsIndex,
  panelsArrItemAddChild,
  panelsArrItemRemoval,
  panelsArrItemRemovalChild,
  panelsArrMakerToSend,
} from '../../../Utils/Common/Requisition';
import useLang from './../../hooks/useLanguage';
import { useLocation } from 'react-router-dom';

const ToxTestingOption = (props: any) => {
  const { t } = useLang();
  const location = useLocation();
  const [panelsArrToSend, setPanelsArrToSend] = useState<any>([]);

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

    if (currentField?.panels && !location.state?.reqId) {
      currentField.panels.forEach((panel: any) => {
        if (panel.isDefaultSelectOnRequisition) {
          panel.isSelected = true;
          panel.testOptions?.forEach((option: any) => {
            option.isSelected = true;
          });
        }
      });
    }

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

    newInputsPromise?.then(updatedSections => {
      if (!updatedSections) return;

      const infectiousDataCopy = JSON.parse(JSON.stringify(infectiousData));
      const sectionIndex = FindIndex(infectiousData, ArrayReqId);

      if (sectionIndex !== -1) {
        infectiousDataCopy[sectionIndex].sections = updatedSections;
        setInfectiousData([...infectiousDataCopy]);
      }
    });
  }, [props.IsSelectedByDefaultCompendiumData]);

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
    props.fields.enableRule = '';
    const panelsArrToAppendCopy = [...panelsArrToSend];
    const inputsCopy = JSON.parse(JSON.stringify(props?.Inputs));
    const ICDPanelIndex = getICDPanelsIndex(inputsCopy);

    if (checked) {
      const panel = props.Inputs[props.index].fields[props.fieldIndex].panels[index];
      if (panel.panelType === 'Screening') {
        // Deselect all other Screening panels
        props.Inputs[props.index].fields[props.fieldIndex].panels.forEach((p: any, i: number) => {
          if (i !== index && p.panelType === 'Screening') {
            p.isSelected = false;
            p.testOptions.forEach((testOption: any) => {
              testOption.isSelected = false;
            });
            panelsArrItemRemoval(p.panelID, panelsArrToAppendCopy);
          }
        });
        props.Inputs[ICDPanelIndex]?.fields?.forEach((i: any) => {
          if (i?.systemFieldName === 'ICDPanels') {
            i?.panels?.forEach((j: any) => {
              j.isVisible = false;
            });
          }
        });
      }

      props.Inputs[props.index].fields[props.fieldIndex].panels[index].isSelected = true;
      props.Inputs[props.index].fields[props.fieldIndex].panels[index].testOptions.forEach((testOptions: any) => {
        testOptions.isSelected = true;
      });
      const finalisedPanelsArrToSend = panelsArrMakerToSend(
        index,
        props.Inputs[props.index].fields[props.fieldIndex].panels[index],
        panelsArrToAppendCopy,
        checked
      );
      setPanelsArrToSend(finalisedPanelsArrToSend);
      props.Inputs[ICDPanelIndex]?.fields?.forEach((i: any) => {
        if (i?.systemFieldName === 'ICDPanels') {
          i?.panels?.forEach((j: any) => {
            if (j?.panelID === panelID) {
              j.isVisible = true;
            }
          });
        }
      });
      const newInputs = assignFormValues(
        props.Inputs,
        props.index,
        props.depControlIndex,
        props.fieldIndex,
        finalisedPanelsArrToSend,
        props.isDependency,
        props.repeatFieldSection,
        props.isDependencyRepeatFields,
        props.repeatFieldIndex,
        props.repeatDependencySectionIndex,
        props.repeatDepFieldIndex,
        undefined,
        props.setInputs
      );
      newInputs?.then(res => {
        const infectiousDataCopy = JSON.parse(JSON.stringify(props.infectiousData));
        infectiousDataCopy[FindIndex(props.infectiousData, props.ArrayReqId)].sections = res;
        props.setInfectiousData([...infectiousDataCopy]);
      });
    } else {
      inputsCopy[props.index].fields[props.fieldIndex].panels[index].isSelected = false;
      inputsCopy[props.index].fields[props.fieldIndex].panels[index].testOptions.forEach((testOptions: any) => {
        testOptions.isSelected = false;
      });
      const finalisedPanelsArrToSend = panelsArrItemRemoval(
        panelID,
        panelsArrToAppendCopy
      );
      setPanelsArrToSend(finalisedPanelsArrToSend);
      inputsCopy[ICDPanelIndex]?.fields?.forEach((i: any) => {
        if (i?.systemFieldName === 'ICDPanels') {
          i?.panels?.forEach((j: any) => {
            if (j?.panelID === panelID) {
              j.isVisible = false;
            }
          });
        }
      });
      const newInputs = assignFormValues(
        inputsCopy,
        props.index,
        props.depControlIndex,
        props.fieldIndex,
        finalisedPanelsArrToSend,
        props.isDependency,
        props.repeatFieldSection,
        props.isDependencyRepeatFields,
        props.repeatFieldIndex,
        props.repeatDependencySectionIndex,
        props.repeatDepFieldIndex,
        undefined,
        props.setInputs
      );
      newInputs?.then(res => {
        const infectiousDataCopy = JSON.parse(JSON.stringify(props.infectiousData));
        infectiousDataCopy[FindIndex(props.infectiousData, props.ArrayReqId)].sections = res;
        props.setInfectiousData([...infectiousDataCopy]);
      });
    }
  };

  const handleChangeChild = (
    testID: string,
    checked: boolean,
    parentPanelName: string,
    index: number,
    childIndex: number,
    panelID: any
  ) => {
    const inputsCopy = JSON.parse(JSON.stringify(props.Inputs));
    const panelsArrToAppendCopy = JSON.parse(JSON.stringify(panelsArrToSend));
    let panelsCopy: any;
    if (props.panels) {
      panelsCopy = [...props.panels];
    }
    const ICDPanelIndex = getICDPanelsIndex(inputsCopy);

    if (checked) {
      // Check if the parent panel is of type 'Screening'
      const parentPanel = inputsCopy[props.index].fields[props.fieldIndex].panels[index];
      if (parentPanel.panelType === 'Screening') {
        // Deselect all child test options in other Screening panels
        inputsCopy[props.index].fields[props.fieldIndex].panels.forEach((panel: any, i: number) => {
          if (i !== index && panel.panelType === 'Screening') {
            panel.isSelected = false;
            panel.testOptions.forEach((testOption: any) => {
              testOption.isSelected = false;
            });
            panelsArrItemRemoval(panel.panelID, panelsArrToAppendCopy);
          }
        });
        // Hide ICD panels for other Screening panels
        inputsCopy[ICDPanelIndex]?.fields?.forEach((field: any) => {
          if (field?.systemFieldName === 'ICDPanels') {
            field?.panels?.forEach((icdPanel: any) => {
              if (icdPanel?.panelID !== panelID) {
                icdPanel.isVisible = false;
              }
            });
          }
        });
      }

      // Select the current child test option and its parent panel
      inputsCopy[props.index].fields[props.fieldIndex].panels[index].testOptions[childIndex].isSelected = true;
      inputsCopy[props.index].fields[props.fieldIndex].panels[index].isSelected = true;
      const finalisedPanelsArrToSend = panelsArrItemAddChild(
        index,
        parentPanelName,
        [inputsCopy[props.index].fields[props.fieldIndex].panels[index].testOptions[childIndex]],
        panelsArrToAppendCopy,
        panelsCopy
      );
      // Show ICD panel for the selected panel
      inputsCopy[ICDPanelIndex]?.fields?.forEach((field: any) => {
        if (field?.systemFieldName === 'ICDPanels') {
          field?.panels?.forEach((icdPanel: any) => {
            if (icdPanel?.panelID === panelID) {
              icdPanel.isVisible = true;
            }
          });
        }
      });
      setPanelsArrToSend(finalisedPanelsArrToSend);
    } else {
      // Deselect the current child test option
      inputsCopy[props.index].fields[props.fieldIndex].panels[index].testOptions[childIndex].isSelected = false;
      const allChildUnchecked = inputsCopy[props.index].fields[props.fieldIndex].panels[index].testOptions.every(
        (option: any) => !option.isSelected
      );
      if (allChildUnchecked) {
        inputsCopy[props.index].fields[props.fieldIndex].panels[index].isSelected = false;
        inputsCopy[ICDPanelIndex]?.fields?.forEach((field: any) => {
          if (field?.systemFieldName === 'ICDPanels') {
            field?.panels?.forEach((icdPanel: any) => {
              if (icdPanel?.panelID === panelID) {
                icdPanel.isVisible = false;
              }
            });
          }
        });
      }
      const finalisedPanelsArrToSend = panelsArrItemRemovalChild(
        index,
        testID,
        panelsArrToAppendCopy
      );
      setPanelsArrToSend(finalisedPanelsArrToSend);
    }

    const newInputs = assignFormValues(
      inputsCopy,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      panelsArrToAppendCopy,
      props.isDependency,
      props.repeatFieldSection,
      props.isDependencyRepeatFields,
      props.repeatFieldIndex,
      props.repeatDependencySectionIndex,
      props.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    );
    newInputs?.then(res => {
      const infectiousDataCopy = JSON.parse(JSON.stringify(props.infectiousData));
      infectiousDataCopy[FindIndex(props.infectiousData, props.ArrayReqId)].sections = res;
      props?.setInfectiousData([...infectiousDataCopy]);
    });
  };
  const handleChangePanelType = (
    panelType: string,
    checked: boolean
  ) => {
    const inputsCopy = JSON.parse(JSON.stringify(props.Inputs));
    const panelsArrToAppendCopy = [...panelsArrToSend];
    const ICDPanelIndex = getICDPanelsIndex(inputsCopy);

    props.panels.forEach((panel: any, index: number) => {
      if (panel.panelType === panelType && panel.isVisible) {
        if (panelType === 'Screening' && checked) {
          // Deselect all other Screening panels
          props.panels.forEach((p: any, i: number) => {
            if (i !== index && p.panelType === 'Screening' && p.isSelected) {
              inputsCopy[props.index].fields[props.fieldIndex].panels[i].isSelected = false;
              inputsCopy[props.index].fields[props.fieldIndex].panels[i].testOptions.forEach((testOption: any) => {
                testOption.isSelected = false;
              });
              panelsArrItemRemoval(p.panelID, panelsArrToAppendCopy);
            }
          });
        }

        inputsCopy[props.index].fields[props.fieldIndex].panels[index].isSelected = checked;
        inputsCopy[props.index].fields[props.fieldIndex].panels[index].testOptions.forEach((testOption: any) => {
          testOption.isSelected = checked;
        });

        let finalisedPanelsArrToSend;
        if (checked) {
          finalisedPanelsArrToSend = panelsArrMakerToSend(
            index,
            inputsCopy[props.index].fields[props.fieldIndex].panels[index],
            panelsArrToAppendCopy,
            checked
          );
        } else {
          finalisedPanelsArrToSend = panelsArrItemRemoval(
            panel.panelID,
            panelsArrToAppendCopy
          );
        }
        setPanelsArrToSend(finalisedPanelsArrToSend);

        inputsCopy[ICDPanelIndex]?.fields?.forEach((i: any) => {
          if (i?.systemFieldName === 'ICDPanels') {
            i?.panels?.forEach((j: any) => {
              if (j?.panelID === panel.panelID) {
                j.isVisible = checked;
              }
            });
          }
        });
      }
    });

    const newInputs = assignFormValues(
      inputsCopy,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      panelsArrToAppendCopy,
      props.isDependency,
      props.repeatFieldSection,
      props.isDependencyRepeatFields,
      props.repeatFieldIndex,
      props.repeatDependencySectionIndex,
      props.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    );

    newInputs?.then(res => {
      const infectiousDataCopy = JSON.parse(JSON.stringify(props.infectiousData));
      infectiousDataCopy[FindIndex(props?.infectiousData, props.ArrayReqId)].sections = res;
      props?.setInfectiousData([...infectiousDataCopy]);
    });
  };

  const setpanelsArrToSendForEdit = () => {
    let panelsCopy: any;
    if (props.panels) {
      panelsCopy = [...props.panels];
    }
    const filteredPanelsCopy = panelsCopy?.filter(
      (panelsData: any) => panelsData.isSelected
    );
    const panelNameArr: any = [];
    filteredPanelsCopy?.forEach((panelData: any) => {
      panelNameArr.push(panelData.panelName);
    });
    let inputsCopy: any;
    if (props.Inputs) {
      inputsCopy = [...props.Inputs];
    }
    assignFormValues(
      inputsCopy,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      filteredPanelsCopy,
      props.isDependency,
      props.repeatFieldSection,
      props.isDependencyRepeatFields,
      props.repeatFieldIndex,
      props.repeatDependencySectionIndex,
      props.repeatDepFieldIndex,
      undefined,
      props.setInputs
    );
    setPanelsArrToSend(filteredPanelsCopy);
  };

  const divElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (props.setErrorFocussedInput) props.setErrorFocussedInput();
  }, [props.errorFocussedInput]);

  // Group panels by panelType, only including visible panels
  const groupedPanels = props.panels
    ?.filter((panel: any) => panel.isVisible)
    ?.reduce((acc: any, panel: any) => {
      const type = panel.panelType || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(panel);
      return acc;
    }, {});

  // Determine if all panels in a panelType are selected
  const isPanelTypeSelected = (panelType: string) => {
    return groupedPanels[panelType]?.every((panel: any) => panel.isSelected);
  };
  return (
    <>
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}
      <div id={props.name} ref={divElement} tabIndex={-1}></div>

      {Object.keys(groupedPanels).map((panelType: string) => (
        <div key={panelType} className="mb-4">
          <div className="card border border-gray-300 mb-3 rounded">
            <div className="card-header bg-light-primary text-white d-flex justify-content-between align-items-center rounded min-h-35px px-4">
              <label className="form-check form-check-sm form-check-solid">
                {panelType !== "Screening" && <input
                  className="form-check-input mr-2 h-20px w-20px"
                  type="checkbox"
                  checked={isPanelTypeSelected(panelType)}
                  onChange={(e: any) => {
                    handleChangePanelType(panelType, e.target.checked);
                  }}
                />}
                <h5 className="m-0 d-inline">{panelType}</h5>
              </label>
            </div>
            <div className="card-body py-md-4 py-3">
              {groupedPanels[panelType].map((options: any, index: number) => (
                <div
                  key={options.panelID}
                  className="mb-3"
                >
                  <div className="card border border-gray-300 mb-3 rounded">
                    <div
                      className="card-header bg-light d-flex justify-content-between align-items-center rounded min-h-35px px-4"
                      style={{ background: '#F3F6F9', borderRadius: '8px' }}
                    >
                      <div className="col-12">
                        <label className="form-check form-check-sm form-check-solid col-12">
                          <input
                            className="form-check-input mr-2 h-20px w-20px"
                            type="checkbox"
                            checked={options.isSelected}
                            onChange={(e: any) => {
                              handleChangeParent(
                                options.panelID,
                                options.panelName,
                                e.target.checked,
                                props.panels.findIndex((p: any) => p.panelID === options.panelID)
                              );

                            }}
                            disabled={panelType === "Screening" && props.screening}
                          />
                          <span className="fw-600">{options.panelName}</span>
                        </label>
                      </div>
                    </div>
                    <div className="card-body py-md-4 py-3 col-12">
                      <div className="row">
                        {options.testOptions?.map(
                          (optionsChild: any, childIndex: any) =>
                            optionsChild.isVisible && (
                              <div
                                key={optionsChild.testID}
                                className="mb-3 col-xl-4 col-lg-4 col-md-4 col-sm-6"
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
                                        props.panels.findIndex((p: any) => p.panelID === options.panelID),
                                        childIndex,
                                        options?.panelID

                                      );
                                    }}
                                    checked={
                                      options?.isSelected &&
                                      optionsChild?.isSelected
                                    }
                                    disabled={panelType === "Screening" && props.screening}
                                  />
                                  <span className="fw-400">
                                    {optionsChild.testName}
                                  </span>
                                </label>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ToxTestingOption;