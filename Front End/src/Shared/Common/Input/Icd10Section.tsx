import { useEffect, useState } from 'react';
import { isJson } from 'Utils/Common/Requisition';
import DynamicFormInputs from 'Shared/DynamicFormInputs';
import useLang from 'Shared/hooks/useLanguage';
const Icd10Section = (props: any) => {
  const { t } = useLang();
  const [diagnosisCode, setDiagnosisCode] = useState<any>([]);
  useEffect(() => {
    convertPrefilledIcdDataToJson();
  }, []);
  const PanelIndex = props?.Inputs[props?.index]?.fields.findIndex(
    (icdPanelsInfo: any) => icdPanelsInfo?.systemFieldName === 'ICDPanels' || icdPanelsInfo?.systemFieldName === "ComorbidityPanels"
  );
  const convertPrefilledIcdDataToJson = () => {
    const fieldIndex = props?.Inputs[props?.index]?.fields.findIndex(
      (icdPanelsInfo: any) => icdPanelsInfo?.systemFieldName === 'ICDPanels'
    );
    const defaultVal =
      props?.Inputs[props?.index]?.fields[fieldIndex]?.defaultValue;
    const result = isJson(defaultVal);
    let parsedIcd10Codes = defaultVal;
    if (result) {
      parsedIcd10Codes = JSON?.parse(defaultVal);
    }

    if (Array?.isArray(parsedIcd10Codes)) {
      setDiagnosisCode([...parsedIcd10Codes]);
    }
  };
  const removeDiagnosisCode = (Code: string, item: any) => {
    const diagnosisCodeArrCopy = [...diagnosisCode];
    const filteredDiagnosisCodeArrCopy = diagnosisCodeArrCopy.filter(
      (fit: any) => !(fit?.Code === Code && fit.panelID === item.panelID)
    );
    setDiagnosisCode(filteredDiagnosisCodeArrCopy);
    let inputsCopy: any;
    if (props?.Inputs) {
      inputsCopy = [...props.Inputs];
    }

    const index = props?.index;

    if (index !== undefined) {
      const icdPanelIndex = inputsCopy[index]?.fields?.findIndex(
        (elem: any) => elem?.systemFieldName === 'ICDPanels' || elem?.systemFieldName === "ComorbidityPanels"
      );

      if (icdPanelIndex === -1) return; // no ICDPanels found

      let defaultVal = inputsCopy[index].fields[icdPanelIndex]?.defaultValue;

      //  If defaultVal is a JSON string - parse it
      if (typeof defaultVal === 'string') {
        try {
          defaultVal = JSON.parse(defaultVal);
        } catch (err) {
          console.error('Invalid JSON in defaultValue:', defaultVal, err);
          defaultVal = [];
        }
      }

      if (Array.isArray(defaultVal)) {
        const filtered = defaultVal.filter(
          (icdData: any) =>
            !(icdData.Code === Code && icdData.panelID === item.panelID)
        );

        props.Inputs[index].fields.forEach((element: any) => {
          if (element.systemFieldName === 'ICDPanels') {
            element.panels.forEach((el: any) => {
              el.testOptions.forEach((testOption: any) => {
                if (testOption.testCode === Code) {
                  testOption.isSelected = false;
                }
              });
              if (el.panelID === item.panelID) {
                el.testOptions.forEach((testOption: any) => {
                  if (testOption.testCode === Code) {
                    testOption.isSelected = false;
                  }
                });
                el.icD10Group.forEach((icd10Group: any) => {
                  if (icd10Group.icD10Code === Code) {
                    icd10Group.isSelected = false;
                  }
                });
              }
            });
          }
          if (element.systemFieldName === 'ComorbidityPanels') {
            element.panels.forEach((el: any) => {
              el.testOptions.forEach((testOption: any) => {
                if (testOption.testCode === Code) {
                  testOption.isSelected = false;
                }
              });
              if (el.panelID === item.panelID) {
                el.testOptions.forEach((testOption: any) => {
                  if (testOption.testCode === Code) {
                    testOption.isSelected = false;
                  }
                });
                if (el.comorbidityGroup) {
                  el.comorbidityGroup.forEach((comorbidityGroup: any) => {
                    if (comorbidityGroup.comorbidityCode === Code) {
                      comorbidityGroup.isSelected = false;
                    }
                  });
                }
              }
            });
          }
        });

        //  Assign back the filtered array
        props.Inputs[index].fields[icdPanelIndex].defaultValue = filtered;

        //  If array is now empty - reset all options
        if (filtered.length === 0) {
          props.Inputs[index].fields.forEach((element: any) => {
            if (element.systemFieldName === 'ICDPanels') {
              element.panels.forEach((el: any) => {
                el.testOptions.forEach((testOption: any) => {
                  testOption.isSelected = false;
                });
                el.icD10Group?.forEach((icd10Group: any) => {
                  icd10Group.isSelected = false;
                });
              });
            }
            if (element.systemFieldName === 'ComorbidityPanels') {
              element.panels.forEach((el: any) => {
                el.testOptions.forEach((testOption: any) => {
                  testOption.isSelected = false;
                });
                el.comorbidityGroup?.forEach((comorbidityGroup: any) => {
                  comorbidityGroup.isSelected = false;
                });
              });
            }
          });
        }
      } else {
        // fallback: not an array - clear options
        props.Inputs[index].fields[icdPanelIndex].defaultValue = [];
        props.Inputs[index].fields.forEach((element: any) => {
          if (element.systemFieldName === 'ICDPanels') {
            element.panels.forEach((el: any) => {
              el.testOptions.forEach((testOption: any) => {
                testOption.isSelected = false;
              });
              el.icD10Group?.forEach((icd10Group: any) => {
                icd10Group.isSelected = false;
              });
            });
          }
          if (element.systemFieldName === 'ComorbidityPanels') {
            element.panels.forEach((el: any) => {
              el.testOptions.forEach((testOption: any) => {
                testOption.isSelected = false;
              });
              el.comorbidityGroup?.forEach((comorbidityGroup: any) => {
                comorbidityGroup.isSelected = false;
              });
            });
          }
        });
      }
    }
  };
  const parseDefaultValue = (value: any) => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) || [];
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return [];
      }
    }

    // Return an empty array for any other case (e.g., undefined or object)
    return [];
  };

  return (
    <>
      {props?.Section?.fields.map((field: any, index: number) => (
        <>
          <DynamicFormInputs
            uiType={field?.uiType}
            label={field?.displayFieldName}
            disabled={field.disabled}
            defaultValue={field?.defaultValue ?? ''}
            displayType={field?.displayType}
            sectionDisplayType={props?.Section?.displayType}
            visible={field?.visible}
            required={field?.required}
            RadioOptions={
              field?.uiType === 'RadioButton' ||
                field?.uiType === 'CheckBoxList' ||
                field?.uiType === 'DropDown'
                ? field?.options
                : ''
            }
            panels={field?.panels ?? []}
            formData={props?.formData}
            setFormData={props?.setFormData}
            formState={props?.formState}
            setFormState={props?.setFormState}
            index={props?.index}
            fieldIndex={index}
            Inputs={props?.Inputs}
            setInputs={props?.setInputs}
            sysytemFieldName={field?.systemFieldName ?? 'undefined'}
            isDependent={false}
            controlId={field?.controlId}
            dependenceyControls={props?.Section?.dependencyControls}
            searchID={field?.searchID}
            isDependency={false}
            isShown={props.isShown}
            setIsShown={props.setIsShown}
            removeUi={field?.removeUi ? field?.removeUi : false}
            recursiveDependencyControls={
              field?.showDep ? field?.dependencyControls : false
            }
            showRecursiveDep={field?.showDep ? field?.showDep : false}
            section={props?.Section}
            pageId={props?.pageId}
            repeatFields={field?.repeatFields}
            repeatDependencyControls={field?.repeatDependencyControls}
            repeatFieldsState={field?.repeatFieldsState}
            repeatDependencyControlsState={field?.repeatDependencyControlsState}
            fieldLength={props?.Section?.fields}
            sectionName={props?.Section?.sectionName}
            field={field}
            infectiousData={props.infectiousData}
            setInfectiousData={props.setInfectiousData}
            mask={field.mask}
            enableRule={field.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            setInfectiousDataInputsForValidation={
              props?.setInfectiousDataInputsForValidation
            }
            setInputsForValidation={props?.setInputsForValidation}
            ArrayReqId={props.ArrayReqId}
          />
        </>
      ))}
      <div className=" col-xxl-6 col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <h6 className="text-primary mb-3">{t(props.sectionId === 119 ? 'Comorbidity Code(s)' : 'Diagnosis Code(s)')}</h6>
        <div className="table_bordered overflow-hidden table-responsive">
          <table
            className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0 css-rqglhn-MuiTable-root"
            id="Icd 10 codes"
          >
            <thead className="rounded bg-secondary mt-2 mb-2 h-35px z-index-3">
              <tr>
                <th className="text-muted min-w-75px w-75px">{t('Actions')}</th>
                <th className="text-muted min-w-125px w-125px">
                  {t('Codes')}
                </th>
                <th className="text-muted min-w-300px">{t('Description')}</th>
              </tr>
            </thead>
            <tbody>
              {props?.Inputs[props?.index]?.fields[PanelIndex]?.defaultValue &&
                parseDefaultValue(
                  props.Inputs[props.index]?.fields[PanelIndex]?.defaultValue
                )?.map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="text-center">
                      <button
                        className="btn btn-icon btn-danger h-30px w-30px rounded"
                        onClick={() => {
                          removeDiagnosisCode(item?.Code, item);
                        }}
                      >
                        <i className="bi bi-x fs-1"></i>
                      </button>
                    </td>
                    <td>{t(item.Code)}</td>
                    <td>{t(item.Description)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Icd10Section;