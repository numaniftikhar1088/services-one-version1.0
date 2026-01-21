import { genUniqueId } from "../Utils/Common";
import PermissionComponent from "./Common/Permissions/PermissionComponent";
import DynamicFormInputs from "./DynamicFormInputs";
import { useBilling } from "./hooks/useBilling";
import useLang from "./hooks/useLanguage";
import { CrossIcon } from "./Icons";
import { FindIndex } from "Utils/Common/CommonMethods";

const RepeatInputs = (props: any) => {
  const { t } = useLang();
  const { removeBillingInfo } = useBilling();
  const addFields = (index: number, Inputs: any, fieldIndex: number) => {
    let inputsCopy = JSON.parse(JSON.stringify(Inputs));
    let copyRepeatField = JSON.parse(
      JSON.stringify(inputsCopy[index].fields[fieldIndex])
    );
    let id = genUniqueId();
    copyRepeatField.id = id;
    copyRepeatField?.repeatDependencyControls?.forEach(
      (_: any, depindex: number, arrayItself: any) => {
        arrayItself[depindex].dependecyFields.forEach(
          (_: any, DepFieldindex: number, arrayItselDepFields: any) => {
            // removing 'Client Bill and Self Pay' ticket > 86eqn2frz
            if (arrayItself[depindex]?.systemFieldName === "BillingType") {
              arrayItself[depindex]?.options?.map(
                (fieldOption: any, fieldIndex: number) => {
                  if (fieldOption?.id === 41 || fieldOption?.id === 24) {
                    delete arrayItself[depindex]?.options?.[fieldIndex];
                  }
                }
              );
            }

            if (
              arrayItselDepFields[DepFieldindex]?.displayType.includes("d-none")
            ) {
              // return;
            } else {
              arrayItselDepFields[DepFieldindex].displayType =
                arrayItselDepFields[DepFieldindex].displayType + " " + "d-none";
            }
          }
        );
      }
    );
    copyRepeatField.repeatFields.forEach(
      (_: any, repeatfieldIndex: number, arrayItself: any) => {
        // removing 'Client Bill and Self Pay' ticket > 86eqn2frz

        if (arrayItself[repeatfieldIndex]?.systemFieldName === "BillingType") {
          arrayItself[repeatfieldIndex]?.options?.map(
            (fieldOption: any, fieldIndex: number) => {
              if (fieldOption?.id === 41 || fieldOption?.id === 24) {
                delete arrayItself[repeatfieldIndex]?.options?.[fieldIndex];
              }
            }
          );
        }
        if (
          arrayItself[repeatfieldIndex]?.systemFieldName ===
          "NoSecondaryInsurance"
        ) {
          arrayItself.splice(repeatfieldIndex, 1);
        }
        if (
          arrayItself[repeatfieldIndex]?.systemFieldName ===
          "RelationshipToInsured"
        ) {
          arrayItself[repeatfieldIndex].selectedText = "";
          arrayItself[repeatfieldIndex]?.options?.forEach((i: any) => {
            if (i) {
              i.isSelectedDefault = false;
            }
          });
        }
        if (
          arrayItself[repeatfieldIndex]?.systemFieldName === "SubscriberDOB" ||
          arrayItself[repeatfieldIndex]?.systemFieldName === "SubscriberName"
        ) {
          arrayItself[repeatfieldIndex].validationExpression = "";
        }
        if (
          arrayItself[repeatfieldIndex]?.systemFieldName === "BillingType" &&
          props.reqId
        ) {
          arrayItself[repeatfieldIndex]?.options?.forEach((i: any) => {
            if (i) {
              i.isSelectedDefault = false;
            }
          });
        }

        if (arrayItself[repeatfieldIndex]?.displayType?.includes("d-none")) {
          let removeDisplayNone = arrayItself[
            repeatfieldIndex
          ]?.displayType.replace("d-none", " ");
          arrayItself[repeatfieldIndex].displayType = removeDisplayNone;
        }
      }
    );
    copyRepeatField.repeatFields?.forEach((repeatFieldInfo: any) => {
      repeatFieldInfo.defaultValue = "";
    });
    var json = JSON.stringify(copyRepeatField);
    var newCopyWithOutRef = JSON.parse(json);
    inputsCopy[index].fields.splice(fieldIndex + 1, 0, newCopyWithOutRef);
    //props?.setInputs(inputsCopy);
    if (props.ArrayReqId) {
      const infectiousDataCopy = [...props?.infectiousData];
      infectiousDataCopy[
        FindIndex(infectiousDataCopy, props.ArrayReqId)
      ].sections = inputsCopy;
      props?.setInfectiousData &&
        props?.setInfectiousData([...infectiousDataCopy]);
    } else {
      props?.setInputs(inputsCopy);
    }
    if (fieldIndex > 0) {
      copyRepeatField.repeatFields.shift();
    }
  };
  const fields = props.Inputs[props.index].fields;
  const repeatIndexes = fields.reduce((indexes: any, item: any, idx: any) => {
    if (item?.uiType === "Repeat") {
      indexes.push(idx);
    }
    return indexes;
  }, []);

  const removeFields = (billingInfoSectionid: number, fieldsId: number) => {
    removeBillingInfo(props.fieldIndex);
    let inputsCopy = [...props.Inputs];
    inputsCopy[fieldsId].fields.splice(billingInfoSectionid, 1);
    if (props.ArrayReqId) {
      const infectiousDataCopy = [...props?.infectiousData];
      infectiousDataCopy[
        FindIndex(infectiousDataCopy, props.ArrayReqId)
      ].sections = inputsCopy;
      props?.setInfectiousData &&
        props?.setInfectiousData([...infectiousDataCopy]);
    } else {
      props?.setInputs && props?.setInputs(inputsCopy);
    }
  };
  return (
    <>
      <span
        className={
          props.fieldIndex == repeatIndexes[0]
            ? "d-none"
            : "d-flex justify-content-end"
        }
      >
        <span
          onClick={() => {
            if (props?.repeatControlLength == 2) {
              props.setDisableCheckbox && props.setDisableCheckbox(false);
            }
            removeFields(props?.fieldIndex, props?.index);
          }}
        >
          <CrossIcon className="fs-2hx text-gray-700 bi bi-x cursor-pointer" />
        </span>
      </span>
      {props.fieldIndex === repeatIndexes[0] &&
        props.requisitionflow !== "requisitionbilling" ? (
        <hr />
      ) : null}

      {props?.repeatFields?.map((field: any, index: number) => (
        <>
          <DynamicFormInputs
            uiType={field?.uiType}
            removeUi={field?.removeUi ? field?.removeUi : false}
            label={field?.displayFieldName}
            displayType={field?.displayType}
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
            formData={props?.formData}
            setFormData={props?.setFormData}
            selectOpt={field?.options}
            formState={props?.formState}
            setFormState={props?.setFormState}
            index={props?.index}
            fieldIndex={props?.fieldIndex}
            repeatFieldIndex={index}
            Inputs={props?.Inputs}
            setInputs={props?.setInputs}
            sysytemFieldName={field?.systemFieldName}
            isDependent={false}
            dependenceyControls={props?.Section?.dependenceyControls}
            repeatFields={field?.repeatFields}
            searchID={field?.searchID}
            isShown={props.isShown}
            setIsShown={props.setIsShown}
            repeatInputs={true}
            pageId={props?.pageId}
            repeatFieldSection={true}
            sectionName={props?.sectionName}
            defaultValue={field?.defaultValue ?? ""}
            infectiousData={props.infectiousData}
            setInfectiousData={props.setInfectiousData}
            enableRule={field?.enableRule}
            controlId={field?.controlId}
            mask={field?.mask}
            errorFocussedInput={props?.errorFocussedInput}
            field={field}
            reqId={props.reqId}
            setIns={props.setIns}
            disableCheckbox={props.disableCheckbox}
            setDisableCheckbox={props.setDisableCheckbox}
            patientId={props.patientId}
            checkbox={props.checkbox}
            setCheckbox={props.setCheckbox}
            showButton={props.showButton}
            setShowButton={props.setShowButton}
            fields={field}
            ArrayReqId={props.ArrayReqId}
            setErrorFocussedInput={props.setErrorFocussedInput}
            infectiousInputs={props?.infectiousInputs}
          />
        </>
      ))}
      {props?.repeatDependencyControls?.map(
        (options: any, repeatDependencySectionIndex: number) => (
          <>
            {options?.dependecyFields?.map(
              (depfield: any, repeatDepFieldIndex: number) => (
                <>
                  <DynamicFormInputs
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
                    formData={props?.formData}
                    setFormData={props?.setFormData}
                    formState={props?.formState}
                    setFormState={props?.setFormState}
                    index={props?.index}
                    repeatDependencySectionIndex={repeatDependencySectionIndex}
                    repeatDepFieldIndex={repeatDepFieldIndex}
                    fieldIndex={props?.fieldIndex}
                    Inputs={props?.Inputs}
                    setInputs={props?.setInputs}
                    depOptionID={options.optionID}
                    dependenceyControls={props?.Section?.dependenceyControls}
                    isDependent={true}
                    searchID={depfield?.searchID}
                    dependencyAction={options?.dependecyAction}
                    isShown={props.isShown}
                    setIsShown={props.setIsShown}
                    depfield={depfield}
                    repeatInputs={true}
                    pageId={props?.pageId}
                    sectionName={props?.sectionName}
                    repeatFieldSection={true}
                    isDependencyRepeatFields={true}
                    defaultValue={depfield?.defaultValue ?? ""}
                    setInfectiousData={props.setInfectiousData}
                    enableRule={depfield.enableRule}
                    mask={depfield?.mask}
                    errorFocussedInput={props?.errorFocussedInput}
                    reqId={props.reqId}
                    setIns={props.setIns}
                    disableCheckbox={props.disableCheckbox}
                    setDisableCheckbox={props.setDisableCheckbox}
                    patientId={props.patientId}
                    checkbox={props.checkbox}
                    setCheckbox={props.setCheckbox}
                    showButton={props.showButton}
                    setShowButton={props.setShowButton}
                    fields={depfield}
                    ArrayReqId={props.ArrayReqId}
                    setErrorFocussedInput={props.setErrorFocussedInput}
                    infectiousInputs={props?.infectiousInputs}
                  />
                </>
              )
            )}
          </>
        )
      )}
      <div className="col-12">
        <hr />
        {props.showButton && !props.ArrayReqId && (
          <PermissionComponent
            moduleName="Requisition"
            pageName="New Order"
            permissionIdentifier="AddAnotherinsurance"
          >
            <button
              onClick={(e: any) => {
                addFields(props?.index, props?.Inputs, props?.fieldIndex);
                props.setCheckbox(false);
                props.setIns(false);
                props.setDisableCheckbox(true);
              }}
              disabled={props.ArrayReqId ? false : props.checkbox}
              className={`${props.fieldIndex == repeatIndexes[repeatIndexes.length - 1]
                ? ""
                : "d-none"
                } btn btn-info`}
            >
              <i style={{ fontSize: "16px" }} className="fa">
                &#xf067;
              </i>
              {props.Inputs[props?.index].fields[props?.fieldIndex]?.mask
                ? t(props.Inputs[props?.index].fields[props?.fieldIndex]?.mask)
                : t("Add Another")}
            </button>
          </PermissionComponent>
        )}
        {props.ArrayReqId && (
          <PermissionComponent
            moduleName="Requisition"
            pageName="New Order"
            permissionIdentifier="AddAnotherinsurance"
          >
            <button
              onClick={(e: any) => {
                addFields(props?.index, props?.Inputs, props?.fieldIndex);
                props.setCheckbox(false);
                if (props.setIns) {
                  props.setIns(false);
                }
                if (props.setDisableCheckbox) {
                  props.setDisableCheckbox(true);
                }
              }}
              disabled={props.ArrayReqId ? false : props.checkbox}
              className={`${props.fieldIndex == repeatIndexes[repeatIndexes.length - 1]
                ? ""
                : "d-none"
                } btn btn-info`}
              id={props?.Inputs[props?.index].fields[props?.fieldIndex]?.mask
                .split(" ")
                .join("")}
            >
              <i style={{ fontSize: "16px" }} className="fa">
                &#xf067;
              </i>
              {props.Inputs[props?.index].fields[props?.fieldIndex]?.mask
                ? t(props.Inputs[props?.index].fields[props?.fieldIndex]?.mask)
                : t("Add Another")}
            </button>
          </PermissionComponent>
        )}
      </div>
    </>
  );
};

export default RepeatInputs;
