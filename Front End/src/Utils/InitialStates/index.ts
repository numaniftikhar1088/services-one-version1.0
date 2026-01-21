import {
  confirmPasswordValidator,
  emailValidator,
  noValidator,
  npiValidator,
  nullValidator,
  passwordValidator,
  phoneNumberValidator,
  zipcodeValidator
} from "../Validations";

export const initialState = {
  facilityName: nullValidator,
  address1: nullValidator,
  address2: noValidator,
  city: nullValidator,
  state: nullValidator,
  zipCode: zipcodeValidator,
  facilityPhone: phoneNumberValidator,
  facilityWebsite: noValidator,
  contactFirstName: nullValidator,
  contactLastName: nullValidator,
  contactPrimaryEmail: emailValidator,
  contactPhone: phoneNumberValidator,
  criticalFirstName: nullValidator,
  criticalLastName: nullValidator,
  criticalEmail: emailValidator,
  criticalPhoneNo: phoneNumberValidator,
  physicianFirstName: nullValidator,
  physicianLastName: nullValidator,
  phoneNumber: noValidator,
  npi: npiValidator,
  stateLicense: noValidator,
  activationType: nullValidator,
  username: nullValidator,
  email: emailValidator,
  password: noValidator,
  reEnterPassword: noValidator,
  shippingName: noValidator,
  shippingAddress: noValidator,
  shippingPhoneNumber: noValidator,
  shippingEmail: noValidator,
  shippingNote: noValidator,
  facilityFax: nullValidator,
  templateId: noValidator,
  labAssignment: nullValidator,
  groupNames: noValidator,
  gender: noValidator,
  mdFirstName: noValidator,
  mdLastName: noValidator,
  facilityLogoUrl: noValidator
};

// export const checkFormState = (
//   initialState: any,
//   activationType: any,
//   userExist?: any
// ) => {
//   return {
//     ...initialState,
//     username: activationType === 0 ? nullValidator : noValidator,
//     password: activationType === 0 ? passwordValidator : noValidator,
//     reEnterPassword:
//       activationType === 0 ? confirmPasswordValidator : noValidator,
//     email: activationType === 1 ? emailValidator : noValidator,
//   };
// };
export const checkFormState = (
  initialState: any,
  activationType: any,
  userExist: any
) => {
  const getUsernameValidator = () => {
    if (userExist) {
      return noValidator;
    }
    return activationType === 0 ? nullValidator : noValidator;
  };
  const getPasswordValidator = () => {

    if (userExist) {
      return noValidator;
    } else return activationType === 0 ? passwordValidator : noValidator;
  };

  const getReEnterPasswordValidator = () => {
    if (userExist) {
      return noValidator;
    } else return activationType === 0 ? confirmPasswordValidator : noValidator;
  };

  const getEmailValidator = () => {
    return activationType === 1 ? emailValidator : noValidator;
  };

  return {
    ...initialState,
    username: getUsernameValidator(),
    password: getPasswordValidator(),
    reEnterPassword: getReEnterPasswordValidator(),
    email: getEmailValidator(),
  };
};

export const checkFormStateForAlreadyExistUser = (
  initialState: any,
  userExist?: boolean
) => {
  return {
    ...initialState,
    username: userExist ? noValidator : nullValidator,
    password: userExist ? noValidator : passwordValidator,
    reEnterPassword: userExist ? noValidator : confirmPasswordValidator,
  };
};