import { generate } from "@wcj/generate-password";
import moment from "moment";
import {
  emailValidator,
  noValidator,
  npiValidator,
  nullValidator,
  phoneNumberValidator,
  zipcodeValidator,
} from "../Validations";

export const reactSelectStyle = {
  control: (base: any) => ({
    ...base,
    boxShadow: "none",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};
export const reactSelectSMStyle = {
  control: (base: any) => ({
    ...base,
    boxShadow: "none",
    minHeight: "30px",
    borderRadius: ".475rem !important",
    padding: "0 0.4rem",
    fontWeight: 400,
    minWidth: "150px",
    "& div": {
      padding: "0",
    },
    "& svg": {
      height: "15px",
      marginLeft: "4px",
    },
  }),
  menuPortal: (provided: any) => ({ ...provided, zIndex: 9999 }),
};
export const reactSelectSMStyle2 = (minHeight?: string) => {
  return {
    control: (base: any) => ({
      ...base,
      boxShadow: "none",
      minHeight: minHeight || "30px",
      borderRadius: ".475rem !important",
      padding: "0 0.4rem",
      fontWeight: 400,
      // minWidth: "150px",
      "& div": {
        padding: "0",
      },
      "& svg": {
        height: "15px",
        marginLeft: "4px",
      },
    }),
    menuPortal: (provided: any) => ({ ...provided, zIndex: 9999 }),
  };
};
export const styles = (theme: any) => {
  return {
    ...theme,
    borderRadius: "0.85rem",
    borderWidth: 1,
    boxShadow: "none !important",
    colors: {
      ...theme.colors,
      primary: "var(--kt-input-focus-border-color)",
      primary75: "var(--kt-light-primary)",
      primary50: "var(--kt-light-primary)",
      neutral20: "var(--kt-input-border-color)",
      // neutral30: 'red',
      // neutral40: 'red',
      neutral50: "var(--kt-input-solid-placeholder-color)",
      // neutral60: 'red',
      // neutral70: 'red',
      // neutral80: 'red',
      // neutral90: 'red',
      boxShadow: "none",
    },
  };
};
export const stylesResultData = (theme: any) => {
  return {
    ...theme,
    borderRadius: "5px !important",
    borderWidth: 1,
    height: "25px !important",
    minHeight: "25px !important",
    boxShadow: "none !important",
    marginTop: "-3px",
    spacing: {
      controlHeight: 20,
      menuGutter: 1,
      baseUnit: 2,
    },

    colors: {
      ...theme.colors,
      primary: "var(--kt-input-focus-border-color)",
      primary75: "var(--kt-light-primary)",
      primary50: "var(--kt-light-primary)",
      neutral20: "var(--kt-input-border-color)",
      // neutral30: 'red',
      // neutral40: 'red',
      neutral50: "var(--kt-input-solid-placeholder-color)",
      // neutral60: 'red',
      // neutral70: 'red',
      // neutral80: 'red',
      // neutral90: 'red',
      boxShadow: "none",
    },
  };
};

export const generateAutoGeneratePassword = () => {
  return generate({
    lowerCase: true,
    upperCase: true,
    numeric: true,
    special: true,
    length: 14,
  });
};

export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "($1) $2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .replace(/(-\d{4})(\d+?)$/, "$1");
};
export const maskInt = (value: string) => {
  return value.replace(/\D/g, "");
};
export const stateDropdownArray = [
  {
    value: "",
    label: "Please select a state",
  },
  { value: "AL", label: "Alabama(AL)" },
  { value: "AK", label: "Alaska(AK)" },
  { value: "AZ", label: "Arizona(AZ)" },
  { value: "AR", label: "Arkansas(AR)" },
  { value: "CA", label: "California(CA)" },
  { value: "CO", label: "Colorado(CO)" },
  { value: "CT", label: "Connecticut(CT)" },
  { value: "DE", label: "Delaware(DE)" },
  {
    value: "DC",
    label: "District Of Columbia(DC)",
  },
  { value: "FL", label: "Florida(FL)" },
  { value: "GA", label: "Georgia(GA)" },
  { value: "HI", label: "Hawaii(HI)" },
  { value: "ID", label: "Idaho(ID)" },
  { value: "IL", label: "Illinois(IL)" },
  { value: "IN", label: "Indiana(IN)" },
  { value: "IA", label: "Iowa(IA)" },
  { value: "KS", label: "Kansas(KS)" },
  { value: "KY", label: "Kentucky(KY)" },
  { value: "LA", label: "Louisiana(LA)" },
  { value: "ME", label: "Maine(ME)" },
  { value: "MD", label: "Maryland(MD)" },
  { value: "MA", label: "Massachusetts(MA)" },
  { value: "MI", label: "Michigan(MI)" },
  { value: "MN", label: "Minnesota(MN)" },
  { value: "MS", label: "Mississippi(MS)" },
  { value: "MO", label: "Missouri(MO)" },
  { value: "MT", label: "Montana(MT)" },
  { value: "NE", label: "Nebraska(NE)" },
  { value: "NV", label: "Nevada(NV)" },
  { value: "NH", label: "New Hampshire(NH)" },
  { value: "NJ", label: "New Jersey(NJ)" },
  { value: "NM", label: "New Mexico(NM)" },
  { value: "NY", label: "New York(NY)" },
  { value: "NC", label: "North Carolina(NC)" },
  { value: "ND", label: "North Dakota(ND)" },
  { value: "OH", label: "Ohio(OH)" },
  { value: "OK", label: "Oklahoma(OK)" },
  { value: "OR", label: "Oregon(OR)" },
  { value: "PA", label: "Pennsylvania(PA)" },
  { value: "PR", label: "Puerto Rico(PR)" },
  { value: "RI", label: "Rhode Island(RI)" },
  { value: "SC", label: "South Carolina(SC)" },
  { value: "SD", label: "South Dakota(SD)" },
  { value: "TN", label: "Tennessee(TN)" },
  { value: "TX", label: "Texas(TX)" },
  { value: "UT", label: "Utah(UT)" },
  { value: "VT", label: "Vermont(VT)" },
  { value: "VA", label: "Virginia(VA)" },
  { value: "VI", label: "Virgin Islands(VI)" },
  { value: "WA", label: "Washington(WA)" },
  { value: "WV", label: "West Virginia(WV)" },
  { value: "WI", label: "Wisconsin(WI)" },
  { value: "WY", label: "Wyoming(WY)" },
];

export const facilityApprovalTabsArr = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "active" },
  { label: "Rejected", value: "rejected" },
];
export const facilityTabsArr = [
  { label: "Active", value: 0 },
  { label: "InActive", value: 1 },
  { label: "Suspend", value: 2 },
  { label: "Archived", value: 3 },
  { label: "Rejected", value: 4 },
];
export const facilityTabsArr1 = [
  { label: "active", value: 0 },
  { label: "inActive", value: 1 },
  { label: "suspend", value: 2 },
  { label: "archived", value: 3 },
  { label: "rejected", value: 4 },
];
export const facilityTabsArr2 = [
  { label: "active", value: 0 },
  { label: "Inactive", value: 1 },
  { label: "suspend", value: 2 },
  { label: "archived", value: 3 },
  { label: "rejected", value: 4 },
];
export const facilityTabsArr3 = [
  { label: "active", value: 0 },
  { label: "inactive", value: 1 },
  { label: "suspend", value: 2 },
  { label: "archived", value: 3 },
  { label: "rejected", value: 4 },
];
export const statusChoice = [
  { label: "Select Status", value: "" },
  { label: "active", value: 0 },
  { label: "inactive", value: 1 },
  { label: "suspend", value: 2 },
  { label: "archived", value: 3 },
  { label: "rejected", value: 4 },
];
//////patient demographics radio arrays
export const genderChoices = [
  {
    id: "Malepatient",
    label: "Male",
    value: "Male",
  },
  {
    id: "Femalepatient",
    label: "Female",
    value: "Female",
  },
  {
    id: "Unknownpatient",
    label: "Unknown",
    value: "Unknown",
  },
  // {
  //   id: "Intersexpatient",
  //   label: "Intersex",
  //   value: "Intersex",
  // },
];
export const raceChoices = [
  {
    id: "Asianpatient",
    label: "Asian",
    value: "Asian",
  },
  {
    id: "Blackpatient",
    label: "Black",
    value: "Black",
  },
  {
    id: "Whitepatient",
    label: "White",
    value: "White",
  },
  {
    id: "AmericanIndianAKpatient",
    label: "American Indian/AK",
    value: "American Indian/AK",
  },
  {
    id: "HawaiianPacificpatient",
    label: "Hawaiian/Pacific",
    value: "MalHawaiian/Pacifice",
  },
  {
    id: "Unknownpatient",
    label: "Unknown",
    value: "Unknown",
  },

  {
    id: "NotSpecifiedpatient",
    label: "Not Specified",
    value: "Not Specified",
  },
  {
    id: "Otherpatient",
    label: "Other",
    value: "Other",
  },
];
export const ethnicityChoices = [
  {
    id: "Hispanic/Latinopatient",
    label: "Hispanic/Latino",
    value: "Hispanic/Latino",
  },
  {
    id: "NonHispanicLatinopatient",
    label: "Non-Hispanic / Latino",
    value: "Non-Hispanic / Latino",
  },
  {
    id: "NotSpecifiedpatient",
    label: "Not Specified",
    value: "Not Specified",
  },
];

