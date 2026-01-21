import { useRef, useState } from "react";
import { connect } from "react-redux";
import DynamicFormInputs from "../../../Shared/DynamicFormInputs";
import { RepeatFields } from "../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";

const SectionComp = (props: any) => {
  const { t } = useLang()
  const ref = useRef<any>();
  const [physicianId, setPhysicianId] = useState<any>("");

  const addFields = (Inputs: any, index: any, dependencyControls: any) => {
    props?.setIsShown(!props?.isShown);
    const modifiedInputs = RepeatFields(Inputs, index, dependencyControls);
    props?.setInputs(modifiedInputs);
  };

  const RemoveFields = (id: any) => {
    props?.setIsShown(!props?.isShown);
    let inputsCopy = [...props?.Inputs];
    let tobeTrimmedFiles = inputsCopy[props?.index].fields.filter(
      (items: any) => items?.searchID === undefined || items?.searchID !== id
    );
    inputsCopy[props?.index].fields = tobeTrimmedFiles;
    props?.setInputs(inputsCopy);
  };

  return (
    <>
      <div className="shadow card">
        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
          <h3 className="m-0 fs-15px">{t(props?.Section?.sectionName)}</h3>
        </div>
        <div className="card-body py-md-4 py-3">
          <div className="row d-flex">
            {props?.Section?.fields?.map((field: any, index: number) => (
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
                  field?.uiType === "CheckBoxList" ||
                  field?.uiType === "DropDown" ||
                  field?.uiType === "MultiSelect"
                    ? field?.options
                    : ""
                }
                panels={field?.panels ?? []}
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
                showRecursiveDep={field?.showDep ? field?.showDep : false}
                section={props?.Section}
                pageId={props?.pageId}
                repeatFields={field?.repeatFields}
                repeatDependencyControls={field?.repeatDependencyControls}
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
                disableCheckbox={props.disableCheckbox}
                setDisableCheckbox={props.setDisableCheckbox}
                setIns={props.setIns}
                patientId={props.patientId}
                showButton={props.showButton}
                setShowButton={props.setShowButton}
                checkbox={props.checkbox}
                setCheckbox={props.setCheckbox}
                fields={field}
                setErrorFocussedInput={props.setErrorFocussedInput}
              />
            ))}
            <div className="row col-12">
              {props?.Section?.sectionId !== 5 &&
                props?.Section?.dependencyControls?.map(
                  (options: any, depControlIndex: number) => (
                    <>
                      {options?.dependecyFields?.map(
                        (depfield: any, fieldIndex: number) => (
                          <>
                            <DynamicFormInputs
                              enableRule={depfield.enableRule}
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
                                depfield?.uiType === "RadioButton"
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
                                props?.setInfectiousDataInputsForValidation
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
                              physicianChange={props?.physicianChange}
                              showButton={props.showButton}
                              setShowButton={props.setShowButton}
                              checkbox={props.checkbox}
                              setCheckbox={props.setCheckbox}
                              fields={depfield}
                              setErrorFocussedInput={
                                props.setErrorFocussedInput
                              }
                            />
                          </>
                        )
                      )}
                    </>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
function mapStateToProps(state: any) {
  return { Requisition: state };
}

export default connect(mapStateToProps)(SectionComp);
