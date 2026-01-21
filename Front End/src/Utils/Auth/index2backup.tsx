import { Route } from "react-router-dom";
var CryptoJS = require("crypto-js");

export const getToken = () => {
  const userInfo: any = localStorage.getItem("userinfo") || "";
  let parsedUserInfo;
  if (userInfo) {
    parsedUserInfo = JSON.parse(Decrypt(userInfo));
    return parsedUserInfo.token;
  }
  if (!userInfo) {
    return undefined;
  }
};

////
export const getTokenData = () => {
  const userInfo: any = localStorage.getItem("userinfo") || "";
  let parsedUserInfo;
  if (userInfo) {
    parsedUserInfo = JSON.parse(Decrypt(userInfo));
    return parsedUserInfo;
  }
  if (!userInfo) {
    return undefined;
  }
};
////
export const GetSiteKey = () => {
  const { protocol, hostname } = window.location;
  if (hostname.split(".").length > 1) return hostname.split(".")[1];
  else return hostname.split(".")[0];
  // return `${protocol}//${subdomain}.example.com`;
};

export const getMachineKey = (): string | undefined => {
  if (navigator && navigator.userAgent) {
    const userAgent = navigator.userAgent;
    let machineKey = btoa(userAgent);
    machineKey = machineKey.substring(0, 50);
    return machineKey;
  }
  return undefined;
};
export const Encrypt = (word: string) => {
  let key = getMachineKey();
  let encJson = CryptoJS.AES.encrypt(JSON.stringify(word), key).toString();
  let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
  // let encryptedData;
  // try {
  //   encryptedData = await Commonservice.SaveEncodedText(encData);
  // } catch (error) {
  //   console.trace(error);
  // }
  // 

  return encData;
};
export function Decrypt(word: string | null) {
  let key = getMachineKey();
  let decData = CryptoJS.enc.Base64.parse(word)?.toString(CryptoJS.enc.Utf8);
  let bytes = CryptoJS.AES.decrypt(decData, key)?.toString(CryptoJS.enc.Utf8);
  return JSON.parse(bytes);
}

export const getParameterByName = (name: any, url: any): string | null => {


  ///
  const params = new URLSearchParams(url.split("?")[1]);
  return params.get(name);
};

//get machine key in typescrip

export function getRoutes(routesArr: any) {
  const routes = [];
  for (let i = 0; i < routesArr.length; i++) {
    const Element = routesArr[i].element;
    routes.push(
      <Route path={routesArr[i].path} element={<Element />} key={i} />
    );
  }

  return routes;
}

export const setLabCredentials = (pathname: string, loginData: any) => {
  let filteredDataBasedonUrl = loginData?.authTenants?.filter(
    (item: any) => item.url === pathname
  );
  if (filteredDataBasedonUrl.length > 0) {
    return filteredDataBasedonUrl[0];
  }
};

export const checkIsSelected = (authTenants: any) => {
  let selectedTenants = authTenants.filter((items: any) => items?.isSelected);
  return selectedTenants;
};

export const setHardCodedDefaultLab = (data: any) => {
  data.authTenants.forEach((items: any, index: any, arrayItself: any) => {
    arrayItself[0].isSelected = true;
  });
  return data;
};
export const GetSelectedTenant = (authTenants: any) => {
  let selectedTenants = authTenants.find((items: any) => items?.isSelected);
  return selectedTenants;
};
export const GetAdminTypeFromTenant = (tenant: any) => {
  return tenant.infomationOfLoggedUser.adminType;
};
export const GetDefaultTenant = (authTenants: any) => {
  let DefaultTenants = authTenants.find((items: any) => items?.isDefault);
  return DefaultTenants;
};
export const GetLoggedUserInfo = (authTenants: any) => {
  let selectedTenants = authTenants.find((items: any) => items?.isSelected);
  return selectedTenants;
};

export const getLoggedInLabDetails = (loginData: any) => {
  let isSelectedTenantsInfo = loginData?.authTenants?.filter(
    (tenantsInfo: any) => tenantsInfo.isSelected === true
  );
  isSelectedTenantsInfo =
    loginData?.authTenants?.length === 1
      ? loginData?.authTenants[0]
      : isSelectedTenantsInfo.length > 0
        ? isSelectedTenantsInfo[0]
        : null;

  // let isSelectedTenantsInfoCount =
  //   loginData?.authTenants?.length === 1 ? 1 : isSelectedTenantsInfo.length;
  let userType = loginData?.authTenants[0]?.infomationOfLoggedUser?.userType;
  let adminType = loginData?.authTenants[0]?.infomationOfLoggedUser?.adminType;
  let isFacilityUser =
    loginData?.authTenants[0]?.infomationOfLoggedUser?.adminType === "FACILITY";
  let selectedLabFacilities;
  if (isSelectedTenantsInfo) {
    selectedLabFacilities =
      isSelectedTenantsInfo?.infomationOfLoggedUser?.facilities;
  }

  return {
    authTenants: loginData.authTenants,
    listCount: loginData.authTenants.length,
    userType: userType ? userType : adminType,
    adminType: adminType,
    isFacilityUser: isFacilityUser,
    selectedTenantsInfo: isSelectedTenantsInfo,
    //   selectedTenantsInfoCount: isSelectedTenantsInfoCount,
    SelectedLabFacilities: selectedLabFacilities,
  };
};