export const patientTypeChoices = [
  {
    id: "Residentpatient",
    label: "Resident",
    value: "Resident",
  },
  {
    id: "StaffEmployeepatient",
    label: "Staff (Employee)",
    value: "Staff (Employee)",
  },
  {
    id: "Visitorpatient",
    label: "Visitor",
    value: "Visitor",
  },
  {
    id: "Vendorpatient",
    label: "Vendor",
    value: "Vendor",
  },
  {
    id: "Studentpatient",
    label: "Student",
    value: "Student",
  },
  {
    id: "N/Apatient",
    label: "N/A",
    value: "N/A",
  },
];
export const subscriberRelation = [
  {
    id: "spousepatient",
    label: "Spouse",
    value: "Spouse",
  },
  {
    id: "dependentpatient",
    label: "Dependent",
    value: "Dependent",
  },

  {
    id: "otherpatient",
    label: "Other",
    value: "Other",
  },
  {
    id: "self",
    label: "Self",
    value: "Self",
  },
];
/////
///icd10 dropdown data

export const icd10Codes = [
  {
    id: "1Icd10",
    code: "F10.20:",
    description: "Resistance to unspecified antimicrobial drugs.",
  },
  {
    id: "2Icd10",
    code: "F11.20:",
    description: "Opioid dependence,uncomplicated",
  },
  {
    id: "3Icd10",
    code: "M79.1:",
    description: "Myalgia",
  },
  {
    id: "4Icd10",
    code: "F11.90:",
    description: "Opioid use, unspecified,uncomplicated",
  },
  {
    id: "5Icd10",
    code: "F16.120:",
    description: "Hallucinogen abuse with intoxication, uncomplicated",
  },
  {
    id: "6Icd10",
    code: "F10.120:",
    description: "Alcohol abuse with intoxication, uncomplicated",
  },
];
export const IDBatchQCTabsArr = [
  { label: "ID Batch QC", value: 0 },
  { label: "ID Batch QC Archive", value: 1 },
];
////
///////facility state for edit facility
export const setFormState = (initialState: any, editData: any) => {
  let {
    contactInfo,
    criticalInfo,
    generalInfo,
    files,
    facilityOpt,
    providerInfo,
    shippingInfo,
  } = editData;
  initialState = {
    ...initialState,
    facilityName: {
      ...nullValidator,
      value: generalInfo?.facilityName,
    },
    address1: {
      ...nullValidator,
      value: generalInfo?.addressView.address1,
    },
    address2: {
      ...noValidator,
      value: generalInfo?.addressView.address2,
    },
    city: { ...nullValidator, value: generalInfo?.addressView.city },
    state: { ...nullValidator, value: generalInfo?.addressView?.state },
    zipCode: { ...zipcodeValidator, value: generalInfo?.addressView.zipCode },
    facilityPhone: {
      ...phoneNumberValidator,
      value: generalInfo.facilityPhone,
    },
    facilityWebsite: { value: generalInfo?.facilityWebsite },
    facilityFax: { ...nullValidator, value: generalInfo?.facilityFax },
    contactFirstName: {
      ...nullValidator,
      value: contactInfo?.contactFirstName,
    },
    contactLastName: { ...nullValidator, value: contactInfo?.contactLastName },
    contactPrimaryEmail: {
      ...emailValidator,
      value: contactInfo?.contactPrimaryEmail,
    },
    contactPhone: { ...phoneNumberValidator, value: contactInfo?.contactPhone },
    criticalFirstName: {
      ...nullValidator,
      value: criticalInfo?.criticalFirstName,
    },
    criticalLastName: {
      ...nullValidator,
      value: criticalInfo?.criticalLastName,
    },
    criticalEmail: { ...emailValidator, value: criticalInfo?.criticalEmail },
    criticalPhoneNo: {
      ...phoneNumberValidator,
      value: criticalInfo?.criticalPhoneNo,
    },
    physicianFirstName: {
      ...nullValidator,
      value: providerInfo?.physicianFirstName,
    },
    physicianLastName: {
      ...nullValidator,
      value: providerInfo?.physicianLastName,
    },
    phoneNumber: { ...noValidator, value: providerInfo?.phoneNumber },
    npi: { ...npiValidator, value: providerInfo?.npi },
    stateLicense: { value: providerInfo?.stateLicense },
    gender: {
      ...noValidator,
      value: providerInfo?.gender,
    },
    activationType: {
      ...nullValidator,
      value: providerInfo?.activationType,
    },
    username: { ...noValidator, value: providerInfo?.username },
    email: { ...noValidator, value: providerInfo?.email },
    password: noValidator,
    reEnterPassword: noValidator,
    shippingName: { ...noValidator, value: shippingInfo?.shippingName },
    shippingAddress: { ...noValidator, value: shippingInfo?.shippingAddress },
    shippingPhoneNumber: {
      ...noValidator,
      value: shippingInfo?.shippingPhoneNumber,
    },
    shippingEmail: { ...noValidator, value: shippingInfo?.shippingEmail },
    shippingNote: { ...noValidator, value: shippingInfo?.shippingNote },
    files: files,
    facilityOpt: facilityOpt,
    mdFirstName: { ...noValidator, value: generalInfo?.mdFirstName },
    mdLastName: { ...noValidator, value: generalInfo?.mdLastName },
    facilityLogoUrl: { ...noValidator, value: generalInfo?.facilityLogoUrl },
  };
  return initialState;
};

