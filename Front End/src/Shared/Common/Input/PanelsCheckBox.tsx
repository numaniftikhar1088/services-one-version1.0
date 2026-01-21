/* eslint-disable */

import { useEffect, useRef } from 'react';
import { assignFormValues } from 'Utils/Auth';
import { isJson } from 'Utils/Common/Requisition';
import useLang from 'Shared/hooks/useLanguage';
import Checkbox from './Checkbox';
import { useLocation } from 'react-router-dom';

const PanelsCheckBox = (props: any) => {
  const { t } = useLang();
  function FindIndex(arr: any[], rid: any) {
    return arr.findIndex((i: any) => i.reqId === rid);
  }

  const location = useLocation();
  const params = new URLSearchParams(window.location.search);
  const workflowId = params.get('workflowId');
  useEffect(() => {
    if (location?.state?.reqId || workflowId) {
      if (props?.defaultValue?.defaultValue) {
        convertPrefilledIcdDataToJson();
      }
    }
  }, [props?.defaultValue?.defaultValue]);
  const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
  useEffect(() => {
    // Scroll to the div if props.error is present
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [props.error]);
  const convertPrefilledIcdDataToJson = () => {
    // Check if props are valid to avoid unnecessary processing
    if (!props?.defaultValue?.defaultValue || !props?.setInputs || !props?.setInfectiousData) {
      return;
    }

    const result = isJson(props.defaultValue.defaultValue);
    let parsedIcd10Codes = props.defaultValue.defaultValue;
    if (result) {
      try {
        parsedIcd10Codes = JSON.parse(props.defaultValue.defaultValue);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return; // Exit if parsing fails
      }
    }

    // Only proceed if parsedIcd10Codes is valid
    if (!parsedIcd10Codes) {
      return;
    }

    // Assign form values and handle the result
    assignFormValues(
      props?.Inputs,
      props?.index,
      props?.depControlIndex,
      props?.fieldIndex,
      parsedIcd10Codes,
      props?.isDependency,
      props?.repeatFieldSection,
      props?.isDependencyRepeatFields,
      props?.repeatFieldIndex,
      props?.repeatDependencySectionIndex,
      props?.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    )
      .then(res => {
        const infectiousDataCopy = JSON.parse(JSON.stringify(props?.infectiousData)) || [];
        const index = FindIndex(props?.infectiousData, props?.ArrayReqId);
        if (index !== -1) {
          const currentSection = infectiousDataCopy[index]?.sections;
          // Only update if sections have changed to prevent infinite loops
          if (!currentSection || JSON.stringify(currentSection) !== JSON.stringify(res)) {
            infectiousDataCopy[index].sections = res;
            props?.setInfectiousData((prev: any) => {
              // Return new array only if it differs from previous
              const newData = [...infectiousDataCopy];
              return JSON.stringify(prev) !== JSON.stringify(newData) ? newData : prev;
            });
          }
        }
      })
      .catch(error => {
        console.error('Error in processing new inputs:', error);
      });
  };
  // const convertPrefilledIcdDataToJson = () => {
  //   const result = isJson(props.defaultValue.defaultValue);
  //   let parsedIcd10Codes = props.defaultValue.defaultValue;
  //   if (result) {
  //     parsedIcd10Codes = JSON.parse(props.defaultValue.defaultValue);
  //   }
  //   const newInputs = assignFormValues(
  //     props?.Inputs,
  //     props?.index,
  //     props?.depControlIndex,
  //     props?.fieldIndex,
  //     parsedIcd10Codes,
  //     props?.isDependency,
  //     props?.repeatFieldSection,
  //     props?.isDependencyRepeatFields,
  //     props?.repeatFieldIndex,
  //     props?.repeatDependencySectionIndex,
  //     props?.repeatDepFieldIndex,
  //     undefined,
  //     props?.setInputs
  //   );
  //   newInputs
  //     ?.then(res => {
  //       const infectiousDataCopy = JSON.parse(
  //         JSON.stringify(props?.infectiousData)
  //       );
  //       const index = FindIndex(props?.infectiousData, props?.ArrayReqId);
  //       if (index !== -1) {
  //         infectiousDataCopy[index].sections = res;
  //         if (props?.setInfectiousData) {
  //           props?.setInfectiousData([...infectiousDataCopy]);
  //         }
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error in processing new inputs:', error);
  //     });
  // };
  const handleChange = (
    id: string,
    code: string,
    description: string,
    checked: boolean,
    options: any
  ) => {
    let inputValue: any = [];
    props.Inputs[props?.index].fields.forEach((element: any) => {
      if (element.systemFieldName === 'ICDPanels' || element.systemFieldName === 'ComorbidityPanels') {
        element.panels.forEach((el: any) => {
          if (el.panelID === options.panelID) {
            el.testOptions.forEach((testOption: any) => {
              if (testOption.testCode === code) {
                testOption.isSelected = checked;
              }
            });
            if (el.icD10Group) {
              el.icD10Group.forEach((icd10Group: any) => {
                if (icd10Group.icD10Code === code) {
                  icd10Group.isSelected = checked;
                }
              });
            }
            if (el.comorbidityGroup) {
              el.comorbidityGroup.forEach((comorbidityGroup: any) => {
                if (comorbidityGroup.comorbidityCode === code) {
                  comorbidityGroup.isSelected = checked;
                }
              });
            }
          }
        });
      }
    });
    if (checked) {
      inputValue.push({
        Code: code,
        Description: description,
        icd10id: id,
        panelID: options.panelID,
      });
      let defaultValue = props.defaultValue.defaultValue;
      if (isJson(defaultValue)) {
        defaultValue = JSON.parse(defaultValue);
      }
      if (defaultValue.length > 0) {
        inputValue = [...inputValue, ...defaultValue];
      }
      assignFormValues(
        props?.Inputs,
        props?.index,
        props?.depControlIndex,
        props?.fieldIndex,
        inputValue,
        props?.isDependency,
        props?.repeatFieldSection,
        props?.isDependencyRepeatFields,
        props?.repeatFieldIndex,
        props?.repeatDependencySectionIndex,
        props?.repeatDepFieldIndex,
        undefined,
        props?.setInputs
      ).then(res => {
        const infectiousDataCopy = JSON.parse(
          JSON.stringify(props?.infectiousData)
        );
        infectiousDataCopy[
          FindIndex(props?.infectiousData, props.ArrayReqId)
        ].sections = res;
        props?.setInfectiousData([...infectiousDataCopy]);
      });
    } else {
      let defaultValue = props.defaultValue.defaultValue;
      if (isJson(defaultValue)) {
        defaultValue = JSON.parse(defaultValue);
      }
      const inputValue = defaultValue.filter((checkedPanelsObj: any) => {
        const objCode = checkedPanelsObj.Code?.toString().trim();
        const targetCode = code?.toString().trim();
        return !(objCode === targetCode);
      });
      assignFormValues(
        props?.Inputs,
        props?.index,
        props?.depControlIndex,
        props?.fieldIndex,
        inputValue,
        props?.isDependency,
        props?.repeatFieldSection,
        props?.isDependencyRepeatFields,
        props?.repeatFieldIndex,
        props?.repeatDependencySectionIndex,
        props?.repeatDepFieldIndex,
        undefined,
        props?.setInputs
      ).then(res => {
        const infectiousDataCopy = JSON.parse(
          JSON.stringify(props?.infectiousData)
        );
        infectiousDataCopy[
          FindIndex(props?.infectiousData, props.ArrayReqId)
        ].sections = res;
        props?.setInfectiousData([...infectiousDataCopy]);
      });
    }
  };

  useEffect(() => {
    // Scroll to the div if props.error is present
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (props.setErrorFocussedInput) {
      props.setErrorFocussedInput();
    }
  }, [props?.errorFocussedInput]);
  return (
    <div ref={divElement}>
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}
      <div id={props?.name} tabIndex={-1}></div>
      <div className={props?.sectionDisplayType}>
        <div className="d-flex flex-wrap">
          {props?.panels?.map(
            (panels: any) =>
              panels.isVisible && (
                <>
                  {panels?.testOptions && (
                    <div
                      className={`card mb-3 rounded border border-warning ${props?.displayType}`}
                    >
                      <div className="card-header min-h-35px d-flex justify-content-between align-items-center rounded bg-light-warning">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                          <h6 className="m-0">{panels?.panelName}</h6>
                        </div>
                      </div>
                      <div className="card-body py-md-4 py-3">
                        <div className="row gap-3">
                          {panels?.testOptions?.map((options: any) => (
                            <>
                              <Checkbox
                                spanClassName="mb-2 mr-2"
                                parentDivClassName="col-xl-12 col-lg-12 col-md-12 col-sm-12"
                                id={options?.testID}
                                label={options.testName}
                                testCode={options?.testCode}
                                checked={options?.isSelected}
                                onChange={(e: any) => {
                                  handleChange(
                                    options?.testID,
                                    options?.testCode,
                                    options?.testName,
                                    e.target.checked,
                                    panels
                                  );
                                }}
                                sectionName={props.sectionName}
                                sectionId={12}
                              />
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* //Group icd */}
                  {panels?.icD10Group &&
                    panels.icD10Group.map((options: any) => (
                      <div
                        className={`card shadow-sm mb-3 rounded border border-warning ${props?.displayType}`}
                        key={options?.icD10Id}
                      >
                        <div className="card-header min-h-35px d-flex justify-content-between align-items-center rounded bg-light-warning">
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <h6 className="m-0">{options.group}</h6>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <Checkbox
                              spanClassName="mb-2 mr-2"
                              parentDivClassName="col-xl-12 col-lg-12 col-md-12 col-sm-12"
                              id={options?.icD10Id}
                              label={options?.icD10Description}
                              testCode={options?.icD10Code}
                              checked={options?.isSelected}
                              onChange={(e: any) => {
                                handleChange(
                                  options?.icD10Id,
                                  options?.icD10Code,
                                  options?.icD10Description,
                                  e.target.checked,
                                  panels
                                );
                              }}
                              sectionName={props.sectionName}
                              sectionId={12}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelsCheckBox;
