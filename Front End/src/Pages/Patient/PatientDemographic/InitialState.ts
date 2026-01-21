import { useState } from "react";
import {
  nullValidator,
  noValidator,
  emailValidator,
  phoneNumberValidator,
  zipcodeValidator,
  weightValidator,
} from "../../../Utils/Validations";

export const InitialState = {
  firstName: nullValidator,
  middleName: noValidator,
  lastName: nullValidator,
  dateOfBirth: nullValidator,
  gender: nullValidator,
  ethnicity: nullValidator,
  race: nullValidator,
  patientType: nullValidator,
  socialSecurityNumber: noValidator,
  passportNumber: noValidator,
  dlidNumber: noValidator,
  county: noValidator,
  landPhone: noValidator,
  mobile: nullValidator,
  email: emailValidator,
  height: noValidator,
  weight: noValidator,
  facilityId: nullValidator,
  address1: nullValidator,
  address2: noValidator,
  zipCode: nullValidator,
  state: nullValidator,
  city: nullValidator,
  country: noValidator,
  patientAddressId: noValidator,
  groupNumber: noValidator,
  insuranceProviderId: noValidator,
  policyId: noValidator,
  subscriberName: noValidator,
  sdob: noValidator,
  srelation: noValidator,
  insuranceId: noValidator,
  insurancePhone: noValidator,
  billingType: noValidator,
};
export const setFormState = (initialState: any, editData: any) => {
  const {
    patientId,
    dateOfBirth,
    firstName,
    gender,
    lastName,
    middleName,
    ethnicity,
    race,
    patientType,
    passportNumber,
    socialSecurityNumber,
    dlidNumber,
  } = editData;

  const { email, phoneNumber, mobileNumber, weight, height, county, facility, address1, address2, city, state, zipCode } =
    editData?.address || {};
console.log(editData, "editData")
  
  initialState = {
    ...(typeof patientId !== "undefined" && {
      id: { ...noValidator, value: patientId },
    }),
    ...(editData?.patientAddress && {
      patientAddressID: { ...noValidator, value: editData.patientAddress.id },
    }),
    ...(typeof firstName !== "undefined" && {
      firstName: { ...nullValidator, value: firstName },
    }),
    ...(typeof middleName !== "undefined" && {
      middleName: { ...noValidator, value: middleName },
    }),
    ...(typeof lastName !== "undefined" && {
      lastName: { ...nullValidator, value: lastName },
    }),
    ...(typeof dateOfBirth !== "undefined" && {
      dateOfBirth: { ...nullValidator, value: dateOfBirth },
    }),
    ...(typeof gender !== "undefined" && {
      gender: { ...nullValidator, value: gender },
    }),
    ...(typeof ethnicity !== "undefined" && {
      ethnicity: { ...noValidator, value: ethnicity },
    }),
    ...(typeof race !== "undefined" && {
      race: { ...noValidator, value: race },
    }),
    ...(typeof patientType !== "undefined" && {
      patientType: { ...nullValidator, value: patientType },
    }),
    ...(typeof socialSecurityNumber !== "undefined" && {
      socialSecurityNumber: { ...noValidator, value: socialSecurityNumber },
    }),
    ...(typeof passportNumber !== "undefined" && {
      passportNumber: { ...noValidator, value: passportNumber },
    }),
    ...(typeof dlidNumber !== "undefined" && {
      dlidNumber: { ...noValidator, value: dlidNumber },
    }),
    ...(typeof county !== "undefined" && {
      county: { ...noValidator, value: county },
    }),
    ...(typeof phoneNumber !== "undefined" && {
      landPhone: { ...noValidator, value: phoneNumber },
    }),
    ...(typeof mobileNumber !== "undefined" && {
      mobile: { ...phoneNumberValidator, value: mobileNumber },
    }),
    ...(typeof email !== "undefined" && {
      email: { ...emailValidator, value: email },
    }),
    ...(typeof height !== "undefined" && {
      height: { ...noValidator, value: height },
    }),
    ...(typeof weight !== "undefined" && {
      weight: { ...noValidator, value: weight },
    }),
    ...(typeof facility !== "undefined" && {
      facilityId: { ...nullValidator, value: facility },
    }),
    ...(typeof address1 !== "undefined" && {
      address1: { ...nullValidator, value: address1 },
    }),
    ...(typeof address2 !== "undefined" && {
      address2: { ...noValidator, value: address2 },
    }),
    ...(typeof zipCode !== "undefined" && {
      zipCode: { ...zipcodeValidator, value: zipCode },
    }),
    ...(typeof state !== "undefined" && {
      state: { ...nullValidator, value: state },
    }),
    ...(typeof city !== "undefined" && {
      city: { ...nullValidator, value: city },
    }),
    // ...(typeof country !== "undefined" && {
    //   country: { ...noValidator, value: country },
    // }),

    ...(editData?.patientInsurances &&
      editData.patientInsurances.length > 0 && {
        groupNumber: {
          ...noValidator,
          value: editData.patientInsurances[0]?.groupNumber || null,
        },
        insurance: {
          ...noValidator,
          value: editData.patientInsurances[0]?.insurance || null,
        },
        patientId: { ...noValidator, value: editData.patientId },
        patientInsuranceId: {
          ...noValidator,
          value: editData.patientInsurances[0]?.patientInsuranceId || null,
        },
        insuranceProvider: {
          ...noValidator,
          value: editData.patientInsurances[0]?.insuranceProvider || null,
        },
        insurancePhone: {
          ...noValidator,
          value: editData.patientInsurances[0]?.insurancePhone || null,
        },
        policyId: {
          ...noValidator,
          value: editData.patientInsurances[0]?.policyNumber || null,
        },
        subscriberName: {
          ...noValidator,
          value: editData.patientInsurances[0]?.subscriberName || null,
        },
        subscriberDateOfBirth: {
          ...noValidator,
          value: editData.patientInsurances[0]?.subscriberDateOfBirth || null,
        },
        subscriberRelation: {
          ...noValidator,
          value:
            editData.patientInsurances[0].subscriberRelation?.trim() || null,
        },
      }),
  };

  return initialState;
};

export const searchInitialState = {
  patientFirstName: noValidator,
  patientLastName: noValidator,
  dob: noValidator,
  gender: noValidator,
  mobile: noValidator,
  email: noValidator,
};

export const setSearchInitialState = (initialState: any) => {
  initialState = {
    patientFirstName: {
      ...noValidator,
      value: "",
    },
    patientLastName: {
      ...noValidator,
      value: "",
    },
    dob: {
      ...noValidator,
      value: "",
    },
    gender: {
      ...noValidator,
      value: "",
    },
    mobile: {
      ...noValidator,
      value: "",
    },
    email: {
      ...noValidator,
      value: "",
    },
  };
  return initialState;
};
