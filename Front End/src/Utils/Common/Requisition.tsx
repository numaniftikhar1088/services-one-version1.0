import * as yup from "yup";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import UserManagementService from "../../Services/UserManagement/UserManagementService";
import { GetSingleElementFromArray } from "./CommonMethods";
import moment from "moment";

export const showDepRepeatFields = (
  Inputs: any,
  index: any,
  id: any,
  name: any,
  fieldIndex?: any,
  controlId?: any
) => {
  const clonedArray = JSON.parse(JSON.stringify(Inputs));
  if (!id || !name) return clonedArray;

  let filterDepControls = clonedArray[index]?.fields[
    fieldIndex
  ].repeatDependencyControls.find(
    (item: any) => item?.optionID == id && item?.name == name
  );

  if (filterDepControls) {
    let action: string = filterDepControls?.dependencyAction ?? "";
    clonedArray[index]?.fields[fieldIndex].repeatFields.forEach(
      (controlField: any) => {
        var depfound = filterDepControls?.dependecyFields.find(
          (depField: any) => depField?.controlId == controlField?.controlId
        );

        if (
          (depfound && (action ?? "").toLowerCase() == "show") ||
          controlField.controlId == controlId
        ) {
          controlField.visible = true;
        } else {
          controlField.visible = false;
        }
      }
    );
  }
  return clonedArray;
};

//////show dep
const showFieldsRep = (
  clonedArray: any,
  index: number,
  id: string,
  name: string,
  fieldIndex?: any,
  depfield?: any,
  controlId?: any
) => {
  /// New |updateds
  let controlDataIDArr: any = [];

  let filterDepControls = clonedArray[index]?.fields[
    fieldIndex
  ].repeatDependencyControls.find(
    (item: any) => item?.optionID == id && item?.name == name
    // && item?.dependencyAction == "show"
  );
  let action: string = filterDepControls.dependencyAction ?? "";
  clonedArray[index]?.fields[fieldIndex].repeatFields.forEach(
    (controlField: any) => {
      var depfound = filterDepControls?.dependecyFields.find(
        (depField: any) => depField?.controlId == controlField?.controlId
      );

      if (
        (depfound && (action ?? "").toLowerCase() == "show") ||
        controlField.controlId == controlId
      )
        controlField.displayType = controlField.displayType.replace(
          "d-none",
          ""
        );
      else controlField.displayType = controlField.displayType + " d-none";
    }
  );

  /// New updates end

  // let filterFieldsControls = clonedArray[index]?.fields[
  //   fieldIndex
  // ].repeatFields.filter(
  //   (item: any) =>
  //     item?.optionID == id &&
  //     item?.name == name &&
  //     item?.dependencyAction == "show"
  //     &&
  //     item?.controlId == controlId
  // );

  // filterDepControls.forEach(
  //   (element: any, depindex: number, arrayItself: any) => {
  //     arrayItself[depindex].dependecyFields.forEach(
  //       (element: any, DepFieldindex: number, arrayItselDepFields: any) => {
  //         let removeDisplayNone = arrayItselDepFields[
  //           DepFieldindex
  //         ].displayType.replace("d-none", "");
  //         controlDataIDArr.push(element?.controlDataID);
  //         arrayItselDepFields[DepFieldindex].displayType = removeDisplayNone;
  //         clonedArray[index].fields?.forEach((item: any) => {
  //           if (
  //             controlDataIDArr.includes(item?.controlDataID) &&
  //             item.id == id
  //           ) {
  //             item.displayType = item.displayType.replace("d-none", "");
  //           }
  //         });

  //         var selectedValue = arrayItselDepFields[DepFieldindex].defaultValue;
  //         arrayItselDepFields[DepFieldindex]?.options?.forEach(
  //           (element: any, Optindex: number, arrayItself: any) => {
  //             var optionValue =
  //               arrayItselDepFields[DepFieldindex]?.options[Optindex]?.value;
  //             if (optionValue == selectedValue) {
  //               var optionId =
  //                 arrayItselDepFields[DepFieldindex]?.options[Optindex]?.id;
  //               var optionName =
  //                 arrayItselDepFields[DepFieldindex]?.options[Optindex]?.name;
  //               showFieldsRep(clonedArray, index, optionId, optionName);
  //             }
  //           }
  //         );
  //       }
  //     );
  //   }
  // );
};
//////
/////hide deps
const hideFields = (
  clonedArray: any,
  index: number,
  id: string,
  name: string,
  fieldIndex?: any
) => {
  let controlDataIDArr: any = [];
  let filterDepControlsHide = clonedArray[index]?.fields[
    fieldIndex
  ]?.repeatDependencyControls.filter(
    (item: any) => item?.optionID != id && item?.name == name
    // ||      (item?.optionID != id && item?.name != name)
  );

  filterDepControlsHide?.forEach(
    (element: any, depindex: number, arrayItself: any) => {
      arrayItself[depindex].dependecyFields.forEach(
        (element: any, DepFieldindex: number, arrayItselDepFields: any) => {
          if (
            arrayItselDepFields[DepFieldindex]?.displayType.includes("d-none")
          ) {
            // return;
          } else {
            arrayItselDepFields[DepFieldindex].displayType =
              arrayItselDepFields[DepFieldindex].displayType + " " + "d-none";
          }

          //    var selectedValue = arrayItselDepFields[DepFieldindex].defaultValue;
          arrayItselDepFields[DepFieldindex]?.options?.forEach(
            (element: any, Optindex: number, arrayItself: any) => {
              //  var optionValue =
              //    arrayItselDepFields[DepFieldindex]?.options[Optindex]?.value;
              // if (optionValue == selectedValue) {
              var optionId =
                arrayItselDepFields[DepFieldindex]?.options[Optindex]?.id;
              var optionName =
                arrayItselDepFields[DepFieldindex]?.options[Optindex]?.name;
              hideFields(clonedArray, index, optionId, optionName);
              // }
            }
          );
        }
      );
    }
  );
  ///////////with depaction hide
  const getDepFields = clonedArray[index].fields[fieldIndex];
  const getDepControls =
    clonedArray[index].fields[fieldIndex]?.repeatDependencyControls;

  let filterDepControlsWithHideDepAction = getDepControls?.filter(
    (item: any) =>
      item?.optionID == id &&
      item?.name == name &&
      item?.dependencyAction == "hide"
  );

  //
  filterDepControlsWithHideDepAction?.forEach(
    (elementZ: any, i: number, arrayItself: any) => {
      arrayItself[i]?.dependecyFields?.forEach(
        (element: any, i: number, arrayItselDepFields: any) => {
          controlDataIDArr.push(element?.controlDataID);
        }
      );
      getDepFields?.repeatFields?.forEach((item: any) => {
        if (controlDataIDArr.includes(item?.controlDataID)) {
          item.displayType = item.displayType + " " + "d-none";
        }
      });
    }
  );

  ///////////with depaction hide
};
function findCollectorIdIndex(
  arr: any[],
  sectionId: number,
  systemFieldName: string
) {
  const section = arr.find((section) => section.sectionId === sectionId);
  if (section) {
    return section.fields.findIndex(
      (field: any) => field.systemFieldName === systemFieldName
    );
  }
  return -1;
}
function findSectionIndex(arr: any[], sectionId: number) {
  return arr.findIndex((section) => section.sectionId === sectionId);
}
const emptyOptions = {
  value: "0",
  label: "N/A",
};
export const collectorNameOptionsAdd = (
  Inputs: any,
  selectedFacility: string,
  collectorList: any
) => {
  let inputsCopy = [...Inputs];
  if (collectorList.length === 0) {
    inputsCopy[findSectionIndex(inputsCopy, 4)].fields[
      findCollectorIdIndex(inputsCopy, 4, "CollectorID")
    ].defaultValue = 0;
    inputsCopy[findSectionIndex(inputsCopy, 4)].fields[
      findCollectorIdIndex(inputsCopy, 4, "CollectorID")
    ].options = emptyOptions;
  }
  if (collectorList.length > 0) {
    inputsCopy[findSectionIndex(inputsCopy, 4)].fields[
      findCollectorIdIndex(inputsCopy, 4, "CollectorID")
    ].options = collectorList;
  }
  return inputsCopy;
};

