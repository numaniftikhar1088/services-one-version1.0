export const noValidator = {
  value: "",
};
export const nullValidator = {
  value: "",
  required: true,
};
export const facilityValidator = {
  value: "",
  required: true,
  requiredMessage: "Facility Id is required!",
};
export const phoneNumberValidator = {
  value: "",
  required: true,
  minLength: 14,
  minLengthMessage: "Phone no should contain 10 digits",
};
export const npiValidator = {
  value: "",
  required: true,
  minLength: 10,
  maxLength: 10,
  minLengthMessage: "npi should contain 10 digits",
};
export const phoneNumberWithNullValidator = {
  value: "",
  required: false,
  minLength: 10,
  minLengthMessage: "Phone no should contain 10 digits",
};
export const threeDigitsCode = {
  value: "",
  required: true,
  minLength: 3,
  minLengthMessage: "Enter just 3 digits",
};
export const lengthValidator = {
  value: "",
  required: false,
  minLength: 6,
  minLengthMessage: "Address must be at least 6 characters long!",
  maxLength: 16,
  maxLengthMessage: "Too many characters!",
};

export const emailValidator = {
  value: "",
  required: true,
  requiredMessage: "Email address is required!",
  email: true,
  emailMessage: "Email address is not valid!",
};

export const ImageValidator = {
  value: {},
  required: true,
  file: true,
  allowedTypes: ["jpg", "jpeg", "png", "gif"],
  maxFileSize: 1024,
};

export const termsValidator = {
  value: false,
  required: true,
  requiredMessage: "You need to accept our Terms and Conditions!",
};
export const zipcodeValidator = {
  value: "",
  required: true,
  minLength: 5,
  maxLength: 5,
  minLengthMessage: "Zip Code should contain 5 digits",
};
export const weightValidator = {
  value: "",
  required: true,
  requiredMessage: "You need to enter numeric value!",
  minLength: 2,
  minLengthMessage: "Weight value should be digits",
};
export const passwordValidator = {
  value: "",
  required: true,
  minLength: 8,
  minLengthMessage: "Password must be at least 8 characters long!",
  maxLength: 16,
  maxLengthMessage: "Too many characters!",
};

export const confirmPasswordValidator = {
  value: "",
  required: true,
  matchWith: "password",
  matchWithMessage: "Password values must be equal!",
};