export const getImageFileSize = (bytes: any) => {
  let decimals = 2;
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const extractLastModifiedDate = (file: any) => {
  const date = new Date();
  const strDate = moment(date).format("MM/DD/YYYY");
  return strDate;
};

export function genUniqueId(): string {
  const dateStr = Date.now().toString(36); // convert num to base 36 and stringify

  const randomStr = Math.random().toString(36).substring(2, 8); // start at index 2 to skip decimal point
  const resut: string = dateStr + "-" + randomStr;
  return resut;
}

export const dependencyDisplayClass = (
  formData?: any,
  selectedId?: string,
  depID?: string,
  options?: any,
  depfield?: any,
  dependencyControls?: any,
  call?: any,
  preSelected?: any
) => {
  if (formData?.name == options?.name && formData?.id == options?.optionID) {
    return (
      depfield?.displayType +
      " " +
      options?.name +
      " " +
      options?.name +
      options.optionID
    );
  }
  if (
    selectedId != depID &&
    formData?.id &&
    formData?.depfield?.displayType != depfield?.displayType
  ) {
    return (
      depfield?.displayType +
      " " +
      "d-none " +
      options?.name +
      " " +
      options?.name +
      options.optionID
    );
  }
  // if(options?.recursive && ){

  // }
  if (selectedId != depID && !formData?.id) {
    return (
      depfield?.displayType +
      " " +
      "d-none " +
      options?.name +
      " " +
      options?.name +
      options.optionID
    );
  }
};

export const modifyDependencyControlArr = (
  dependencyControlsCopy: any,
  uniqueID: any
) => {
  //const clonedArray = dependencyControlsCopy.map((item: any) => ({ ...item }));
  const clonedArray = JSON.parse(JSON.stringify(dependencyControlsCopy));
  clonedArray.forEach((item: any, index: number, arrayItself: any) => {
    let parentOrignalNameOfFields = arrayItself[index].name;
    arrayItself[index].name = item.name + uniqueID;
    arrayItself[index].recursive = true;
    //arrayItself[index].optionID = item.optionID + uniqueID;
    // arrayItself[index].optionDataID = item.optionDataID + uniqueID;

    arrayItself[index].dependecyFields.forEach(
      (element: any, index: number, arrayItselDepFields: any) => {
        // let diplayTypeOrignalName = arrayItselDepFields[index]?.displayType;
        let newDiplayTypeStr = arrayItselDepFields[index]?.displayType.replace(
          parentOrignalNameOfFields,
          parentOrignalNameOfFields + uniqueID
        );
        arrayItselDepFields[index].displayType = newDiplayTypeStr;
      }
    );
  });

  return clonedArray;
};

export const mergeInPlace = (
  inputsArray: any,
  newFeildsToBeAppended: any,
  i: number
) => {
  //let appendStartBtn =
  //
  let newModifiedFeildsToBeAppended = newFeildsToBeAppended;
  let removeObjAppend = newFeildsToBeAppended[0];
  let modifiedRemoveObjAppend = { uiType: true };
  newModifiedFeildsToBeAppended = [
    modifiedRemoveObjAppend,
    ...newModifiedFeildsToBeAppended,
  ];

  inputsArray.splice(i, 0, ...newFeildsToBeAppended);
  return inputsArray;
};

export const showDep = (
  Inputs: any,
  index: number,
  id: string,
  name: string,
  depfield?: any,
  searchID?: any,
  ArrayReqId?: any
) => {
  const clonedArray = JSON.parse(JSON.stringify(Inputs));
  if (searchID) {
    const modifiedArr = RepititiveDepFields(
      Inputs,
      index,
      id,
      name,
      depfield,
      searchID
    );
    return modifiedArr;
  }
  if (!searchID) {
    // debugger;
    let found = clonedArray[index]?.dependencyControls.filter(
      (elem: any) => elem?.optionID == id
    );
    if (found.length === 0) {
      if (ArrayReqId) {
        let filterDepControlsHideNotFound = clonedArray[
          index
        ]?.dependencyControls.filter((item: any) => item?.name == name);
        filterDepControlsHideNotFound.forEach(
          (element: any, index: number, arrayItself: any) => {
            arrayItself[index].dependecyFields.forEach(
              (element: any, index: number, arrayItselDepFields: any) => {
                if (
                  arrayItselDepFields[index]?.displayType.includes("d-none")
                ) {
                  return;
                } else {
                  arrayItselDepFields[index].displayType =
                    arrayItselDepFields[index].displayType + " " + "d-none";
                }
              }
            );
          }
        );

        return clonedArray;
      } else {
        let filterDepControlsHideNotFound = clonedArray[
          index
        ]?.dependencyControls.filter((item: any) => item?.name == name);
        filterDepControlsHideNotFound.forEach(
          (element: any, index: number, arrayItself: any) => {
            arrayItself[index].dependecyFields.forEach(
              (element: any, index: number, arrayItselDepFields: any) => {
                if (
                  arrayItselDepFields[index]?.displayType.includes("d-none")
                ) {
                  return;
                } else {
                  arrayItselDepFields[index].displayType =
                    arrayItselDepFields[index].displayType + " " + "d-none";
                }
              }
            );
          }
        );

        return clonedArray;
      }
    }
    ////for  hide
    hideFields(clonedArray, index, id, name);
    //
    //////for Show
    showFields(clonedArray, index, id, name);

    return clonedArray;
  }
};
//////show dep
const showFields = (
  clonedArray: any,
  index: number,
  id: string,
  name: string
) => {
  // debugger;
  let filterDepControls = clonedArray[index]?.dependencyControls.filter(
    (item: any) => item?.optionID == id && item?.dependencyAction == "show"
  );
  filterDepControls.forEach(
    (element: any, depindex: number, arrayItself: any) => {
      arrayItself[depindex].dependecyFields.forEach(
        (element: any, DepFieldindex: number, arrayItselDepFields: any) => {
          let removeDisplayNone = arrayItselDepFields[
            DepFieldindex
          ]?.displayType.replace("d-none", "");
          arrayItselDepFields[DepFieldindex].displayType = removeDisplayNone;

          var selectedValue = arrayItselDepFields[DepFieldindex].defaultValue;
          arrayItselDepFields[DepFieldindex]?.options?.forEach(
            (element: any, Optindex: number, arrayItself: any) => {
              var optionValue =
                arrayItselDepFields[DepFieldindex]?.options[Optindex]?.value;
              if (optionValue == selectedValue) {
                var optionId =
                  arrayItselDepFields[DepFieldindex]?.options[Optindex]?.id;
                var optionName =
                  arrayItselDepFields[DepFieldindex]?.options[Optindex]?.name;
                showFields(clonedArray, index, optionId, optionName);
              }
            }
          );
        }
      );
    }
  );
};
//////
/////hide deps
const hideFields = (
  clonedArray: any,
  index: number,
  id: string,
  name: string
) => {
  // debugger;
  let filterDepControlsHide = clonedArray[index]?.dependencyControls.filter(
    (item: any) => item?.optionID != id && item?.name == name
  );

  filterDepControlsHide.forEach(
    (element: any, depindex: number, arrayItself: any) => {
      arrayItself[depindex].dependecyFields.forEach(
        (element: any, DepFieldindex: number, arrayItselDepFields: any) => {
          if (
            arrayItselDepFields[DepFieldindex]?.displayType.includes("d-none")
          ) {
            //return;
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
};

const RepititiveDepFields = (
  Inputs: any,
  index: number,
  id: string,
  name: string,
  depfield?: any,
  searchID?: any
) => {
  let controlDataIDArr: any = [];
  const clonedArray = JSON.parse(JSON.stringify(Inputs));
  const getDepFields = clonedArray[index].fields;
  const filteredDepFields = getDepFields.filter(
    (item: any) => item?.searchID == searchID
  );

  let arrLength = filteredDepFields.length - 1;

  //
  //   filteredDepFields[arrLength],
  //   "filteredDepFields[0]?.dependencyControls"
  // );
  let found = filteredDepFields[arrLength]?.dependencyControls.filter(
    (elem: any) => elem?.optionID == id
  );

  if (found.length === 0) {
    ////
    let filterDepControlsHideNotFound = filteredDepFields[
      arrLength
    ]?.dependencyControls.filter(
      (item: any) => item?.name == name
      // ||      (item?.optionID != id && item?.name != name)
    );

    filterDepControlsHideNotFound.forEach(
      (elementZ: any, index: number, arrayItself: any) => {
        arrayItself[index].dependecyFields.forEach(
          (element: any, index: number, arrayItselDepFields: any) => {
            // let objWithIdDepAction = {
            //   controlDataID: element?.controlDataID,
            //   depAction: elementZ?.dependencyAction,
            // };
            // controlDataIDArr.push(objWithIdDepAction);
            if (arrayItselDepFields[index]?.displayType.includes("d-none")) {
              return;
            } else {
              arrayItselDepFields[index].displayType =
                arrayItselDepFields[index].displayType + " " + "d-none";
            }
          }
        );
      }
    );
    //

    return clonedArray;
  }
  ///////////with depaction show
  let filterDepControls = filteredDepFields[
    arrLength
  ]?.dependencyControls.filter(
    (item: any) =>
      item?.optionID == id &&
      item?.name == name &&
      item?.dependencyAction == "show"
  );
  filterDepControls.forEach(
    (elementZ: any, index: number, arrayItself: any) => {
      arrayItself[index].dependecyFields.forEach(
        (element: any, index: number, arrayItselDepFields: any) => {
          let objWithIdDepAction = {
            controlDataID: element?.controlDataID,
            depAction: elementZ?.dependencyAction,
          };
          controlDataIDArr.push(element?.controlDataID);
          let removeDisplayNone = arrayItselDepFields[
            index
          ]?.displayType.replace("d-none", "");
          arrayItselDepFields[index].displayType = removeDisplayNone;
        }
      );
      //
      clonedArray[index].fields?.forEach((item: any) => {
        if (
          controlDataIDArr.includes(item?.controlDataID) &&
          item.searchID == searchID
        ) {
          item.displayType = item.displayType.replace("d-none", "");
        }
      });
    }
  );
  ///////////with depaction show
  ///////////with depaction hide
  let filterDepControlsWithHideDepAction = filteredDepFields[
    arrLength
  ]?.dependencyControls.filter(
    (item: any) =>
      item?.optionID == id &&
      item?.name == name &&
      item?.dependencyAction == "hide"
  );
  filterDepControlsWithHideDepAction.forEach(
    (elementZ: any, i: number, arrayItself: any) => {
      arrayItself[i].dependecyFields.forEach(
        (element: any, i: number, arrayItselDepFields: any) => {
          controlDataIDArr.push(element?.controlDataID);
        }
      );

      clonedArray[index].fields?.forEach((item: any) => {
        if (
          controlDataIDArr.includes(item?.controlDataID) &&
          item.searchID == searchID
        ) {
          item.displayType = item.displayType + " " + "d-none";
        }
      });
    }
  );

  ///////////with depaction hide
  let filterDepControlsHide = filteredDepFields[
    arrLength
  ]?.dependencyControls.filter(
    (item: any) => item?.optionID != id && item?.name == name
    // ||      (item?.optionID != id && item?.name != name)
  );

  filterDepControlsHide.forEach(
    (element: any, index: number, arrayItself: any) => {
      arrayItself[index].dependecyFields.forEach(
        (element: any, index: number, arrayItselDepFields: any) => {
          if (arrayItselDepFields[index]?.displayType.includes("d-none")) {
            return;
          } else {
            arrayItselDepFields[index].displayType =
              arrayItselDepFields[index].displayType + " " + "d-none";
          }
        }
      );
    }
  );
  //
  return clonedArray;
};

let count = 0;

export const RepeatFields = (
  Inputs: any,
  index: any,
  dependencyControls: any
) => {
  let uniqueID = genUniqueId();
  let inputsCopy = [...Inputs];
  let dependencyControlsCopy = [...dependencyControls];
  let dependencyControlsCopy2 = [...dependencyControls];
  let BreakException = {};
  try {
    inputsCopy[index]?.fields?.forEach(function (el: any) {
      if (el?.removeUi) {
        throw BreakException;
      } else if (el?.uiType === "RepeatEnd") {
        throw BreakException;
      } else {
        count = count + 1;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  let arrayToBeAppended = inputsCopy[index]?.fields.slice(1, count);

  let newFields = arrayToBeAppended.map((items: any) => {
    return {
      ...items,
      searchID: uniqueID,
      controlId: items?.controlId + 100000,
      systemFieldName: items?.systemFieldName + uniqueID,
      displayFieldName: items?.displayFieldName + uniqueID,
      recursive: true,
    };
  });
  let modifiedDependencyControls = [...inputsCopy[index]?.dependencyControls];

  //
  let modDeepCopy = modifyDependencyControlArr(
    dependencyControlsCopy,
    uniqueID
  );
  //
  //
  const obj = {
    removeUi: true,
    searchID: newFields[0]?.searchID,
    dependencyControls: modDeepCopy,
  };
  let modifiedNewFields = [obj, ...newFields];
  let inputArrLength = inputsCopy[index].fields.length - 3;
  /////
  let n = [...inputsCopy[index].fields];

  modifiedNewFields.forEach((element: any, index: number) => {
    if (!element.uiType || element.uiType != "RadioButton") {
      return;
    }
    let uniqueName = Math.random() * 4;
    if (element.uiType || element.uiType === "RadioButton") {
      let modifiedOpts = element?.options.map((options: any) => {
        return {
          ...options,
          optionDataID: options?.optionDataID + uniqueName,
          // id: Math.random() * Math.random(),
          name: modifiedNewFields[0]?.dependencyControls[0].name,
        };
      });
      modifiedNewFields[index].options = modifiedOpts;
    }
  });

  let obj2 = {
    showDep: true,
    searchID: newFields[0]?.searchID,
    dependencyControls: modDeepCopy,
  };
  modifiedNewFields.push(obj2);
  n.splice(inputArrLength, 0, ...modifiedNewFields);
  ////

  ////
  inputsCopy[index].fields = n;
  count = 0;
  modifiedNewFields = [];
  return inputsCopy;
};
let counter = 0;

export const addCustomDependencies = (response: any) => {
  //let responseCopy = [...response];
  let uniqueID = genUniqueId();
  let responseCopy = JSON.parse(JSON.stringify(response));

  let index = responseCopy.findIndex(
    (item: any) => item?.sectionName === "Billing Information"
  );

  if (responseCopy[index]?.fields[count].length > 10) {
    return;
  }
  let obj = {
    removeUi: false,
    //searchID: newFields[0]?.searchID,
    dependencyControls: responseCopy[index]?.dependencyControls,
  };
  responseCopy[index]?.fields.splice(1, 0, obj);
  let BreakException = {};
  try {
    responseCopy[index]?.fields?.forEach(function (el: any) {
      if (el?.removeUi) {
        throw BreakException;
      } else if (el?.uiType === "RepeatEnd") {
        throw BreakException;
      } else {
        counter = counter + 1;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  let obj2 = {
    showDep: true,
    searchID: uniqueID,
    dependencyControls: responseCopy[index]?.dependencyControls,
  };
  responseCopy[index]?.fields.splice(8, 0, obj2);

  responseCopy[index]?.fields.forEach((elems: any, ind: number) => {
    if (ind < 1 || ind > 7) {
      return;
    }

    if (ind > 1 && ind < 8) {
      elems.searchID = uniqueID;
    }
  });
  return responseCopy;
  //
  //
  //
  //
};

export const getFilteredArr = (arr: any, callback: any) => {
  let filteredData = arr.filter(callback);
  return filteredData;
};
// export const abortHttpRequest = ()=>{
//   const controller = new AbortController;

// }
export const getUrlParameters = () => {
  const queryString = window.location.search;
  return new URLSearchParams(queryString);
};
