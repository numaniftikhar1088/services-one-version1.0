import { useEffect, useState } from "react";
import { FindIndex } from "Utils/Common/CommonMethods";
import { assignFormValues } from "../Utils/Auth";
import {
  getICDPanelsIndex,
  getToxCompendiumIndex,
  getToxTestingOption,
  panelsArrMakerToSend,
} from "../Utils/Common/Requisition";
import MuiSkeleton from "./Common/MuiSkeleton";
import useLang from "./hooks/useLanguage";

const ToxTestingOptionCheckbox = (props: any) => {
  const { t } = useLang()
  const [panelsArrToSend, setPanelsArrToSend] = useState<any>([]);
  const [finalizeArray, setFinalizeArray] = useState<any>([]);
  const [inputName, setInputNames] = useState<any>([]);
  useEffect(() => {
    const selectedDefaultNames = props?.Inputs[props?.index]?.fields[props?.fieldIndex]?.options
      ?.filter((opt: any) => opt?.isSelectedDefault === true)
      .map((opt: any) => opt.name);

    let inputsCopy = JSON?.parse(JSON?.stringify(props?.Inputs));
    let toxtestingoptionindex = getToxTestingOption(inputsCopy);
    let compendiumIndex = getToxCompendiumIndex(
      props?.Inputs[toxtestingoptionindex]?.fields
    );
    let updatedFinalizeArray = [...finalizeArray];
    props.Inputs[props?.index]?.fields?.forEach((i: any) => {
      if (i.systemFieldName === "Compendium") {
        i?.panels?.forEach((j: any, index: any) => {
          if (j.isVisible) {
            if (selectedDefaultNames.includes(j.panelType)) {
              const panelsArr = panelsArrMakerToSend(
                index,
                props?.Inputs[toxtestingoptionindex]?.fields[compendiumIndex]
                  ?.panels[index],
                panelsArrToSend,
                true
              );
              panelsArr.forEach((panel: any) => {
                if (
                  !updatedFinalizeArray.some(
                    (p: any) => p.panelID === panel.panelID
                  )
                ) {
                  updatedFinalizeArray.push(panel);
                }
              });
              j.isSelected = true;
              j.testOptions?.forEach((k: any) => {
                k.isSelected = true;
              });
            }
          }
        });
      }
    });
    let newInputs = assignFormValues(
      props.Inputs,
      toxtestingoptionindex,
      props?.depControlIndex,
      compendiumIndex,
      updatedFinalizeArray,
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
  }, []);

  const handleChange = (e: any) => {
    let inputNameCopy = [...inputName];
    if (e.target.checked) {
      if (!inputNameCopy.includes(e.target.name)) {
        inputNameCopy.push(e.target.name);
      }
    } else {
      inputNameCopy = inputNameCopy.filter((name) => name !== e.target.name);
    }

    let inputsCopy = JSON?.parse(JSON?.stringify(props?.Inputs));
    let toxtestingoptionindex = getToxTestingOption(inputsCopy);
    let ICDPanelIndex = getICDPanelsIndex(inputsCopy);
    let compendiumIndex = getToxCompendiumIndex(
      props?.Inputs[toxtestingoptionindex]?.fields
    );
    let updatedFinalizeArray = [...finalizeArray];
    props?.Inputs[toxtestingoptionindex]?.fields?.forEach((i: any) => {
      if (i.systemFieldName === "Compendium") {
        i?.panels?.forEach((j: any, index: any) => {
          if (j.isVisible) {
            if (j.panelType === e.target.name) {
              if (e.target.checked) {
                const panelsArr = panelsArrMakerToSend(
                  index,
                  props?.Inputs[toxtestingoptionindex]?.fields[compendiumIndex]
                    ?.panels[index],
                  panelsArrToSend,
                  e.target.checked
                );
                panelsArr.forEach((panel: any) => {
                  if (
                    !updatedFinalizeArray.some(
                      (p: any) => p.panelID === panel.panelID
                    )
                  ) {
                    updatedFinalizeArray.push(panel);
                  }
                });
                j.isSelected = true;
                j.testOptions.forEach((k: any) => {
                  k.isSelected = true;
                });
              } else {
                updatedFinalizeArray = updatedFinalizeArray.filter(
                  (panel: any) => panel.panelType !== e.target.name
                );

                j.isSelected = false;
                j.testOptions.forEach((k: any) => {
                  k.isSelected = false;
                });
              }
            }
          }
        });
      }
    });
    props?.Inputs[ICDPanelIndex]?.fields?.forEach((i: any) => {
      if (i?.systemFieldName === "ICDPanels") {
        i?.panels?.forEach((j: any) => {

          if (j?.panelName?.toLowerCase() === e?.target?.value?.toLowerCase()) {
            j.isVisible = e.target.checked;
          }
        })
      }
    })

    let newInputs = assignFormValues(
      props.Inputs,
      toxtestingoptionindex,
      props?.depControlIndex,
      compendiumIndex,
      updatedFinalizeArray,
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
    setInputNames(inputNameCopy);
    setFinalizeArray(updatedFinalizeArray);
    setPanelsArrToSend(updatedFinalizeArray);
  };

  return (
    <div
      className={
        props?.parentDivClassName
          ? `${props?.parentDivClassName} mb-4`
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
    >
      <div className="row d-flex">
        {props?.Inputs[props?.index]?.fields[props?.fieldIndex]?.options.map(
          (i: any) =>
            i?.isVisable && (
              <div className="col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3 mb-4">
                <div className="form__group form__group--checkbox">
                  <label
                    className={
                      props?.labelClassName
                        ? `${props?.labelClassName} fw-500 `
                        : "form-check form-check-inline form-check-solid m-0 fw-500"
                    }
                  >
                    <input
                      className="form-check-input h-20px w-20px"
                      type="checkbox"
                      id={i?.id}
                      name={i?.name}
                      value={i?.value}
                      onChange={handleChange}
                      defaultChecked={i?.isSelectedDefault}
                      disabled={props.screening && i?.name === "Screening" ? true : false}
                    />
                    {props?.loading ? (
                      <MuiSkeleton height={22} />
                    ) : (
                      <span
                        className={
                          props?.spanClassName
                            ? `${props?.spanClassName} text-break fw-400`
                            : ""
                        }
                      >
                        {i?.name}
                      </span>
                    )}
                  </label>
                  {props.error && (
                    <div className="form__error">{t(props.error)}</div>
                  )}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default ToxTestingOptionCheckbox;