export const FacilityAdd = (Inputs: any, facilityList: any) => {
  let inputsCopy = [...Inputs];

  inputsCopy[findSectionIndex(inputsCopy, 2)].fields[
    findCollectorIdIndex(inputsCopy, 2, "FacilityID")
  ].options = facilityList;
  return inputsCopy;
};

export const loadRequsitionFormInputs = async (requsitionMenuId: string) => {
  try {
    let response = await UserManagementService?.GetSystemFields(
      requsitionMenuId
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const arrayStrTurnOver = (
  defaultValue: string,
  currentInputValue: string
) => {
  let splittedArr = defaultValue.split(",");
  let filteredSplittedArr = splittedArr.filter(
    (splittedArrayData: any) => splittedArrayData !== currentInputValue
  );
  let filteredSplittedArrToCommaSeperatedStr = filteredSplittedArr.toString();
  return filteredSplittedArrToCommaSeperatedStr;
};

export const commaSeperatedStrSlice = (requsitionInfo: any) => {
  let splittedArr = requsitionInfo.split(",");
  let getSplittedArrObj = {
    requsitionId: splittedArr[0],
    requisitionName: splittedArr[1],
  };
  return getSplittedArrObj;
};
export const destructCommaSeperatedStrSlice = (str: any) => {
  if (!str.includes(",")) return str;
  let extractionFromObject = commaSeperatedStrSlice(str);
  let extractedValueFromObject = extractionFromObject.requisitionName;
  return extractedValueFromObject;
};
export const panelsArrMakerToSend = (
  index: number,
  panels: any,
  panelsArrToAppendCopy: any,
  checked: boolean
) => {
  let panelsDataToAppend = panels;
  panelsDataToAppend?.testOptions?.forEach((panelsDataToAppendInfo: any) => {
    panelsDataToAppendInfo.isSelected = checked;
  });
  panelsArrToAppendCopy = [...panelsArrToAppendCopy, panelsDataToAppend];
  return panelsArrToAppendCopy;
};
export const panelsArrMakerToSend2 = (
  index: number,
  panels: any,
  checked: boolean
) => {
  let panelsArrToAppendCopy: any = [];
  let panelsDataToAppend = panels;
  panelsDataToAppend?.testOptions?.forEach((panelsDataToAppendInfo: any) => {
    panelsDataToAppendInfo.isSelected = checked;
  });
  panelsArrToAppendCopy = [...panelsArrToAppendCopy, panelsDataToAppend];
  return panelsArrToAppendCopy;
};
export const panelsArrItemRemoval = (
  panelID: number,
  panelsArrToAppendCopy: any
) => {
  let panelsArrToAppendCopyWithRemovedItem = panelsArrToAppendCopy.filter(
    (panelsArrToAppendCopyInfo: any) =>
      panelsArrToAppendCopyInfo.panelID !== panelID
  );
  return panelsArrToAppendCopyWithRemovedItem;
};

export const panelsArrItemAddChild = (
  index: any,
  parentPanelName: any,
  checkedTestOptions: any,
  panelsArrToAppendCopy: any,
  panelsCopy: any
) => {
  let selectedParentPanelIndex;
  if (panelsArrToAppendCopy.length > 0) {
    selectedParentPanelIndex = panelsArrToAppendCopy.findIndex(
      (panelsArrToAppendCopyData: any) =>
        panelsArrToAppendCopyData.panelName === parentPanelName
    );
  }
  let selectedPanel = panelsCopy[index];
  let selectedPanelCopy = JSON.parse(JSON.stringify(selectedPanel));
  let selectedTestoptions = selectedPanel.testOptions.filter(
    (selectedTestOpt: any) => selectedTestOpt?.isSelected
  );
  selectedPanelCopy.testOptions = selectedTestoptions;
  if (selectedParentPanelIndex > 0 || selectedParentPanelIndex == 0) {
    panelsArrToAppendCopy[selectedParentPanelIndex] = selectedPanelCopy;
  }
  if (selectedParentPanelIndex < 0) {
    panelsArrToAppendCopy = [...panelsArrToAppendCopy, selectedPanelCopy];
  }
  if (selectedParentPanelIndex === undefined) {
    panelsArrToAppendCopy = [...panelsArrToAppendCopy, selectedPanelCopy];
  }

  return panelsArrToAppendCopy;
};
export const panelsArrItemRemovalChild = (
  index: number,
  testID: string,
  panelsArrToAppendCopy: any
) => {
  let testOptionsWithRemovedItem = panelsArrToAppendCopy[
    index
  ]?.testOptions?.filter(
    (testOptionsInfo: any) => testOptionsInfo.testID !== testID
  );

  let check = panelsArrToAppendCopy[index];
  if (check) {
    panelsArrToAppendCopy[index].isSelected = false;
    panelsArrToAppendCopy[index].testOptions = testOptionsWithRemovedItem;
  }

  return panelsArrToAppendCopy;
};

export const typeCheckForFieldValue = (fieldValue: any) => {
  let objectKeysLength = Object.keys(fieldValue).length;
  if (objectKeysLength === 2) {
    return <span className="d-flex">{fieldValue?.label}</span>;
  }
  if (objectKeysLength === 4 && Array.isArray(fieldValue?.testOptions)) {
    return (
      <div className="d-flex">
        <h6>{fieldValue?.panelName}</h6>
        {Array.isArray(fieldValue?.testOptions) &&
          fieldValue?.testOptions.map((testOptions: any) => (
            <span>{testOptions?.testName}</span>
          ))}
      </div>
    );
  } else if (
    objectKeysLength === 3 &&
    !Array.isArray(fieldValue?.testOptions)
  ) {
    return (
      <div className="d-flex">
        <span>{fieldValue?.Code}</span>:<span>{fieldValue?.Description}</span>
      </div>
    );
  } else return "";
};

export const getDataForRequsitionLoad = (inputsResponseCopy: any) => {
  let obj: any = {
    facilityId: "",
    insuranceTypeId: "",
    insuranceDataId: ""
  };
  const facilitySection = GetSingleElementFromArray(
    inputsResponseCopy,
    (item: any) => {
      return (
        item.sectionName == "Facility Test" || item.sectionName == "Facility"
      );
    }
  );
  const faclityControl = GetSingleElementFromArray(
    facilitySection.fields,
    (item: any) => {
      return item.systemFieldName == "FacilityID";
    }
  );
  obj.facilityId = parseInt(faclityControl?.defaultValue) || 0;

  const billingSection = GetSingleElementFromArray(
    inputsResponseCopy,
    (item: any) => {
      return (
        item.sectionName == "Billing Information" ||
        item.sectionName == "Billing"
      );
    }
  );
  const repeatFieldControl = GetSingleElementFromArray(
    billingSection.fields,
    (item: any) => {
      return item.uiType == "Repeat";
    }
  );
  const billingTypeControl = GetSingleElementFromArray(
    repeatFieldControl.repeatFields,
    (item: any) => {
      return (
        item.systemFieldName == "BillingType" ||
        item.systemFieldName == "billingType"
      );
    }
  );
  const SellectedBillingOption = GetSingleElementFromArray(
    billingTypeControl.options,
    (item: any) => {
      return item.isSelectedDefault == true;
    }
  );

  obj.insuranceTypeId = parseInt(SellectedBillingOption?.id) || 0;
  obj.insuranceDataId = parseInt(SellectedBillingOption?.optionDataID) || 0

  // let filterInputsArrToGetFacilitySection = inputsResponseCopy.filter(
  //   (InputsData: any) => InputsData.sectionName === "Facility"
  // );
  // let filterInputsArrToGetBillingInformationSection = inputsResponseCopy.filter(
  //   (InputsData: any) => InputsData.sectionName === "Billing Information"
  // );
  // obj.facilityId = parseInt(
  //   filterInputsArrToGetFacilitySection[0].fields[0].defaultValue
  // );
  // let insurantypeId =
  //   filterInputsArrToGetBillingInformationSection[0]?.fields[0]?.repeatFields[0]?.options?.filter(
  //     (optionsInfo: any) => optionsInfo.isSelectedDefault
  //   );
  // let integerInsuranceId = parseInt(insurantypeId[0].id);
  // obj.insuranceTypeId = integerInsuranceId;
  return obj;
};
export const extractDropDownSelectedValue = (
  fields: any,
  fieldToFilter: string
) => {
  let facilityFilteredDataForEdit = fields?.find(
    (facilityInfo: any) => facilityInfo?.systemFieldName == fieldToFilter
  );

  let id = facilityFilteredDataForEdit?.defaultValue;
  let selectedFacilityInfoArray = facilityFilteredDataForEdit?.options?.find(
    (faciltyInfo: any) => faciltyInfo?.value == id
  );

  return selectedFacilityInfoArray;
};

// export const setDropDownValue = (
//   options: any,
//   selectedValue: any,
//   uiType?: string
// ) => {
//   if (uiType === "ServerSideDynamicDropDown" && selectedValue) {
//     // handleServerSideDropdownOnChange()
//   }
//   let obj = { value: "0", label: "N/A" };

//   if (selectedValue === 0 || !selectedValue) {
//     return obj;
//   } else {
//     if (!options) return;
//     let selectedDropDownValue = options?.find(
//       (optionsInfo: any) => optionsInfo?.value == selectedValue
//     );
//     return selectedDropDownValue;
//   }
// };
export const setDropDownValue = (
  options: any[],
  selectedValue: any,
  reqId: any
) => {
  if (!selectedValue && !reqId) {
    return [];
  }
  if (!Array.isArray(options) && !reqId) {
    return [];
  }
  if (!Array.isArray(options) && reqId) {
    return [{ value: "N/A", label: "N/A" }];
  }
  const selectedDropDownValue = options.find(
    (option) => option?.value === selectedValue
  );
  return selectedDropDownValue || { value: "N/A", label: "N/A" };
};

export const getLengthFromArray = (array: any[], condition: any) => {
  return array.filter(condition).length;
};
export const getItemFromArray = (array: any[], condition: any) => {
  return array.find(condition);
};
export const getItemsFromArray = (array: any[], condition: any) => {
  return array.filter(condition);
};
export const camelize = (str: string) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match: any, index: any) => {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};
const lowerize = (obj: any) =>
  Object.keys(obj).reduce((acc: any, k: any) => {
    acc[k.toLowerCase()] = obj[k];
    return acc;
  }, {});

// export const setPatientValues = async (
//   patientData: any,
//   Inputs: any,
//   setInputs: any,
//   loadReqSec: any,
//   setDisableCheckbox?: any
// ) => {
//   localStorage.setItem("insurnceID", patientData.Insurances[0]?.insuranceID);
//   if (patientData.Insurances.length > 1) {
//     setDisableCheckbox(true);
//   } else {
//     setDisableCheckbox(false);
//   }
//   console.log(patientData, "patientData");
//   // Lowercase all keys in patientData
//   patientData = lowerize(patientData);
//   // Deep copy of the Inputs array
//   let inputsCopy = JSON.parse(JSON.stringify(Inputs));
//   // Find the index for "Patient" section
//   let patientIndex = inputsCopy.findIndex(
//     (item: any) => item?.sectionName === "Patient"
//   );
//   // Set default values for the "Patient" section fields
//   inputsCopy[patientIndex].fields.forEach((fieldsData: any) => {
//     fieldsData.defaultValue =
//       patientData[fieldsData.systemFieldName.toLowerCase()];
//   });
//   // Find the index for "Billing Information" section
//   let billingIndex = inputsCopy.findIndex(
//     (item: any) => item?.sectionName === "Billing Information"
//   );

//   // Insurance data and repeat field control checks
//   let insuranceDataLength = patientData.insurances.length;
//   let RepeatFieldsLength = getLengthFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );
//   let repeatstartControl = getItemFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );
//   let allRepeatStartControls = getItemsFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );
//   let allControlsToRemove = allRepeatStartControls.length;
//   // Ensure enough repeat start controls for all insurances
//   while (allRepeatStartControls.length < insuranceDataLength) {
//     allRepeatStartControls.push(JSON.parse(JSON.stringify(repeatstartControl)));
//   }
//   // Set default values for each insurance
//   for (let insIndex = 0; insIndex < insuranceDataLength; insIndex++) {
//     const insElement = lowerize(patientData.insurances[insIndex]);
//     allRepeatStartControls[insIndex].repeatFields.forEach((fieldData: any) => {
//       fieldData.defaultValue =
//         insElement[camelize(fieldData.systemFieldName.toLowerCase())];
//       let depFieldsOption = getItemFromArray(
//         allRepeatStartControls[insIndex].repeatDependencyControls,
//         (item: any) =>
//           item?.value?.toString().toLowerCase() ==
//           fieldData?.defaultValue?.toString().toLowerCase()
//       );
//       if (depFieldsOption) {
//         var action = depFieldsOption.dependencyAction;
//         // localStorage.setItem("insurnceID", depFieldsOption.optionID);
//         allRepeatStartControls[insIndex].repeatFields.forEach(
//           (fieldData: any) => {
//             var depfound = getItemFromArray(
//               depFieldsOption.dependecyFields,
//               (Item: any) => Item.controlId == fieldData.controlId
//             );
//             if (depfound && (action ?? "")?.toLowerCase() === "show") {
//               fieldData.visible = true;
//             } else {
//               fieldData.visible = false;
//             }
//             if (fieldData.controlId === 44) {
//               fieldData.visible = true;
//             }
//             if (fieldData.controlId === 45 && fieldData.defaultValue) {
//               fieldData.visible = true;
//             }
//           }
//         );
//       }
//     });
//   }
//   // Separate repeat and non-repeat fields, then combine them back
//   let AllControlsWithoutRepeat = getItemsFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId !== 33
//   );

//   inputsCopy[billingIndex].fields = [];
//   allRepeatStartControls.forEach((item: any) =>
//     inputsCopy[billingIndex].fields.push(item)
//   );
//   AllControlsWithoutRepeat.forEach((item: any) =>
//     inputsCopy[billingIndex].fields.push(item)
//   );
//   // Update state and then load required sections
//   setInputs(inputsCopy);
//   // Use a slight delay to ensure setInputs is processed before calling loadReqSec
//   setTimeout(() => {
//     loadReqSec();
//   }, 0);
// };
const getInsuranceType = (inputs: any, id: any): any => {
  // Loop through inputs
  for (const item of inputs) {
    // Check if sectionId is 5
    if (item.sectionId === 5) {
      // Loop through fields
      for (const field of item.fields) {
        // Check if the field's displayFieldName is "Repeat Start"
        if (field.displayFieldName === "Repeat Start") {
          // Loop through repeatFields
          for (const i of field.repeatFields) {
            // Check if systemFieldName is "BillingType"
            if (i.systemFieldName === "BillingType") {
              // Loop through options
              for (const j of i.options) {
                // Check if optionDataID matches the given id

                if (j.optionDataID == id) {
                  return j;
                }
              }
            }
          }
        }
      }
    }
  }

  // Return null if no match is found
  return null;
};
export const setPatientValues = async (
  patientData: any,
  Inputs: any,
  setInputs: any,
  loadReqSec: any,
  setDisableCheckbox?: any,
  setCheckbox?: any,
  setIns?: any,
  setShowButton?: any,
  setDisableSSN?: any
) => {


  // Lowercase all keys in patientData
  patientData = lowerize(patientData);

  // Deep copy of the Inputs array
  let inputsCopy = JSON.parse(JSON.stringify(Inputs));

  // Set Patient section values
  let patientIndex = inputsCopy.findIndex((item: any) => item?.sectionId === 3);
  inputsCopy[patientIndex].fields.forEach((fieldsData: any) => {
    fieldsData.defaultValue =
      patientData[fieldsData.systemFieldName.toLowerCase()];
  });


  const hasInsurance =
    Array.isArray(patientData.insurances) &&
    patientData.insurances.some((ins: any) =>
      ins && Object.values(ins).some(val => val !== null && val !== "")
    );

  if (hasInsurance) {

    const obj = getInsuranceType(Inputs, patientData.insurances[0]?.insuranceID);
    localStorage.setItem("insurnceID", obj.id);
    localStorage.setItem(
      "insuranceOptionId",
      patientData.insurances[0]?.insuranceID
    );
    localStorage.setItem("patientID", patientData.patientid);

    if (
      patientData.insurances[0].billingType === "Client Bill" ||
      patientData.insurances[0].billingType === "Self Pay"
    ) {
      patientData.Insurances = [patientData.insurances[0]];
      setIns?.(true);
      setDisableCheckbox?.(true);
      setShowButton?.(false);
      setCheckbox?.(true);
    } else {
      setDisableCheckbox?.(false);
      setShowButton?.(true);
      setIns?.(false);
      setCheckbox?.(false);
    }

    // Handle insurance fields logic (same logic as before)
    let billingIndex = inputsCopy.findIndex((item: any) => item?.sectionId === 5);
    let insuranceDataLength = patientData.insurances.length;
    let RepeatFieldsLength = getLengthFromArray(
      inputsCopy[billingIndex].fields,
      (item: any) => item.uiTypeId === 33
    );
    let repeatstartControl = getItemFromArray(
      inputsCopy[billingIndex].fields,
      (item: any) => item.uiTypeId === 33
    );
    let allRepeatStartControls = getItemsFromArray(
      inputsCopy[billingIndex].fields,
      (item: any) => item.uiTypeId === 33
    );

    inputsCopy[billingIndex].fields = inputsCopy[billingIndex].fields.filter(
      (item: any) => item.uiTypeId !== 33
    );

    while (allRepeatStartControls.length < insuranceDataLength) {
      allRepeatStartControls.push(JSON.parse(JSON.stringify(repeatstartControl)));
    }

    if (allRepeatStartControls.length > insuranceDataLength) {
      allRepeatStartControls = allRepeatStartControls.slice(0, insuranceDataLength);
    }

    for (let insIndex = 0; insIndex < insuranceDataLength; insIndex++) {
      const insElement = lowerize(patientData.insurances[insIndex]);
      allRepeatStartControls[insIndex].repeatFields.forEach((fieldData: any) => {
        fieldData.defaultValue =
          insElement[camelize(fieldData.systemFieldName.toLowerCase())];

        let depFieldsOption = getItemFromArray(
          allRepeatStartControls[insIndex].repeatDependencyControls,
          (item: any) =>
            item?.value?.toString().toLowerCase() ==
            fieldData?.defaultValue?.toString().toLowerCase()
        );

        if (depFieldsOption) {
          var action = depFieldsOption.dependencyAction;
          allRepeatStartControls[insIndex].repeatFields.forEach((fieldData: any) => {
            var depfound = getItemFromArray(
              depFieldsOption.dependecyFields,
              (Item: any) => Item.controlId == fieldData.controlId
            );
            if (depfound && (action ?? "")?.toLowerCase() === "show") {
              fieldData.visible = true;
            } else {
              fieldData.visible = false;
            }
            if (fieldData.controlId === 44) {
              fieldData.visible = true;
            }
            if (fieldData.controlId === 45 && fieldData.defaultValue) {
              fieldData.visible = true;
            }
          });
        }
      });
    }

    let AllControlsWithoutRepeat = getItemsFromArray(
      inputsCopy[billingIndex].fields,
      (item: any) => item.uiTypeId !== 33
    );

    inputsCopy[billingIndex].fields = [];
    allRepeatStartControls.forEach((item: any) =>
      inputsCopy[billingIndex].fields.push(item)
    );
    AllControlsWithoutRepeat.forEach((item: any) =>
      inputsCopy[billingIndex].fields.push(item)
    );

    inputsCopy[billingIndex].fields.forEach((item: any, index: number) => {
      if (index !== 0 && item.displayFieldName === "Repeat Start") {
        item.repeatFields.forEach((rep: any) => {
          if (rep.systemFieldName === "BillingType") {
            rep.options = rep.options.filter(
              (option: any) =>
                option.value !== "Client Bill" && option.value !== "Self Pay"
            );
          }
        });
      }
    });
  }

  // Update state
  setInputs(inputsCopy);

  // Ensure inputs are set before loading required sections
  setTimeout(() => {
    loadReqSec();
  }, 0);
};
// export const setPatientValues = async (
//   patientData: any,
//   Inputs: any,
//   setInputs: any,
//   loadReqSec: any,
//   setDisableCheckbox?: any,
//   setCheckbox?: any,
//   setIns?: any,
//   setShowButton?: any,
//   setDisableSSN?: any
// ) => {
//   console.log(patientData.Insurances, "patientData");
//   const obj = getInsuranceType(Inputs, patientData.Insurances[0]?.insuranceID);
//   localStorage.setItem("insurnceID", obj.id);
//   localStorage.setItem(
//     "insuranceOptionId",
//     patientData.Insurances[0]?.insuranceID
//   );
//   if (
//     patientData.Insurances[0].billingType === "Client Bill" ||
//     patientData.Insurances[0].billingType === "Self Pay"
//   ) {
//     // Keep only the first insurance in the array
//     patientData.Insurances = [patientData.Insurances[0]];
//     setIns(true);
//     setDisableCheckbox(true);
//     setShowButton(false);
//     setCheckbox(true);
//   } else {
//     setDisableCheckbox(false);
//     setShowButton(true);
//     setIns(false);
//     setCheckbox(false);
//   }
//   // Lowercase all keys in patientData
//   patientData = lowerize(patientData);
//   // Deep copy of the Inputs array
//   let inputsCopy = JSON.parse(JSON.stringify(Inputs));
//   // Find the index for "Patient" section
//   let patientIndex = inputsCopy.findIndex((item: any) => item?.sectionId === 3);
//   // Set default values for the "Patient" section fields
//   inputsCopy[patientIndex].fields.forEach((fieldsData: any) => {
//     fieldsData.defaultValue =
//       patientData[fieldsData.systemFieldName.toLowerCase()];
//   });
//   // Find the index for "Billing Information" section
//   let billingIndex = inputsCopy.findIndex((item: any) => item?.sectionId === 5);
//   // Insurance data and repeat field control checks
//   let insuranceDataLength = patientData.insurances.length;
//   let RepeatFieldsLength = getLengthFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );
//   let repeatstartControl = getItemFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );
//   let allRepeatStartControls = getItemsFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );

//   // Clear all previous repeat controls from the Billing Information fields
//   inputsCopy[billingIndex].fields = inputsCopy[billingIndex].fields.filter(
//     (item: any) => item.uiTypeId !== 33
//   );

//   // Ensure enough repeat start controls for all insurances
//   while (allRepeatStartControls.length < insuranceDataLength) {
//     allRepeatStartControls.push(JSON.parse(JSON.stringify(repeatstartControl)));
//   }

//   // Truncate extra repeat controls if new patient has fewer insurances
//   if (allRepeatStartControls.length > insuranceDataLength) {
//     allRepeatStartControls = allRepeatStartControls.slice(
//       0,
//       insuranceDataLength
//     );
//   }

//   // Set default values for each insurance
//   for (let insIndex = 0; insIndex < insuranceDataLength; insIndex++) {
//     const insElement = lowerize(patientData.insurances[insIndex]);
//     allRepeatStartControls[insIndex].repeatFields.forEach((fieldData: any) => {
//       fieldData.defaultValue =
//         insElement[camelize(fieldData.systemFieldName.toLowerCase())];

//       let depFieldsOption = getItemFromArray(
//         allRepeatStartControls[insIndex].repeatDependencyControls,
//         (item: any) =>
//           item?.value?.toString().toLowerCase() ==
//           fieldData?.defaultValue?.toString().toLowerCase()
//       );

//       if (depFieldsOption) {
//         var action = depFieldsOption.dependencyAction;

//         allRepeatStartControls[insIndex].repeatFields.forEach(
//           (fieldData: any) => {
//             var depfound = getItemFromArray(
//               depFieldsOption.dependecyFields,
//               (Item: any) => Item.controlId == fieldData.controlId
//             );
//             if (depfound && (action ?? "")?.toLowerCase() === "show") {
//               fieldData.visible = true;
//             } else {
//               fieldData.visible = false;
//             }
//             if (fieldData.controlId === 44) {
//               fieldData.visible = true;
//             }
//             if (fieldData.controlId === 45 && fieldData.defaultValue) {
//               fieldData.visible = true;
//             }
//           }
//         );
//       }
//     });
//   }

//   // Separate repeat and non-repeat fields, then combine them back
//   let AllControlsWithoutRepeat = getItemsFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId !== 33
//   );

//   inputsCopy[billingIndex].fields = [];
//   allRepeatStartControls.forEach((item: any) =>
//     inputsCopy[billingIndex].fields.push(item)
//   );
//   AllControlsWithoutRepeat.forEach((item: any) =>
//     inputsCopy[billingIndex].fields.push(item)
//   );

//   inputsCopy[billingIndex].fields.forEach((item: any, index: number) => {
//     if (index !== 0 && item.displayFieldName === "Repeat Start") {
//       item.repeatFields.forEach((rep: any) => {
//         if (rep.systemFieldName === "BillingType") {
//           rep.options = rep.options.filter(
//             (option: any) =>
//               option.value !== "Client Bill" && option.value !== "Self Pay"
//           );
//         }
//       });
//     }
//   });
//   // Update state and then load required sections
//   setInputs(inputsCopy);

//   // Use a slight delay to ensure setInputs is processed before calling loadReqSec
//   setTimeout(() => {
//     loadReqSec();
//   }, 0);
// };

// export const setPatientValues = async (
//   patientData: any,
//   Inputs: any,
//   setInputs: any,
//   loadReqSec: any,
//   setDisableCheckbox?: any,
//   setCheckbox?: any,
//   setIns?: any,
//   setShowButton?: any,
//   setDisableSSN?: any
// ) => {
//   debugger;
//   const obj = getInsuranceType(Inputs, patientData.Insurances[0]?.insuranceID);
//   localStorage.setItem("insurnceID", obj.id);
//   localStorage.setItem(
//     "insuranceOptionId",
//     patientData.Insurances[0]?.insuranceID
//   );
//   if (
//     patientData.Insurances[0].billingType === "Client Bill" ||
//     patientData.Insurances[0].billingType === "Self Pay"
//   ) {
//     // Keep only the first insurance in the array
//     patientData.Insurances = [patientData.Insurances[0]];
//     setIns(true);
//     setDisableCheckbox(true);
//     setShowButton(false);
//     setCheckbox(true);
//   } else {
//     setDisableCheckbox(false);
//     setShowButton(true);
//     setIns(false);
//     setCheckbox(false);
//   }
//   // Lowercase all keys in patientData
//   patientData = lowerize(patientData);
//   // Deep copy of the Inputs array
//   let inputsCopy = JSON.parse(JSON.stringify(Inputs));
//   // Find the index for "Patient" section
//   let patientIndex = inputsCopy.findIndex((item: any) => item?.sectionId === 3);
//   // Set default values for the "Patient" section fields
//   inputsCopy[patientIndex].fields.forEach((fieldsData: any) => {
//     fieldsData.defaultValue =
//       patientData[fieldsData.systemFieldName.toLowerCase()];
//   });

//   // Find the index for "Billing Information" section
//   let billingIndex = inputsCopy.findIndex((item: any) => item?.sectionId === 5);
//   // Insurance data and repeat field control checks
//   let insuranceDataLength = patientData.insurances.length;
//   let RepeatFieldsLength = getLengthFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );
//   let repeatstartControl = getItemFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );
//   let allRepeatStartControls = getItemsFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId === 33
//   );

//   // Clear all previous repeat controls from the Billing Information fields
//   inputsCopy[billingIndex].fields = inputsCopy[billingIndex].fields.filter(
//     (item: any) => item.uiTypeId !== 33
//   );

//   // Ensure enough repeat start controls for all insurances
//   while (allRepeatStartControls.length < insuranceDataLength) {
//     allRepeatStartControls.push(JSON.parse(JSON.stringify(repeatstartControl)));
//   }

//   // Truncate extra repeat controls if new patient has fewer insurances
//   if (allRepeatStartControls.length > insuranceDataLength) {
//     allRepeatStartControls = allRepeatStartControls.slice(
//       0,
//       insuranceDataLength
//     );
//   }

//   // Set default values for each insurance
//   for (let insIndex = 0; insIndex < insuranceDataLength; insIndex++) {
//     const insElement = lowerize(patientData.insurances[insIndex]);
//     allRepeatStartControls[insIndex].repeatFields.forEach((fieldData: any) => {
//       fieldData.defaultValue =
//         insElement[camelize(fieldData.systemFieldName.toLowerCase())];

//       let depFieldsOption = getItemFromArray(
//         allRepeatStartControls[insIndex].repeatDependencyControls,
//         (item: any) =>
//           item?.value?.toString().toLowerCase() ==
//           fieldData?.defaultValue?.toString().toLowerCase()
//       );

//       if (depFieldsOption) {
//         var action = depFieldsOption.dependencyAction;

//         allRepeatStartControls[insIndex].repeatFields.forEach(
//           (fieldData: any) => {
//             var depfound = getItemFromArray(
//               depFieldsOption.dependecyFields,
//               (Item: any) => Item.controlId == fieldData.controlId
//             );
//             if (depfound && (action ?? "")?.toLowerCase() === "show") {
//               fieldData.visible = true;
//             } else {
//               fieldData.visible = false;
//             }
//             if (fieldData.controlId === 44) {
//               fieldData.visible = true;
//             }
//             if (fieldData.controlId === 45 && fieldData.defaultValue) {
//               fieldData.visible = true;
//             }
//           }
//         );
//       }
//     });
//   }

//   // Separate repeat and non-repeat fields, then combine them back
//   let AllControlsWithoutRepeat = getItemsFromArray(
//     inputsCopy[billingIndex].fields,
//     (item: any) => item.uiTypeId !== 33
//   );

//   inputsCopy[billingIndex].fields = [];
//   allRepeatStartControls.forEach((item: any) =>
//     inputsCopy[billingIndex].fields.push(item)
//   );
//   AllControlsWithoutRepeat.forEach((item: any) =>
//     inputsCopy[billingIndex].fields.push(item)
//   );

//   inputsCopy[billingIndex].fields.forEach((item: any, index: number) => {
//     if (index !== 0 && item.displayFieldName === "Repeat Start") {
//       item.repeatFields.forEach((rep: any) => {
//         if (rep.systemFieldName === "BillingType") {
//           rep.options = rep.options.filter(
//             (option: any) =>
//               option.value !== "Client Bill" && option.value !== "Self Pay"
//           );
//         }
//       });
//     }
//   });
//   // Update state and then load required sections
//   setInputs(inputsCopy);

//   // Use a slight delay to ensure setInputs is processed before calling loadReqSec
//   setTimeout(() => {
//     loadReqSec();
//   }, 0);
// };

export const isJson = (str: any): boolean => {
  if (typeof str !== "string") return false;
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
};

export const Masking = (inputValue: any, inputType: any) => {
  if (inputType !== "TextArea") return;
  let val = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
  if (inputValue.length <= 10) {
    // Apply your custom mask here
    if (val.length >= 7) {
      val = `(${inputValue.slice(0, 3)}) ${inputValue.slice(
        3,
        6
      )}-${inputValue.slice(6)}`;
    } else if (inputValue.length >= 3) {
      val = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3)}`;
    }
  }
  return val;
};

export const countEntriesWithSpecificText = (dataArray: any) => {
  return dataArray.reduce((count: any, item: any) => {
    const nonEmptyFieldsCount = Object.values(item).reduce(
      (fieldCount: any, value: any) => {
        return value.trim() !== "" ? fieldCount + 1 : fieldCount;
      },
      0
    );
    return count + nonEmptyFieldsCount;
  }, 0);
};
export const countKeysWithValues = async (obj: any) => {
  let count = 0;
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== ""
    ) {
      count++;
    }
  }
  return count;
};
export const UpdatedArrayForPreView = async (preView: any) => {
  return preView;
};

export const ValidateRepeatInput = async (
  field: any,
  sectionindex: number,
  fieldsIndex: number,
  errorsObj: any,
  data: any
) => {
  let valueObj: any = {};
  let schemaObj: any = {};

  for (let y = 0; y < field.repeatFields.length; y++) {
    if (valueObj.hasOwnProperty(field.repeatFields[y].systemFieldName)) {
      if (
        valueObj[field.repeatFields[y].systemFieldName] !== null ||
        valueObj[field.repeatFields[y].systemFieldName] != ""
      )
        continue;
    }
    valueObj[field.repeatFields[y].systemFieldName] =
      field.repeatFields[y].defaultValue;
    if (
      field.repeatFields[y].validationExpression !== "" &&
      field.repeatFields[y].validationExpression !== null
    )
      schemaObj[field.repeatFields[y].systemFieldName] =
        await convertStringToYupSchema(
          field.repeatFields[y].validationExpression
        );
  }
  ////for dependencies
  for (let y = 0; y < field.repeatDependencyControls.length; y++) {
    for (
      let z = 0;
      z < field.repeatDependencyControls[y].dependecyFields.length;
      z++
    ) {
      if (
        valueObj.hasOwnProperty(
          field.repeatDependencyControls[y].dependecyFields[z].systemFieldName
        )
      ) {
        if (
          valueObj[
          field.repeatDependencyControls[y].dependecyFields[z].systemFieldName
          ] !== null ||
          valueObj[
          field.repeatDependencyControls[y].dependecyFields[z].systemFieldName
          ] != ""
        )
          continue;
      }

      valueObj[
        field.repeatDependencyControls[y].dependecyFields[z].systemFieldName
      ] = field.repeatDependencyControls[y].dependecyFields[z].defaultValue;

      if (
        field.repeatDependencyControls[y].dependecyFields[z]
          .validationExpression !== "" &&
        field.repeatDependencyControls[y].dependecyFields[z]
          .validationExpression !== null
      )
        schemaObj[
          field.repeatDependencyControls[y].dependecyFields[z].systemFieldName
        ] = await convertStringToYupSchema(
          field.repeatDependencyControls[y].dependecyFields[z]
            .validationExpression
        );
    }
  }
  yup.object(schemaObj).describe();
  try {
    await yup
      .object()
      .shape(schemaObj)
      .validateSync(valueObj, { abortEarly: false });
    return await fieldsRepeatLoop(
      undefined,
      sectionindex,
      fieldsIndex,
      true,
      data,
      errorsObj
    );
  } catch (e: any) {
    return await fieldsRepeatLoop(
      e,
      sectionindex,
      fieldsIndex,
      false,
      data,
      errorsObj
    );
  }
};

const fieldsRepeatLoop = async (
  errors: any,
  i: number,
  fieldsIndex: number,
  isValid: boolean,
  data: any,
  errorsObj: any = {}
) => {
  return await new Promise((resolve, reject) => {
    const looprepeateField = async () => {
      await data[i].fields[fieldsIndex].repeatFields.forEach(
        (x: any, index: number) => {
          if (!isValid) {
            let innerError = errors.inner.find((y: any) => {
              return y.path == x.systemFieldName;
            });
            //
            if (innerError) {
              //isValid = false;
              data[i].fields[fieldsIndex].repeatFields[index].enableRule =
                innerError.message;
              // errorsObj = {...errorsObj,x.systemFieldName:innerError.message}
              errorsObj[x.systemFieldName] = innerError.message;
              // setErrosTrack((preVal) => {
              //   return {
              //     ...preVal,
              //     [x.systemFieldName]: innerError.message,
              //   };
              // });
              // x.enableRule = innerError.message;
            } else {
              data[i].fields[fieldsIndex].repeatFields[index].enableRule = "";
              errorsObj[x.systemFieldName] = "";
              // setErrosTrack((preVal) => {
              //   return {
              //     ...preVal,
              //     [x.systemFieldName]: "",
              //   };
              // });
            }
          } else {
            data[i].fields[fieldsIndex].repeatFields[index].enableRule = "";
            errorsObj[x.systemFieldName] = "";
          }
        }
      );
      ///////////////for dependecies validation
      for (
        let y = 0;
        y < data[i].fields[fieldsIndex].repeatDependencyControls.length;
        y++
      ) {
        for (
          let z = 0;
          z <
          data[i].fields[fieldsIndex].repeatDependencyControls[y]
            .dependecyFields.length;
          z++
        ) {
          if (!isValid) {
            let innerError = errors.inner.find((er: any) => {
              return (
                er.path ==
                data[i].fields[fieldsIndex].repeatDependencyControls[y]
                  .dependecyFields[z].systemFieldName
              );
            });
            //
            if (innerError) {
              //isValid = false;
              data[i].fields[fieldsIndex].repeatDependencyControls[
                y
              ].dependecyFields[z].enableRule = innerError.message;
              // x.enableRule = innerError.message;
              errorsObj[
                data[i].fields[fieldsIndex].repeatDependencyControls[
                  y
                ].dependecyFields[z].systemFieldName
              ] = innerError.message;
            } else {
              errorsObj[
                data[i].fields[fieldsIndex].repeatDependencyControls[
                  y
                ].dependecyFields[z].systemFieldName
              ] = "";
              data[i].fields[fieldsIndex].repeatDependencyControls[
                y
              ].dependecyFields[z].enableRule = "";
            }
          } else {
            errorsObj[
              data[i].fields[fieldsIndex].repeatDependencyControls[
                y
              ].dependecyFields[z].systemFieldName
            ] = "";
            data[i].fields[fieldsIndex].repeatDependencyControls[
              y
            ].dependecyFields[z].enableRule = "";
          }
        }
      }
      return data;
    };

    return resolve(looprepeateField());
  });
};

async function convertStringToYupSchema(
  stringSchema: string | undefined
): Promise<yup.Schema<unknown, any, any, "">> {
  try {
    if (!stringSchema) {
      // Return a default Yup schema or `null` schema if the input is undefined
      return yup.mixed().nullable().optional();
    }
    const schema = await new Function("yup", `return ${stringSchema}`)(yup);
    if (schema instanceof yup.Schema) {
      return schema;
    } else {
      throw new Error("Invalid schema string.");
    }
  } catch (error: any) {
    throw new Error(
      `Error converting string to Yup schema: ${error.message} ${stringSchema}`
    );
  }
}

export const modifyValidationSchemaForSaveLater = async (
  Inputs: any,
  validatedSystemFields: any[] = []
) => {
  let errorsObj: any = {};

  for (let i = 0; i < Inputs.length; i++) {
    let valueObj: any = {};
    let schemaObj: any = {};
    for (let y = 0; y < Inputs[i].fields.length; y++) {
      // for repeated field like billing Type
      if (Inputs[i].isSelected) {
        await ValidateRepeatInput(Inputs[i].fields[y], i, y, errorsObj, Inputs);
        if (
          validatedSystemFields.includes(Inputs[i].fields[y].systemFieldName)
        ) {
          valueObj[Inputs[i].fields[y].systemFieldName] =
            Inputs[i].fields[y].defaultValue;
          if (
            Inputs[i].fields[y].validationExpression !== "" &&
            Inputs[i].fields[y].validationExpression !== null
          )
            schemaObj[Inputs[i].fields[y].systemFieldName] =
              await convertStringToYupSchema(
                Inputs[i].fields[y].validationExpression
              );
        }

        try {
          await yup
            .object()
            .shape(schemaObj)
            .validateSync(valueObj, { abortEarly: false });

          await Inputs[i].fields.forEach((x: any, index: number) => {
            Inputs[i].fields[index].enableRule = "";
            errorsObj[x.systemFieldName] = "";
          });
        } catch (errors: any) {
          await Inputs[i].fields.forEach((x: any, index: number) => {
            let innerError = errors?.inner?.find((y: any) => {
              return y.path == x.systemFieldName;
            });
            //
            if (innerError) {
              Inputs[i].fields[index].enableRule = innerError.message;
              errorsObj[x.systemFieldName] = innerError.message;
            } else {
              Inputs[i].fields[index].enableRule = "";
              errorsObj[x.systemFieldName] = "";
            }
          });
        }
      }
    }
  }
  return { data: Inputs, validation: errorsObj };
};

export const moveSignaturesToEnd = (newFormDataApi: any) => {
  let result = isJson(newFormDataApi);
  if (!result) return;
  let deepCopy = JSON.parse(JSON.stringify(newFormDataApi));
  let arr: any = [];
  Array.isArray(deepCopy?.requisitions) &&
    deepCopy?.requisitions.forEach((reqData: any) => {
      reqData?.reqSections?.forEach((requisitionsData: any) => {
        if (
          requisitionsData?.sectionId === 13 ||
          requisitionsData?.sectionId === 14
        ) {
          arr.push(requisitionsData);
        }
      });
    });
  return arr;
};

export const checkBox = (
  choiceValue: string,
  defaultValue: string,
  repeatFieldIndex: number
) => {
  if (repeatFieldIndex) {
  }
};

export const setJSONDataFormat = (defaultValue: any) => {
  let result = isJson(defaultValue);
  if (result) {
    defaultValue = JSON.parse(defaultValue);
    return defaultValue;
  } else {
    return defaultValue;
  }
};
const extractFocussedInputAddressForBillingInformation = (fieldsData: any) => {
  for (let innerIndex = 0; innerIndex < fieldsData.length; innerIndex++) {
    //
    if (fieldsData[innerIndex]?.enableRule) {
      return fieldsData[innerIndex]?.systemFieldName;
    }
  }
};
export const extractFocussedInputAddress = (validatedData: any) => {
  let breakLoop = false;
  let toFocusFieldInfo: any = {};
  for (let index = 0; index < validatedData.length; index++) {
    if (breakLoop) {
      break;
    }
    for (
      let innerIndex = 0;
      innerIndex < validatedData[index].fields.length;
      innerIndex++
    ) {
      if (validatedData[index].fields[innerIndex]?.repeatFields?.length > 0) {
        let billingInfoFocussedField =
          extractFocussedInputAddressForBillingInformation(
            validatedData[index].fields[innerIndex]?.repeatFields
          );
        toFocusFieldInfo.fieldName = billingInfoFocussedField;
        if (billingInfoFocussedField) {
          breakLoop = true;
          break;
        }
      }
      if (validatedData[index].fields[innerIndex]?.enableRule) {
        toFocusFieldInfo.fieldName =
          validatedData[index].fields[innerIndex]?.systemFieldName;
        breakLoop = true;
        break;
      }
    }
  }
  return toFocusFieldInfo.fieldName;
};
// export const do_it = async (
//   obj: any,
//   callback: any,
//   Inputs: any,
//   index: any
// ) => {
//   getIpAddress().then((results) => {
//     obj.ipAddress = results;
//   });
//   getSignatureText(obj, Inputs, index).then((results) => {
//     callback(results.data);
//   });
//   return;
// };

export const do_it = async (
  obj: any,
  callback: any,
  Inputs: any,
  index: any
) => {
  try {
    const ipAddress = await getIpAddress(); // Wait for IP address
    obj.ipAddress = ipAddress; // Add IP address to the object

    const signatureData = await getSignatureText(obj, Inputs, index); // Wait for signature text
    callback(signatureData.data); // Pass the result to the callback
  } catch (error) {
    console.error(error);
  }
};

export const getIpAddress = async () => {
  let ipAddress = "";
  let response = await fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      ipAddress = data.ip;
      return data.ip;
    })
    .catch((error) => console.log(error));
  return await response;
};

export const getSignatureText = async (
  strObj: any,
  Inputs: any,
  index: any
) => {
  let response = RequisitionType.generateSignature(strObj)
    .then((res: any) => {
      return res;
    })
    .catch((err: any) => { })
    .finally(() => { });
  return response;
};

export const dateFormatSetter = (date: string) => {
  if (!date) return;
  let convertedDate: any = new Date(date);
  if (isNaN(convertedDate)) return "";
  if (date) {
    return convertedDate;
  } else if (!date) {
    return "";
  }
};

export const getSpecimenSourceIndex = (inputsCopy: any) => {
  let specimenSourceIndex = inputsCopy.findIndex(
    (specimenSourceInfo: any) => specimenSourceInfo.sectionId == 11
  );
  return specimenSourceIndex;
};
export const getICDPanelsIndex = (inputsCopy: any) => {
  let ICDPanelsIndex = inputsCopy.findIndex(
    (Info: any) => Info.sectionId == 12
  );
  return ICDPanelsIndex;
};

export const getComorbiditiesPanelsIndex = (inputsCopy: any) => {
  let ComorbiditiesPanelsIndex = inputsCopy.findIndex(
    (Info: any) => Info.sectionId == 103
  );
  return ComorbiditiesPanelsIndex;
};

export const getToxTestingOption = (inputsCopy: any) => {
  let index = inputsCopy.findIndex((i: any) => i.sectionId == 17);
  return index;
};
export const getToxCompendiumIndex = (arr: any) => {
  let index = arr.findIndex((i: any) => i.systemFieldName === "Compendium");
  return index;
};
export const upsertArray = (array: any[], element: any, condition: any) => {
  // (1)
  //;

  const i: any = array?.findIndex(condition);

  if (i > -1) array[i] = element; // (2)
  else array.push(element);
  return array;
};

export const assignValuesForSearchInputs = (
  array: any[],
  tabsDetail: any,
  value: any
) => {
  return "";
};

export const emptyObjectValues = (searchValue: any) => {
  Object.keys(searchValue).forEach(function (index) {
    searchValue[index] = "";
  });

  return searchValue;
};

export const getTotalPagesCount = (pageSize: any, totalPageCount: any) => {
  let totalCount = totalPageCount / pageSize;
  let totalCountToInteger = Math.ceil(totalCount);
  return totalCountToInteger;
};
export const setDateToInput = (filterData: any, columnKey?: string) => {
  let filterDate = filterData?.filters?.find(
    (filteredObj: any) => filteredObj.columnKey == columnKey
  );

  if (filterDate?.columnKey == columnKey) {
    return filterDate?.filterValue;
  } else {
    return "";
  }
};

export const modifiedInputsWithSignature = (apiResCopy: any) => {
  apiResCopy.forEach((inputs: any) => {
    if (inputs.sectionName === "Physician Signature") {
      inputs.fields.forEach((fields: any) => {
        if (
          fields.systemFieldName == "PhysicianSignature" &&
          fields.defaultValue
        ) {
          fields.signatureText = fields.defaultValue;
        }
      });
    }
  });
  return apiResCopy;
};
