import {
  nullValidator,
  noValidator,
  emailValidator,
  phoneNumberValidator,
  passwordValidator,
  confirmPasswordValidator,
  phoneNumberWithNullValidator,
  threeDigitsCode,
} from "../../../../Utils/Validations";

export const initialState = {
  labName: nullValidator,
  labDisplayName: nullValidator,
  portalLogo: nullValidator,
  clia: nullValidator,
  enter3DigitsProgram: nullValidator,
  enter3DigitsLabCode: nullValidator,
  labType: { ...noValidator, value: "2" },
  enableReferenceId: { ...noValidator, value: "true" },
  status: { ...nullValidator, value: true },
  email: emailValidator,
  phone: phoneNumberValidator,
  Dirphone: phoneNumberValidator,
  fax: noValidator,
  firstName: nullValidator,
  middleName: noValidator,
  lastName: nullValidator,
  emailAddress: emailValidator,
  mobile: nullValidator,
  phone1: noValidator,
  address__1: nullValidator,
  address__2: noValidator,
  Diraddress__1: nullValidator,
  Diraddress__2: noValidator,
  city1: nullValidator,
  Dircity1: nullValidator,
  state1: nullValidator,
  Dirphone1: phoneNumberValidator,
  Dirstate1: nullValidator,
  zipCode1: nullValidator,
  DirzipCode1: nullValidator,
  // capInfoNumber: (formData: any) => formData.noCapProvider?.value === "true" ? nullValidator : noValidator,
  capInfoNumber: noValidator,
  noCapProvider: noValidator,
};

export const EditInitialState = (state: any, editData: any) => {
  let initialState = {
    ...state,
    referenceLabId: { ...noValidator, value: editData?.referenceLabId },
    labName: { ...nullValidator, value: editData?.labName },
    labDisplayName: { ...nullValidator, value: editData?.labDisplayName },
    portalLogo: { ...nullValidator, value: editData?.portalLogo },
    clia: { ...nullValidator, value: editData?.clia },
    enter3DigitsProgram: {
      ...nullValidator,
      value: editData?.enter3DigitsProgram,
    },
    enter3DigitsLabCode: {
      ...nullValidator,
      value: editData?.enter3DigitsLabCode,
    },
    labType: {
      ...noValidator,
      value: editData?.labType === "In-House" ? "1" : "2",
    },
    enableReferenceId: {
      ...noValidator,
      value: editData?.enableReferenceId === true ? "Yes" : "No",
    },
    status: { ...nullValidator, value: editData?.status },

    email: { ...emailValidator, value: editData?.labAddress?.email },
    phone: { ...phoneNumberValidator, value: editData?.labAddress?.phone },
    fax: { ...noValidator, value: editData?.labAddress?.fax },
    // address_1: {...nullValidator, value:editData?.address_1},
    // address_2: {...noValidator, value:editData?.address_2},
    // city: {...noValidator, value:editData?.cityd},
    // state: {...noValidator, value:editData?.state},
    // zipCode: {...noValidator, value:editData?.zipCode},

    labDirectorId: {
      ...noValidator,
      value: editData?.labDirectorInfo?.labDirectorId,
    },
    firstName: {
      ...nullValidator,
      value: editData?.labDirectorInfo?.firstName,
    },
    middleName: {
      ...noValidator,
      value: editData?.labDirectorInfo?.middleName,
    },
    lastName: { ...nullValidator, value: editData?.labDirectorInfo?.lastName },
    emailAddress: {
      ...noValidator,
      value: editData?.labDirectorInfo?.emailAddress,
    },
    mobile: { ...nullValidator, value: editData?.labDirectorInfo?.mobile },

    phone1: { ...noValidator, value: editData?.labDirectorInfo?.phone },
    address__1: { ...nullValidator, value: editData?.labAddress?.address__1 },
    address__2: { ...noValidator, value: editData?.labAddress?.address__2 },
    city1: { ...noValidator, value: editData?.labAddress?.city1 },
    state1: { ...noValidator, value: editData?.labAddress?.state1 },
    zipCode1: { ...noValidator, value: editData?.labAddress?.zipCode1 },

    capInfoNumber: {
      ...nullValidator,
      value: editData?.labDirectorInfo?.capInfoNumber,
    },
    noCapProvider: {
      ...noValidator,
      value: editData?.labDirectorInfo?.noCapProvider === "true" ? true : false,
    },
  };
  return initialState;
};