export const assignFormValues = (
  Inputs: any,
  dependenceyControls: any,
  index: any,
  depControlIndex: any,
  fieldIndex: any,
  inputValue: any,
  isDependency: boolean,
  repeatFieldSection: boolean,
  isDependencyRepeatFields: boolean,
  repeatFieldIndex: any,
  repeatDependencySectionIndex: any,
  repeatDepFieldIndex: any
) => {
  if (repeatFieldSection) {
    if (!isDependencyRepeatFields) {
      // overAllRepeatFields[index].fieldIndex.defaultValue = inputValue;
      Inputs[index].fields[fieldIndex].repeatFields[
        repeatFieldIndex
      ].defaultValue = inputValue;
    }
    if (isDependencyRepeatFields) {
      // overAllRepeatFields[index].fieldIndex.defaultValue = inputValue;
      Inputs[index].fields[fieldIndex].repeatDependencyControls[
        repeatDependencySectionIndex
      ].dependecyFields[repeatDepFieldIndex].defaultValue = inputValue;
    }
  }
  if (!isDependency) {
    Inputs[index].fields[fieldIndex].defaultValue = inputValue;
  }
  if (isDependency) {
    Inputs[index].dependencyControls[depControlIndex].dependecyFields[
      fieldIndex
    ].defaultValue = inputValue;
  }
};
///////
export const formValuesForApi = (Inputs: any) => {
  let obj: any = {
    requisitionId: 0,
    sectionWithControls: [],
  };


  Inputs.forEach((SectionData: any) => {
    let parentObj: any = {
      sectionId: SectionData?.sectionId,
      sectionName: SectionData?.sectionName,
      systemFields: [],
      customFields: [],
    };
    SectionData.fields.forEach((fieldsData: any) => {
      var arraylst = GetFieldData(fieldsData, SectionData);
      if (fieldsData?.sectionType == 1) {
        parentObj.systemFields = parentObj.systemFields?.concat(arraylst);
      }
      if (fieldsData?.sectionType == 2) {
        parentObj.customFields = parentObj.customFields?.concat(arraylst);
      }
    });
    if (
      parentObj?.systemFields.length > 0 ||
      parentObj.customFields.length > 0
    ) {
      obj.sectionWithControls = [...obj.sectionWithControls, parentObj];
    }
  });
  let billingInformationFields = Inputs.filter(
    (inputsData: any) => inputsData?.sectionName === "Billing Information"
  );

  const formDataWithBillingInfo = formValuesForApiBillingInformation(
    billingInformationFields,
    obj
  );
  return formDataWithBillingInfo;
};
const GetFieldData = (fieldsData: any, SectiontData: any) => {
  var lst: any[] = [];
  if (!fieldsData?.defaultValue) return lst;
  let fieldLevelObj = {
    controlId: fieldsData?.controlId,
    controlName: fieldsData?.systemFieldName,
    controlValue: fieldsData?.defaultValue,
  };
  lst.push(fieldLevelObj);

  var option = SectiontData?.dependencyControls?.filter(
    (x: any) => x.value === fieldsData?.defaultValue
  );

  if (option.length == 0) return lst;
  option.forEach((dependecyData: any) => {
    dependecyData?.dependecyFields.forEach((fieldsDataDependecies: any) => {
      var arraylst = GetFieldData(fieldsDataDependecies, SectiontData);
      lst = lst.concat(arraylst);
    });
  });

  return lst;
};
///////////////////////for billing information
const GetBillingInformationFieldData = (fieldsData: any, SectiontData: any) => {
  var lst: any[] = [];
  if (!fieldsData?.defaultValue) return lst;
  let fieldLevelObj = {
    controlId: fieldsData?.controlId,
    controlName: fieldsData?.systemFieldName,
    controlValue: fieldsData?.defaultValue,
  };
  lst.push(fieldLevelObj);

  var option = SectiontData?.repeatDependencyControls?.filter(
    (x: any) => x.value === fieldsData?.defaultValue
  );


  if (option.length == 0) return lst;
  option.forEach((dependecyData: any) => {
    dependecyData?.dependecyFields.forEach((fieldsDataDependecies: any) => {
      var arraylst = GetBillingInformationFieldData(
        fieldsDataDependecies,
        SectiontData
      );
      lst = lst.concat(arraylst);
    });
  });

  return lst;
};
const formValuesForApiBillingInformation = (
  billingInformationFields: any,
  obj: any
) => {
  billingInformationFields.forEach((SectionData: any) => {

    SectionData.fields.forEach((fieldsLevelData: any) => {
      if (fieldsLevelData?.displayFieldName !== "Repeat Start") return;
      let parentObj: any = {
        sectionId: SectionData?.sectionId,
        sectionName: SectionData?.sectionName,
        systemFields: [],
        customFields: [],
      };
      fieldsLevelData.repeatFields.forEach((fieldsData: any) => {

        var arraylst = GetBillingInformationFieldData(
          fieldsData,
          fieldsLevelData
        );
        //var arraylst: any = [];
        if (fieldsData?.sectionType == 1) {
          parentObj.systemFields = parentObj.systemFields?.concat(arraylst);
        }
        if (fieldsData?.sectionType == 2) {
          parentObj.customFields = parentObj.customFields?.concat(arraylst);
        }
      });
      if (
        parentObj?.systemFields.length > 0 ||
        parentObj.customFields.length > 0
      ) {
        obj.sectionWithControls = [...obj.sectionWithControls, parentObj];
      }
    });
  });
  return obj;
};
/////
