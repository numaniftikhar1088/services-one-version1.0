import {
  confirmPasswordValidator,
  emailValidator,
  facilityValidator,
  noValidator,
  nullValidator,
  passwordValidator,
  phoneNumberValidator,
} from "../../Utils/Validations";

///userrole initialstate
export const InitialState = {
  roleName: nullValidator,
  roleType: nullValidator,
};

///////facilityProvider Initialstate
export const facilityProviderInitialState = {
  npi: nullValidator,
  firstName: nullValidator,
  lastName: nullValidator,
  sex: nullValidator,
  email: emailValidator,
  facilities: facilityValidator,
};
/////////adduser initialState
export const setAddUserManegementFormState = {
  id: noValidator,
  firstName: nullValidator,
  lastName: nullValidator,
  adminEmail: emailValidator,
  adminType: nullValidator,
  phoneNumber: noValidator,
  // userGroupId: nullValidator,
};
export const setEdituserFormState = (state: any, editData: any) => {
  let initialState = {
    ...state,
    id: { ...noValidator, value: editData?.id },
    firstName: { ...nullValidator, value: editData?.firstName },
    lastName: { ...nullValidator, value: editData?.lastName },
    adminEmail: { ...emailValidator, value: editData?.adminEmail },
    adminType: { ...nullValidator, value: editData?.adminType },
    modules: { value: editData?.modules },
    phoneNumber: { ...noValidator, value: editData?.phoneNumber },
  };
  return initialState;
};
/////
export const setAddUserFormState = (activeType: string) => {
  let addUserInitState = {
    firstName: nullValidator,
    lastName: nullValidator,
    npiNumber: nullValidator,
    stateLicense: noValidator,
    gender: nullValidator,
    phoneNumber: phoneNumberValidator,
    accountType: nullValidator,
    userName: activeType === "0" ? nullValidator : noValidator,
    password: activeType === "0" ? passwordValidator : noValidator,
    reEnterPassetEditFormStatesword:
      activeType === "0" ? confirmPasswordValidator : noValidator,
    adminEmail: activeType === "1" ? emailValidator : noValidator,
    adminType: nullValidator,
    // userGroupId:nullValidator,
  };
  return addUserInitState;
};
export const initialState = {
  firstName: nullValidator,
  lastName: nullValidator,
  npiNumber: nullValidator,
  stateLicense: noValidator,
  gender: nullValidator,
  phoneNumber: phoneNumberValidator,
  accountType: nullValidator,
  username: nullValidator,
  password: noValidator,
  reEnterPassword: noValidator,
  email: emailValidator,
  adminType: nullValidator,
  // userGroupId:nullValidator,
};
export const setEditFormState = (state: any, editData: any) => {
  let initialState = {
    ...state,
    id: { ...noValidator, value: editData?.id },
    firstName: { ...nullValidator, value: editData?.firstName },
    lastName: { ...nullValidator, value: editData?.lastName },
    npiNumber: { ...nullValidator, value: editData?.npiNumber },
    stateLicense: { ...noValidator, value: editData?.stateLicense },
    gender: { ...nullValidator, value: editData?.gender },
    phoneNumber: { ...phoneNumberValidator, value: editData?.phoneNumber },
    accountType: { ...nullValidator, value: editData?.accountType },
    userName: { ...nullValidator, value: editData?.userName },
    password: passwordValidator,
    reEnterPassword: confirmPasswordValidator,
    adminEmail: { ...emailValidator, value: editData?.adminEmail },
    adminType: { ...nullValidator, value: editData?.adminType },
    //  userGroupId:{...nullValidator, value:editData?.userGroupId},
    modules: { value: editData?.modules },
  };
  return initialState;
};
/////

/////

export const setFormState = (valueToBeEdit: any) => {
  let idArr: any = [];
  let moduleIdsArr: any = [];
  let uniqueModuleid: any = [];
  let moduleId: any;

  valueToBeEdit.modules?.map((items: any) => {
    moduleId = items?.moduleId;
    items?.claims?.map((inner: any) => {
      if (inner?.isSelected) {
        idArr?.push(inner.claim.id);
        moduleIdsArr?.push(moduleId);
        uniqueModuleid = [...new Set(moduleIdsArr)];
      }
    });
  });
  const obj = {
    claimsArr: idArr,
    modulesArr: uniqueModuleid,
  };
  return obj;
};

export const setFormName = (InitialState: any, name: any) => {
  InitialState = {
    ...InitialState,
    roleName: {
      ...nullValidator,
      value: name.roleName,
    },
    roleType: {
      ...nullValidator,
      value: name.roleType,
    },
  };
  return InitialState;
};
// export const setFormType = (InitialState: any, name: any) => {
//   InitialState = {
//     ...InitialState,
//   };
//   return InitialState;
// };
