import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { styles } from "Utils/Common";
import { assignFormValues } from "../../../Utils/Auth";
import {
  getICDPanelsIndex,
  panelsArrItemRemoval,
  panelsArrMakerToSend,
} from "../../../Utils/Common/Requisition";
import useLang from "../../hooks/useLanguage";
import { customStyles } from "./MultiSelect";
import { useLocation } from "react-router-dom";

enum PanelsTypes {
  ListOnly = "List Only",
  Search = "Search",
  SelectableList = "Selectable List",
  SelectableListForTest = "Selectable List For Tests Only",
}

const MultipleHeaderSelectable2 = (props: any) => {
  const { t } = useLang();
  const [panelsArrToSend, setPanelsArrToSend] = useState<any>([]);
  const location = useLocation();
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

    newInputsPromise?.then((updatedSections) => {
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
    props.fields.enableRule = "";
    const name = panelName;
    let panelsArrToAppendCopy = [...panelsArrToSend];
    let inputsCopy = JSON?.parse(JSON?.stringify(props?.Inputs));

    if (checked) {
      let ICDPanelIndex = getICDPanelsIndex(props?.Inputs);
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
      let ICDPanelIndex = getICDPanelsIndex(props?.Inputs);

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
    // testID: string,
    checked: boolean,
    parentPanelName: string,
    index: number,
    childIndex: number
    // panelID: any
  ) => {
    props.fields.enableRule = "";
    let inputsCopy = JSON.parse(JSON?.stringify(props?.Inputs));
    // let panelsArrToAppendCopy = JSON.parse(JSON?.stringify(panelsArrToSend));
    // let panelsCopy = [...props?.panels];
    let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
    if (checked) {
      props.Inputs[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
        if (IcdPanelsFields.systemFieldName == "ICDPanels") {
          IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
            if (panelsInfo.panelName == parentPanelName) {
              panelsInfo.isVisible = true;
            }
          });
        }
      });
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
      // Update panelsArrToSend state
      // let finalisedPanelsArrToSend = panelsArrItemAddChild(
      //   index,
      //   parentPanelName,
      //   [
      //     inputsCopy[props.index].fields[props?.fieldIndex].panels[index]
      //       .testOptions[childIndex],
      //   ],
      //   panelsArrToAppendCopy,
      //   panelsCopy
      // );
      // setPanelsArrToSend(finalisedPanelsArrToSend);
    } else {
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
      //  If all child checkboxes are unchecked, update parent checkbox state and panel visibility
      if (allChildUnchecked) {
        // Uncheck the parent checkbox
        inputsCopy[props.index].fields[props?.fieldIndex].panels[
          index
        ].isSelected = false;
      }
      //now remove find and remove it from the panel testoptions against that panel
      // Update panelsArrToSend state
      // let finalisedPanelsArrToSend = panelsArrItemRemovalChild(
      //   index,
      //   testID,
      //   panelsArrToAppendCopy
      // );
      // setPanelsArrToSend(finalisedPanelsArrToSend);
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

  const handleMultiSelect = (
    parentPanelName: string,
    index: number,
    selectedTests: any
  ) => {
    props.fields.enableRule = "";
    let inputsCopy = JSON.parse(JSON?.stringify(props?.Inputs));

    let ICDPanelIndex = getICDPanelsIndex(inputsCopy);

    props.Inputs[ICDPanelIndex]?.fields?.forEach((IcdPanelsFields: any) => {
      if (IcdPanelsFields.systemFieldName == "ICDPanels") {
        IcdPanelsFields?.panels?.forEach((panelsInfo: any) => {
          if (panelsInfo.panelName == parentPanelName) {
            panelsInfo.isVisible = true;
          }
        });
      }
    });
    const panels =
      inputsCopy[props.index].fields[props?.fieldIndex].panels[index];

    // Loop through testOptions and update their isSelected state
    panels.testOptions.forEach((test: any, testIndex: number) => {
      const isSelected = selectedTests.some(
        (selected: any) => selected.value === test.testID
      );
      test.isSelected = isSelected;
    });

    // Update parent checkbox state: if all child checkboxes are unchecked, uncheck parent
    panels.isSelected = panels.testOptions.some((test: any) => test.isSelected);

    let newInputs = assignFormValues(
      inputsCopy,
      props?.index,
      props?.depControlIndex,
      props?.fieldIndex,
      panels.testOptions,
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
    <>
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}
      <div id={props?.name} ref={divElement} tabIndex={-1}></div>
      {props?.panels?.map((options: any, index: number) => {
        const panelType = options?.panelType;
        const testOptions = options?.testOptions;

        const selectedTestOptions = testOptions.filter(
          (options: any) => options.isSelected
        );

        const formattedOptions = testOptions.map((test: any) => ({
          value: test.testID,
          label: test.testName,
        }));

        if (panelType === PanelsTypes.Search) {
          return (
            <SearchInput
              displayType={props?.displayType}
              panelName={options?.panelName}
              testOptions={options?.testOptions}
              disabled={props?.disabled}
              handleMultiSelect={handleMultiSelect}
              selectedTestOptions={selectedTestOptions}
              index={index}
            />
          );
        }

        if (panelType === PanelsTypes.ListOnly) {
          return (
            <div className={`${props?.displayType}`}>
              <div className="row">
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
                          (optionsChild: any, childIndex: any) => {
                            return (
                              <div
                                className={
                                  options?.testOptions.length > 1
                                    ? "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
                                    : "mb-3 col-xl-12 col-lg-12 col-md-12 col-sm-12"
                                }
                              >
                                <label className="form-check form-check-sm align-items-start form-check-solid col-12">
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
                            );
                          }
                        )}
                      </div>
                      {/* 
                          Commented out as per 86evacbg9(Add Search option in Display Type in Compendium - Category type - UI) requirements
                          */}
                      {/* <Select
                        isMulti
                        options={formattedOptions}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder={options?.panelName}
                        onChange={(e: any) => {
                          handleMultiSelect(options?.panelName, index, e);
                        }}
                        theme={(theme) => styles(theme)}
                        menuPortalTarget={document.body}
                        value={selectedTestOptions.map((test: any) => ({
                          value: test.testID,
                          label: test.testName,
                        }))}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return options.isVisible && panelType === PanelsTypes.SelectableList ? (
          <div className={`${props?.displayType}`}>
            <div className="row">
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
                        (optionsChild: any, childIndex: any) => {
                          return (
                            <div
                              className={
                                options?.testOptions.length > 1
                                  ? "mb-3 col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
                                  : "mb-3 col-xl-12 col-lg-12 col-md-12 col-sm-12"
                              }
                            >
                              <label className="form-check form-check-sm align-items-start form-check-solid col-12">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <input
                                      className="form-check-input mr-2 h-20px w-20px"
                                      type="checkbox"
                                      checked={optionsChild?.isSelected}
                                      onChange={(e: any) => {
                                        handleChangeChild(
                                          e?.target?.checked,
                                          options?.panelName,
                                          index,
                                          childIndex
                                        );
                                      }}
                                    />
                                    <span className="fw-400">
                                      {optionsChild?.testName}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted">
                                      {optionsChild?.specimenType}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          options.isVisible &&
          panelType === PanelsTypes.SelectableListForTest && (
            <div className={`${props?.displayType}`}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="card border border-gray-300 mb-3 rounded">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center rounded min-h-35px px-4">
                      <div className="col-12">
                        <label className="form-check form-check-sm form-check-solid col-12">
                          {/* 
                          Commented out as per 86evacbg9(Add Search option in Display Type in Compendium - Category type - UI) requirements
                          */}
                          {/* <input
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
                          /> */}

                          {
                            <span className="fw-600">
                              {options?.panelName}
                            </span>
                          }
                        </label>
                      </div>
                    </div>
                    <div className="card-body py-md-4 py-3 col-12">
                      <div className="row">
                        {options?.testOptions?.map(
                          (optionsChild: any, childIndex: any) => {
                            return (
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
                                        e?.target?.checked,
                                        options?.panelName,
                                        index,
                                        childIndex
                                      );
                                    }}
                                    checked={optionsChild?.isSelected}
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
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        );
      })}
    </>
  );
};

export { MultipleHeaderSelectable2 };
const SearchInput = (props: any) => {
  const { t } = useLang();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const formattedOptions = props.testOptions.map((test: any) => ({
    value: test.testID,
    label: test.testName,
  }));

  const filteredOptions = formattedOptions.filter((option: any) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: any) => {
    setSelectedOptions((prev: any) => {
      const alreadySelected = prev.find(
        (item: any) => item.value === option.value
      );
      return alreadySelected
        ? prev.filter((item: any) => item.value !== option.value)
        : [...prev, option];
    });
    setSearchTerm(""); // Clear input after selection
    setShowDropdown(false); // Hide dropdown
  };

  useEffect(() => {
    if (props?.selectedTestOptions.length > 0 || selectedOptions.length > 0) {
      props.handleMultiSelect(props?.panelName, props?.index, selectedOptions);
    }
  }, [props?.selectedTestOptions.length, selectedOptions.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = props.selectedTestOptions.map((test: any) => ({
    value: test.testID,
    label: test.testName,
  }));

  useEffect(() => {
    setSelectedOptions(options);
  }, []);

  return (
    <div className={`${props?.displayType}`} ref={dropdownRef}>
      <div className="row">
        <div className="col-lg-12">
          <div className="card border border-gray-300 mb-3 rounded">
            <div className="card-header bg-light d-flex justify-content-between align-items-center rounded min-h-35px px-4">
              <div className="col-12">
                <label className="col-12">
                  <span className="fw-600">{props?.panelName}</span>
                </label>
              </div>
            </div>
            <div className="card-body py-md-4 py-3 col-12">
              {/* Search Input */}
              <input
                type="text"
                placeholder={t("Search...")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(e.target.value.length > 0); // Show list only when typing
                }}
                className={`form-control ${props?.disabled ? "" : "bg-transparent"
                  }`}
                autoComplete="off"
              />

              {/* Popover Dropdown */}
              {showDropdown && filteredOptions.length > 0 && (
                <div className="dropdown-menu show w-100 mt-1 shadow">
                  {filteredOptions.map((option: any) => (
                    <button
                      key={option.value}
                      className="dropdown-item d-flex justify-content-between align-items-center"
                      onClick={() => handleSelect(option)}
                    >
                      {option.label}
                      {selectedOptions.some(
                        (item: any) => item.value === option.value
                      ) && <span className="badge bg-primary">✔</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Badges */}
              {selectedOptions.length > 0 && (
                <div className="mt-3">
                  {selectedOptions.map((option: any) => (
                    <span
                      key={option.value}
                      className="badge bg-primary text-white me-2 p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelect(option)}
                    >
                      {option.label} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
