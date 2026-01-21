import { Chip } from "@mui/material";
import { t } from "i18next";
import { isJson } from "Utils/Common/Requisition";
import ShowFiles from "./ShowFiles";
import ChooseFileUpload from "./ChooseFile";

export const showFieldValue = (fieldsInfo: any, props?: any) => {
  let {
    displayFieldName: key,
    defaultValue: value,
    options,
    previewDisplayType: displayType,
    systemFieldName,
    visible,
  } = fieldsInfo;

  // Parse JSON if applicable
  if (isJson(value)) {
    value = JSON.parse(value);
  }
  console.log(fieldsInfo, value, "fieldsInfo in show field value");
  // Return null if the field is not visible
  if (!visible) return null;

  const showDepRepeatFields = (
    Inputs: any,
    index: any,
    id: any,
    name: any,
    fieldIndex?: any,
    controlId?: any
  ) => {
    if (!Inputs.length || !id || name === "" || !controlId) return false;

    const clonedArray = JSON.parse(JSON.stringify(Inputs));

    let filterDepControls = clonedArray[index]?.fields[
      fieldIndex
    ]?.repeatDependencyControls.find(
      (item: any) => item?.optionID == id && item?.name == name
    );

    const action = filterDepControls?.dependencyAction?.toLowerCase() ?? "";

    clonedArray[index]?.fields[fieldIndex]?.repeatFields.forEach(
      (controlField: any) => {
        const depFound = filterDepControls?.dependecyFields.find(
          (depField: any) => depField?.controlId == controlField?.controlId
        );

        controlField.visible =
          (depFound && action === "show") ||
          controlField.controlId === controlId;
      }
    );

    return clonedArray;
  };

  // Handle specific systemFieldName 'BillingType'
  let billingTypeId = null;
  if (systemFieldName === "BillingType" && Array.isArray(options)) {
    billingTypeId = options.find((option: any) => option.value === value)?.id;
  }

  // Only set display if the BillingTypeId or other conditions change
  if (billingTypeId) {
    const depRepeatField = showDepRepeatFields(
      props?.displayData,
      props?.sectionIndex,
      billingTypeId,
      fieldsInfo.systemFieldName,
      props?.fieldIndex,
      fieldsInfo.controlId
    );
    if (depRepeatField && !areFieldsEqual(depRepeatField, props?.displayData)) {
      props?.setDisplay(depRepeatField);
    }
  }

  // JSX rendering logic
  switch (true) {
    case key && value && displayType:
      return (
        <div className={displayType}>
          {Array.isArray(value)
            ? value.map((items) => (
                <>
                  <span className="fw-bold">{items.label}</span>
                  <span>{items.value}</span>
                </>
              ))
            : value}
        </div>
      );

    case fieldsInfo.systemFieldName === "DrugAllergyDescription":
      return (
        <div className={displayType} style={{ display: "flex", gap: 3 }}>
          {Array.isArray(value)
            ? value.map((items) => <Chip label={items} />)
            : value}
        </div>
      );

    case fieldsInfo.uiType === "File":
      return (
        <div className={`${displayType} d-flex justify-content-between`}>
          <span className="fw-bold">{key}</span>
          <div className="gap-2">
            {value.map((fileObj: any) => (
              <ShowFiles fileObj={fileObj} />
            ))}
          </div>
        </div>
      );

    case fieldsInfo.uiType === "ChooseFile":
      return (
        <div className={`${displayType} order-3`}>
          <ChooseFileUpload data={fieldsInfo} loadData={props.loadData} />
        </div>
      );

    default:
      return systemFieldName === "RepeatStart" ? (
        <div className="mb-2">
          <hr />
        </div>
      ) : (
        <div
          className={`${displayType} d-flex justify-content-between align-items-center`}
        >
          <div className="fw-bold">{t(key)}</div>
          <div className="d-flex gap-2 flex-wrap">
            {Array.isArray(value)
              ? value.map((items) => (
                  <span className="badge badge-secondary round-3">
                    {items?.value}
                  </span>
                ))
              : value}
          </div>
        </div>
      );
  }
};

// Helper function to compare previous and current display data (to prevent infinite loop)
const areFieldsEqual = (newFields: any, oldFields: any) => {
  return JSON.stringify(newFields) === JSON.stringify(oldFields);
};
