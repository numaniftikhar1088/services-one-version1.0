import { useState, useRef, useEffect } from "react";
import DynamicFormInputs from "../../../Shared/DynamicFormInputs";
import GroupedSelect from "../../../Shared/GroupedSelect";
import { RepeatFields } from "../../../Utils/Common";
import RequisitionByFIdInsId from "./RequisitionByFIdInsId";
import { connect } from "react-redux";
import Icd10Section from "../../../Shared/Common/Input/Icd10Section";
import useLang from "Shared/hooks/useLanguage";
import FamilyHistory from "Shared/Common/Input/FamilyHistory";
const SectionComp = (props: any) => {
  const { t } = useLang();
  const [showhide, setshowhide] = useState<boolean>(true);
  const [apiCallCondition, setApCallCondition] = useState<boolean>(false);
  const [physicianId, setPhysicianId] = useState<any>("");
  const [showHideFields, setShowHideFields] = useState({});
  const ref = useRef<any>();
  const addFields = (Inputs: any, index: any, dependencyControls: any) => {
    props?.setIsShown(!props?.isShown);
    const modifiedInputs = RepeatFields(Inputs, index, dependencyControls);
    props?.setInputs(modifiedInputs);
  };
  const RemoveFields = (id: any, index: any) => {
    props?.setIsShown(!props?.isShown);
    let inputsCopy = [...props?.Inputs];
    let tobeTrimmedFiles = inputsCopy[props?.index].fields.filter(
      (items: any) => items?.searchID === undefined || items?.searchID !== id
    );
    inputsCopy[props?.index].fields = tobeTrimmedFiles;
    props?.setInputs(inputsCopy);
  };
  const handleApiCall = () => {
    setApCallCondition(!apiCallCondition);
  };

  useEffect(() => {
    window.addEventListener("storage", handleApiCall);
    return () => {
      window.removeEventListener("storage", handleApiCall);
    };
  }, [apiCallCondition]);

  return (
    <>
      <div className="shadow-xl card">
        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
          <h3 className="m-0 fs-15px d-flex">
            <div> {t(props?.Section?.sectionName)}</div>
            <span
              dangerouslySetInnerHTML={{
                __html: props?.Section?.cssStyle,
              }}
            ></span>
          </h3>
        </div>
        <div className="card-body py-md-4 py-3">
          <div className="row d-flex d-flex flex-column gap-3">
            {props?.Section?.sectionId === 24 &&
              props.infectiousData.length == 0 ? (
              <>
                {" "}
                <div className="alert alert-warning d-flex align-items-center p-5 w-100">
                  <span className="svg-icon svg-icon-2hx svg-icon-warning me-3">
                    <i className="fa fa-info-circle fs-1 text-warning"></i>
                  </span>
                  <div className="d-flex flex-column">
                    <span>
                      {t(
                        "Please select both a facility and insurance option to view the requisition details. These selections are mandatory to proceed. If no options are chosen, requisition information will remain hidden"
                      )}
                    </span>
                  </div>
                </div>
              </>
            ) : props?.Section?.sectionId === 24 &&
              props.infectiousData.length != 0 ? (
              <RequisitionByFIdInsId
                isShown={props?.isShown}
                formState={props?.formState}
                setFormState={props?.setFormState}
                setFormData={props?.setFormData}
                setIsShown={props.setIsShown}
                infectiousData={props.infectiousData}
                setInfectiousData={props.setInfectiousData}
                inputDataInputsForValidation={
                  props?.inputDataInputsForValidation
                }
                setInputs={props?.setInputs}
                focusOnInfectiousData={props?.focusOnInfectiousData}
                errorFocussedInput={props?.errorFocussedInput}
                index={props.index}
                FinalAppendedArray={props.FinalAppendedArray}
                finaliseArray={props.finaliseArray}
                setFinalizeArray={props.setFinalizeArray}
                LoadRequisitionSection={props.LoadRequisitionSection}
                ArrayReqId={props?.rid}
                physicianId={physicianId}
                setSelectedReqIds={props.setSelectedReqIds}
                selectedReqIds={props.selectedReqIds}
                inputValueForSpecimen={props.inputValueForSpecimen}
                setInputValueForSpecimen={props.setInputValueForSpecimen}
                checkbox={props.checkbox}
                setCheckbox={props.setCheckbox}
                noMedication={props.noMedication}
                setNoMedication={props.setNoMedication}
                SignPadValue={props.SignPadValue}
                setSignPadValue={props.setSignPadValue}
                showButton={props.showButton}
                setErrorFocussedInput={props.setErrorFocussedInput}
                noFamilyHistroy={props.noFamilyHistroy}
                setNoFamilyHistory={props.setNoFamilyHistory}
                noActiveMedication={props.noActiveMedication}
                setNoActiveMedication={props.setNoActiveMedication}
                IsSelectedByDefaultCompendiumData={
                  props.IsSelectedByDefaultCompendiumData
                }
                setIsSelectedByDefaultCompendiumData={
                  props.setIsSelectedByDefaultCompendiumData
                }
                setCheckReqType={props.setCheckReqType}
                validationBackup={props.validationBackup}
                setValidationBackup={props.setValidationBackup}
                screening={props.screening}
                setScreening={props.setScreening}
                onDateValidityChange={props.onDateValidityChange}
              />
            ) : null}
          </div>
          <div className="row d-flex">
            {props?.Section?.sectionId === 2 ? (
              <>
                <GroupedSelect
                  id={props?.id}
                  show={showhide}
                  fields={props?.Section?.fields}
                  dependenceyControls={props?.Section?.dependencyControls}
                  formData={props?.formData}
                  setFormData={props?.setFormData}
                  isShown={props.isShown}
                  setIsShown={props.setIsShown}
                  inputs={props?.Inputs}
                  setInputs={props?.setInputs}
                  index={props?.index}
                  fieldIndex={props?.fieldIndex}
                  errorFocussedInput={props?.errorFocussedInput}
                  defaultValue={props.defaultValue}
                  LoadRequisitionSection={props.LoadRequisitionSection}
                  setInfectiousData={props.setInfectiousData}
                  ArrayReqId={props?.rid}
                  physicianId={physicianId}
                  setPhysicianId={setPhysicianId}
                  props={props}
                  showButton={props.showButton}
                  setShowButton={props.setShowButton}
                  setErrorFocussedInput={props.setErrorFocussedInput}
                  setIsSelectedByDefaultCompendiumData={
                    props.setIsSelectedByDefaultCompendiumData
                  }
                />
              </>
            ) : props?.Section?.sectionId === 12 || props?.Section.sectionId === 119 ? (
              <>
                <Icd10Section
                  {...props}
                  apiCallCondition={apiCallCondition}
                  ArrayReqId={props?.rid}
                  infectiousData={props.infectiousData}
                  setInfectiousData={props.setInfectiousData}
                  sectionId={props?.Section?.sectionId}
                />
              </>
            ) : (
              props?.Section?.fields?.map(
                (field: any, index: number) =>
                  props?.Section?.sectionId != 53 && (
                    <>
                      <DynamicFormInputs
                        uiType={field?.uiType}
                        label={field?.displayFieldName}
                        length={field?.length}
                        disabled={field?.disabled}
                        defaultValue={field?.defaultValue ?? ""}
                        displayType={field?.displayType}
                        sectionDisplayType={props?.Section?.displayType}
                        visible={field?.visible}
                        required={field?.required}
                        RadioOptions={
                          field?.uiType === "RadioButton" ||
                            field?.uiType === "RadioButtonWithText" ||
                            field?.uiType === "RadioQuestion" ||
                            field?.uiType === "CheckBoxList" ||
                            field?.uiType === "italicizeCheckboxList" ||
                            field?.uiType === "DropDown" ||
                            field?.uiType === "ServerSideDynamicDropDown"
                            ? field?.options
                            : ""
                        }
                        panels={field?.panels ?? []}
                        fieldConfiguration={field?.fieldConfiguration}
                        specimenSources={field?.specimenSources ?? []}
                        formData={props?.formData}
                        setFormData={props?.setFormData}
                        formState={props?.formState}
                        setFormState={props?.setFormState}
                        index={props?.index}
                        fieldIndex={index}
                        Inputs={props?.Inputs}
                        setInputs={props?.setInputs}
                        sysytemFieldName={field?.systemFieldName ?? "undefined"}
                        setShowHideFields={setShowHideFields}
                        isDependent={false}
                        controlId={field?.controlId}
                        dependenceyControls={props?.Section?.dependencyControls}
                        RemoveFields={RemoveFields}
                        searchID={field?.searchID}
                        isDependency={false}
                        isShown={props.isShown}
                        setIsShown={props.setIsShown}
                        addFields={() =>
                          addFields(
                            props?.Inputs,
                            props?.index,
                            props?.Section?.dependencyControls
                          )
                        }
                        ref={ref}
                        removeUi={field?.removeUi ? field?.removeUi : false}
                        recursiveDependencyControls={
                          field?.showDep ? field?.dependencyControls : false
                        }
                        showRecursiveDep={
                          field?.showDep ? field?.showDep : false
                        }
                        section={props?.Section}
                        pageId={props?.pageId}
                        repeatFields={field?.repeatFields}
                        repeatDependencyControls={
                          field?.repeatDependencyControls
                        }
                        repeatFieldsState={field?.repeatFieldsState}
                        repeatDependencyControlsState={
                          field?.repeatDependencyControlsState
                        }
                        fieldLength={props?.Section?.fields}
                        sectionName={props?.Section?.sectionName}
                        field={field}
                        infectiousData={props.infectiousData}
                        setInfectiousData={props.setInfectiousData}
                        mask={field?.mask}
                        enableRule={field?.enableRule}
                        errorFocussedInput={props?.errorFocussedInput}
                        setInfectiousDataInputsForValidation={
                          props?.setInfectiousDataInputsForValidation
                        }
                        setInputsForValidation={props?.setInputsForValidation}
                        infectiousInputs={props?.infectiousInputs}
                        setCheck={props.setCheck}
                        ArrayReqId={props?.rid}
                        editId={props?.editID}
                        rname={props.rname}
                        sectionId={props?.Section?.sectionId}
                        finaliseArray={props.finaliseArray}
                        setFinalizeArray={props.setFinalizeArray}
                        FinalAppendedArray={props.FinalAppendedArray}
                        requisitionflow={"requisitionbilling"}
                        LoadRequisitionSection={props.LoadRequisitionSection}
                        physicianId={physicianId}
                        setPhysicianId={setPhysicianId}
                        setIns={props.setIns}
                        disableCheckbox={props.disableCheckbox}
                        setDisableCheckbox={props.setDisableCheckbox}
                        apiCallCondition={apiCallCondition}
                        inputValueForSpecimen={props.inputValueForSpecimen}
                        setInputValueForSpecimen={
                          props.setInputValueForSpecimen
                        }
                        checkbox={props.checkbox}
                        setCheckbox={props.setCheckbox}
                        showButton={props.showButton}
                        setShowButton={props.setShowButton}
                        validationBackup={props.validationBackup}
                        setValidationBackup={props.setValidationBackup}
                        disablessn={props.disablessn}
                        setDisableSSN={props.setDisableSSN}
                        noMedication={props.noMedication}
                        setNoMedication={props.setNoMedication}
                        SignPadValue={props.SignPadValue}
                        setSignPadValue={props.setSignPadValue}
                        fields={field}
                        setErrorFocussedInput={props.setErrorFocussedInput}
                        noFamilyHistroy={props.noFamilyHistroy}
                        setNoFamilyHistory={props.setNoFamilyHistory}
                        setSignPadVal={props.setSignPadVal}
                        noActiveMedication={props.noActiveMedication}
                        setNoActiveMedication={props.setNoActiveMedication}
                        IsSelectedByDefaultCompendiumData={
                          props.IsSelectedByDefaultCompendiumData
                        }
                        setIsSelectedByDefaultCompendiumData={
                          props.setIsSelectedByDefaultCompendiumData
                        }
                        screening={props.screening}
                        setScreening={props.setScreening}
                        onDateValidityChange={props.onDateValidityChange}

                      />
                    </>
                  )
              )
            )}
            <div className="col-12">
              {(props?.Section?.sectionId !== 5 && props?.Section?.sectionId !== 89) &&
                props?.Section?.dependencyControls?.map(
                  (options: any, depControlIndex: number) => (
                    <>
                      {options?.dependecyFields?.map(
                        (depfield: any, fieldIndex: number) => (
                          <>
                            <DynamicFormInputs
                              enableRule={depfield.enableRule}
                              sectionId={props?.Section?.sectionId}
                              uiType={depfield?.uiType}
                              label={depfield?.displayFieldName}
                              sysytemFieldName={depfield?.systemFieldName}
                              displayType={
                                depfield?.displayType +
                                " " +
                                options?.name +
                                " " +
                                options?.name +
                                options.optionID
                              }
                              visible={depfield?.visible}
                              required={depfield?.required}
                              RadioOptions={
                                depfield?.uiType === "RadioButton" ||
                                  depfield?.uiType === "RadioButtonWithText" ||
                                  depfield?.uiType === "RadioQuestion" || depfield?.uiType === "CheckBoxList" ||
                                  depfield?.uiType === "italicizeCheckboxList" ||
                                  depfield?.uiType === "DropDown" ||
                                  depfield?.uiType === "ServerSideDynamicDropDown"
                                  ? depfield?.options
                                  : ""
                              }
                              selectOpt={depfield?.options}
                              formData={props?.formData}
                              setFormData={props?.setFormData}
                              formState={props?.formState}
                              setFormState={props?.setFormState}
                              index={props?.index}
                              depControlIndex={depControlIndex}
                              fieldIndex={fieldIndex}
                              Inputs={props?.Inputs}
                              setInputs={props?.setInputs}
                              depOptionID={options.optionID}
                              setShowHideFields={setShowHideFields}
                              dependenceyControls={
                                props?.Section?.dependencyControls
                              }
                              depName={options?.name}
                              isDependent={true}
                              searchID={depfield?.searchID}
                              RemoveFields={RemoveFields}
                              dependencyAction={options?.dependecyAction}
                              isDependency={true}
                              isShown={props.isShown}
                              setIsShown={props.setIsShown}
                              addFields={addFields}
                              ref={ref}
                              depfield={depfield}
                              section={props?.Section}
                              pageId={props?.pageId}
                              sectionName={props?.Section?.sectionName}
                              defaultValue={depfield?.defaultValue ?? ""}
                              mask={depfield.mask}
                              errorFocussedInput={props?.errorFocussedInput}
                              setInfectiousDataInputsForValidation={
                                props?.InputsForValidation
                              }
                              setInputsForValidation={
                                props?.setInputsForValidation
                              }
                              infectiousInputs={props?.infectiousInputs}
                              finaliseArray={props.finaliseArray}
                              setFinalizeArray={props.setFinalizeArray}
                              FinalAppendedArray={props.FinalAppendedArray}
                              LoadRequisitionSection={
                                props.LoadRequisitionSection
                              }
                              ArrayReqId={props?.rid}
                              physicianId={physicianId}
                              setPhysicianId={setPhysicianId}
                              setIns={props.setIns}
                              disableCheckbox={props.disableCheckbox}
                              setDisableCheckbox={props.setDisableCheckbox}
                              apiCallCondition={apiCallCondition}
                              inputValueForSpecimen={
                                props.inputValueForSpecimen
                              }
                              setInputValueForSpecimen={
                                props.setInputValueForSpecimen
                              }
                              checkbox={props.checkbox}
                              setCheckbox={props.setCheckbox}
                              showButton={props.showButton}
                              setShowButton={props.setShowButton}
                              validationBackup={props.validationBackup}
                              setValidationBackup={props.setValidationBackup}
                              noMedication={props.noMedication}
                              setNoMedication={props.setNoMedication}
                              fields={depfield}
                              setErrorFocussedInput={
                                props.setErrorFocussedInput
                              }
                              noFamilyHistroy={props.noFamilyHistroy}
                              setNoFamilyHistory={props.setNoFamilyHistory}
                              noActiveMedication={props.noActiveMedication}
                              setNoActiveMedication={
                                props.setNoActiveMedication
                              }
                              infectiousData={props.infectiousData}
                              setIsSelectedByDefaultCompendiumData={
                                props.setIsSelectedByDefaultCompendiumData
                              }
                              screening={props.screening}
                              setScreening={props.setScreening}
                              onDateValidityChange={props.onDateValidityChange}

                            />
                          </>
                        )
                      )}
                    </>
                  )
                )}
            </div>
            <div className="row col-12">
              {props?.Section?.sectionId == 53 && (
                <FamilyHistory
                  {...props}
                  apiCallCondition={apiCallCondition}
                  ArrayReqId={props?.rid}
                  infectiousData={props.infectiousData}
                  setInfectiousData={props.setInfectiousData}
                  fieldIndex={props?.Section}
                  noFamilyHistroy={props.noFamilyHistroy}
                  setNoFamilyHistory={props.setNoFamilyHistory}
                  validationBackup={props.validationBackup}
                  setValidationBackup={props.setValidationBackup}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
function mapStateToProps(state: any, ownProps: any) {
  return { Requisition: state };
}
export default connect(mapStateToProps)(SectionComp);
