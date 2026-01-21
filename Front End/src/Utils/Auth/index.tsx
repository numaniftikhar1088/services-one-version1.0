import moment from "moment";
import { Navigate, Route } from "react-router-dom";
import store from "Redux/Store/AppStore";
import PageNotFound from "../../Shared/Common/Pages/PageNotFound";
import { PortalTypeEnum } from "../Common/Enums/Enums";
import { do_it, isJson } from "../Common/Requisition";
import { toast } from "react-toastify";
var CryptoJS = require("crypto-js");

export const getToken = () => {
  //const userInfo: any = localStorage.getItem("userinfo") || "";

  let UserInfo = "";
  let persistData: any = localStorage.getItem("persist:root");
  let checkIsJson = isJson(persistData);
  let reduxParsedData: any = "";
  let reduxReducerParsedData: any = "";
  if (checkIsJson) {
    reduxParsedData = JSON.parse(persistData);
    let checkIsJsonReducer = isJson(reduxParsedData?.Reducer);
    if (checkIsJsonReducer) {
      reduxReducerParsedData = JSON.parse(reduxParsedData?.Reducer);
    }
  }
  if (
    reduxReducerParsedData?.userInfo?.constructor === Object &&
    Object.keys(reduxReducerParsedData?.userInfo)?.length === 0
  ) {
    reduxReducerParsedData.userInfo = "";
  }

  //
  const userInfo: any = sessionStorage.getItem("userinfo") || "";
  const userInfoLocalStorage = localStorage.getItem("userinfo") || "";
  let parsedUserInfo;
  UserInfo = userInfo
    ? userInfo
    : userInfoLocalStorage
      ? userInfoLocalStorage
      : reduxReducerParsedData?.userInfo;
  if (UserInfo) {
    if (process.env.NODE_ENV === "development") {
      parsedUserInfo = JSON.parse(Decrypt(UserInfo));
    }
    if (process.env.NODE_ENV === "production") {
      let decryptedUserInfo = Decrypt(UserInfo);
      let checkIsJson = isJson(decryptedUserInfo);
      if (checkIsJson) {
        parsedUserInfo = JSON.parse(decryptedUserInfo);
      } else {
        parsedUserInfo = decryptedUserInfo;
      }
    }
    const userInfoRedux: any = sessionStorage.getItem("userinfo") || "";
    if (!userInfoRedux) {
      sessionStorage.setItem("userinfo", reduxReducerParsedData?.userInfo);
    }
    return parsedUserInfo.token;
  }
  if (!UserInfo) {
    return undefined;
  }
};
const now = new Date();
export let validationExpression =
  "yup.string().required('Value is Required as you have checked the options')";
////
export const getTokenData = () => {
  const userInfo: any = sessionStorage?.getItem("userinfo") || "";
  let parsedUserInfo;

  if (userInfo) {
    parsedUserInfo = JSON?.parse(Decrypt(userInfo));
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

const generateRandomKey = () => {
  return (
    navigator.appCodeName +
    navigator.appName +
    navigator.language +
    navigator.platform
  );
};

export const Encrypt = (word: string) => {
  var ciphertext = CryptoJS.AES.encrypt(word, generateRandomKey()).toString();
  return ciphertext;
};

export function Decrypt(word: string | null) {
  var bytes = CryptoJS.AES.decrypt(word, generateRandomKey());
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export const getParameterByName = (name: any, url: any): string | null => {
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
  // fallback route
  routes.push(
    <Route path="*" element={<Navigate to="/" replace />} key="fallback" />
  );

  return routes;
}

export function compareRoutes(routesArr: any, menus: any) {
  const extractPaths = (claims: any[]): string[] => {
    return claims?.flatMap((claim: any) => {
      const paths: string[] = [];
      if (claim?.linkUrl) {
        let updatedUrl = claim.linkUrl.replace(/^\//, "");
        paths.push(updatedUrl);
      }
      if (claim?.subClaims) {
        paths.push(...extractPaths(claim?.subClaims));
      }
      return paths;
    });
  };
  // Extract paths from menus
  const menuPaths = menus?.flatMap((menu: any) =>
    extractPaths(menu?.claims || [])
  );
  // Find common paths
  const commonPaths = routesArr?.filter((route: any) =>
    menuPaths?.includes(route?.path)
  );
  return commonPaths;
}
export function getAuthRoutes(routesArr: any, menus: any) {
  let extractedRoutes = compareRoutes(routesArr, menus);
  const routes = [];
  for (let i = 0; i < extractedRoutes?.length; i++) {
    const Element = extractedRoutes[i]?.element;
    routes.push(
      <Route path={extractedRoutes[i]?.path} element={<Element />} key={i} />
    );
  }
  routes.push(<Route path="*" element={<PageNotFound />} key="not-found" />);
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
  let selectedTenantInfo = loginData?.authTenants?.find(
    (tenantsInfo: any) => tenantsInfo.isSelected
  );

  let userType: number = loginData?.userType;
  let adminType = selectedTenantInfo
    ? selectedTenantInfo?.infomationOfLoggedUser?.adminType
    : null;
  let isFacilityUser = selectedTenantInfo
    ? selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
    PortalTypeEnum.Facility
    : null;
  let selectedLabFacilities;
  if (selectedTenantInfo) {
    selectedLabFacilities =
      selectedTenantInfo?.infomationOfLoggedUser?.facilities;
  }

  return {
    authTenants: loginData.authTenants,
    tenantCount: loginData.authTenants.length,
    userType: userType,
    adminType: adminType,
    isFacilityUser: isFacilityUser,
    selectedTenantsInfo: selectedTenantInfo,
    SelectedLabFacilities: selectedLabFacilities,
  };
};
export function fnBrowserDetect() {
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName = navigator.appName;
  var fullVersion = "" + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix;

  // In Opera, the true version is after "OPR" or after "Version"
  if ((verOffset = nAgt.indexOf("OPR")) != -1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset + 4);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In MS Edge, the true version is after "Edg" in userAgent
  else if ((verOffset = nAgt.indexOf("Edg")) != -1) {
    browserName = "Microsoft Edge";
    fullVersion = nAgt.substring(verOffset + 4);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset + 5);
  }
  // In Chrome, the true version is after "Chrome"
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset + 7);
  }
  // In Safari, the true version is after "Safari" or after "Version"
  else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1)
      fullVersion = nAgt.substring(verOffset + 8);
  }
  // In Firefox, the true version is after "Firefox"
  else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset + 8);
  }
  // In most other browsers, "name/version" is at the end of userAgent
  else if (
    (nameOffset = nAgt.lastIndexOf(" ") + 1) <
    (verOffset = nAgt.lastIndexOf("/"))
  ) {
    browserName = nAgt.substring(nameOffset, verOffset);
    fullVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(";")) != -1)
    fullVersion = fullVersion.substring(0, ix);
  if ((ix = fullVersion.indexOf(" ")) != -1)
    fullVersion = fullVersion.substring(0, ix);

  majorVersion = parseInt("" + fullVersion, 10);
  if (isNaN(majorVersion)) {
    fullVersion = "" + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }
  return {
    nAgt,
    browserName,
    fullVersion,
    majorVersion,
    nameOffset,
    verOffset,
    ix,
  };
}
export function getOS() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }

  return os;
}

// export const convertTextToImage = (text: any, width = 500, height = 300) => {
//   // Create a canvas element
//   if (text) {
//     if (text.include("!")) {
//     } else {
//       const canvas = document.createElement("canvas");
//       canvas.width = width;
//       canvas.height = height;
//       // Get the 2D rendering context
//       const context = canvas.getContext("2d");
//       if (!context) throw new Error("Failed to get 2D context");
//       context.font = `20px Georgia`; // Use a basic font
//       context.textAlign = "center"; // Center horizontally
//       context.textBaseline = "middle"; // Center vertically
//       // Draw the text centered in the canvas
//       context.fillText(text, canvas.width / 2, canvas.height / 2);
//       // Return the Base64-encoded image
//       return canvas.toDataURL("image/png");
//     }
//   }
// };
// export const convertTextToImageForText = (
//   text: any,
//   width = 500,
//   height = 300
// ) => {
//   // Create a canvas element
//   const canvas = document.createElement("canvas");
//   if (text) {
//     canvas.width = width;
//     canvas.height = height;
//     const context = canvas.getContext("2d");
//     if (!context) throw new Error("Failed to get 2D context");
//     // Set font properties
//     context.font = `20px Georgia`; // Use a basic font
//     context.textAlign = "center"; // Center horizontally
//     context.textBaseline = "middle"; // Center vertically
//     if (text.includes("!")) {
//       // Split the text by "!" and handle multi-line rendering
//       const lines = text.split("!"); // Split the text by "!"
//       const lineHeight = 30; // Set line height for spacing
//       const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2; // Center vertically based on line count
//       // Draw each line
//       lines.forEach((line: any, index: any) => {
//         context.fillText(
//           line.trim(),
//           canvas.width / 2,
//           startY + index * lineHeight
//         );
//       });
//     } else {
//       // If no "!", render the text as a single line in the center
//       context.fillText(text, canvas.width / 2, canvas.height / 2);
//     }
//     return canvas?.toDataURL("image/png");
//   } else {
//     return "clear";
//   }
// };
export const convertTextToImageForText = (
  text: any,
  width = 500,
  height = 300
) => {
  // Create a canvas element
  const canvas = document.createElement("canvas");
  if (text) {
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to get 2D context");

    // Set font properties (using "Farmhouse" font, fallback to sans-serif if unavailable)
    context.font = `20px 'Farmhouse', sans-serif`;
    context.textAlign = "center"; // Center horizontally
    context.textBaseline = "middle"; // Center vertically

    if (text.includes("!")) {
      // Split the text by "!" and handle multi-line rendering
      const lines = text.split("!"); // Split the text by "!"
      const lineHeight = 30; // Set line height for spacing
      const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2; // Center vertically based on line count
      // Draw each line
      lines.forEach((line: any, index: any) => {
        context.fillText(
          line.trim(),
          canvas.width / 2,
          startY + index * lineHeight
        );
      });
    } else {
      // If no "!", render the text as a single line in the center
      const textWidth = context.measureText(text).width;
      const maxWidth = width - 20; // To prevent stretching, ensure some padding
      if (textWidth > maxWidth) {
        // If text is too long, scale it to fit within the canvas
        let scale = maxWidth / textWidth;
        context.font = `${20 * scale}px 'Farmhouse', sans-serif`; // Adjust font size dynamically
      }
      context.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    return canvas?.toDataURL("image/png");
  } else {
    return "clear";
  }
};

export const convertTextToImage = (text: any, width?: number, height?: number) => {
  // Get screen width and adjust canvas size accordingly
  const screenWidth = window.innerWidth;
  const maxWidth = screenWidth < 768 ? screenWidth - 40 : width || 700;
  const scaleFactor = maxWidth / 700;
  const canvasHeight = (height || 300) * scaleFactor;

  const canvas = document.createElement("canvas");

  if (text) {
    canvas.width = maxWidth;
    canvas.height = canvasHeight;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to get 2D context");

    const lines = text.split("!");

    // Adjust font sizes based on scale
    const baseFontSize = 20 * scaleFactor;
    const largerFontSize = 28 * scaleFactor;
    const smallerFontSize = 16 * scaleFactor;
    const lineHeight = 30 * scaleFactor;

    context.textAlign = "center";
    context.textBaseline = "middle";

    const startY = canvas.height / 2 - ((lines.length - 3) * lineHeight) / 2;

    // First line (bold italic)
    context.font = `italic bold ${largerFontSize}px Georgia`;
    context.fillText(lines[0].trim(), canvas.width / 2, startY - 10 * scaleFactor);

    // Middle lines (regular font)
    context.font = `normal ${baseFontSize}px Arial`;
    for (let i = 1; i < lines.length - 2; i++) {
      context.fillText(lines[i].trim(), canvas.width / 2, startY + i * lineHeight);
    }

    // Last two lines in corners (smaller font)
    const secondLastLine = lines[lines.length - 2].trim();
    const lastLine = lines[lines.length - 1].trim();

    context.font = `normal ${smallerFontSize}px Georgia`;
    context.textAlign = "left";
    context.fillText(secondLastLine, 10 * scaleFactor, canvas.height - 40 * scaleFactor);

    context.textAlign = "right";
    context.fillText(lastLine, canvas.width - 10 * scaleFactor, canvas.height - 40 * scaleFactor);

    return canvas.toDataURL("image/png");
  } else {
    return "clear";
  }
};

export const clearSignature = () => {
  const event = new CustomEvent("clearSignature");
  document.dispatchEvent(event);
};

export const assignFormValues = async (
  Inputs: any,
  index: any,
  depControlIndex: any,
  fieldIndex: any,
  inputValue: any,
  isDependency: boolean,
  repeatFieldSection: boolean,
  isDependencyRepeatFields: boolean,
  repeatFieldIndex: any,
  repeatDependencySectionIndex: any,
  repeatDepFieldIndex: any,
  selectedText: any,
  setInputs: any,
  reqId?: any,
  patientId?: any,
  sectionBasedRepeatFields?: any,
  buttonTouch?: any
) => {
  const field = Inputs[index].fields[fieldIndex];
  if (repeatFieldSection) {
    if (!isDependencyRepeatFields) {
      if (
        Inputs &&
        Array.isArray(Inputs) &&
        Inputs[index] &&
        Inputs[index].fields &&
        Array.isArray(Inputs[index].fields) &&
        Inputs[index].fields[fieldIndex] &&
        Inputs[index].fields[fieldIndex].repeatFields &&
        Array.isArray(Inputs[index].fields[fieldIndex].repeatFields) &&
        Inputs[index].fields[fieldIndex].repeatFields[repeatFieldIndex]
      ) {
        Inputs[index].fields[fieldIndex].repeatFields[
          repeatFieldIndex
        ].defaultValue = inputValue;
      }

      const dynamicObj: { [key: string]: any } = {};

      Inputs[index].fields[fieldIndex].repeatFields.forEach((field: any) => {
        if (field.systemFieldName !== "RepeatStart") {
          dynamicObj[field.systemFieldName] = field.defaultValue;
        }
      });
      Inputs[index].fields[fieldIndex].defaultValue =
        JSON.stringify(dynamicObj);
      if (
        Inputs &&
        Array.isArray(Inputs) &&
        Inputs[index] &&
        Inputs[index].fields &&
        Array.isArray(Inputs[index].fields) &&
        Inputs[index].fields[fieldIndex] &&
        Inputs[index].fields[fieldIndex].repeatFields &&
        Array.isArray(Inputs[index].fields[fieldIndex].repeatFields) &&
        Inputs[index].fields[fieldIndex].repeatFields[repeatFieldIndex]
      ) {
        Inputs[index].fields[fieldIndex].repeatFields[
          repeatFieldIndex
        ].selectedText = selectedText;
      }

      return Inputs;
    }
    if (isDependencyRepeatFields) {

      if (Inputs &&
        Array.isArray(Inputs) && Inputs[index].fields && Array.isArray(Inputs[index]?.fields)
        && Inputs[index]?.fields[fieldIndex] &&
        Inputs[index].fields[fieldIndex].repeatDependencyControls &&
        Inputs[index]?.fields[fieldIndex]?.repeatDependencyControls[
          repeatDependencySectionIndex
        ]?.dependecyFields) {

        Inputs[index].fields[fieldIndex].repeatDependencyControls[
          repeatDependencySectionIndex
        ].dependecyFields[repeatDepFieldIndex].defaultValue = inputValue;
        Inputs[index].fields[fieldIndex].repeatDependencyControls[
          repeatDependencySectionIndex
        ].dependecyFields[repeatDepFieldIndex].selectedText = selectedText;
        return;

      }
    }
  }
  if (!isDependency) {
    // Copy CheckBox Functionality
    if (field.uiType === "DynamicCopyCheckbox") {
      const autoCompleteOptions =
        Inputs[index].fields[fieldIndex].autoCompleteOption;
      const clickedSection = Inputs[index]; // Section where the checkbox exists

      if (autoCompleteOptions) {
        const options = isJson(autoCompleteOptions)
          ? JSON.parse(autoCompleteOptions)
          : undefined;

        if (options) {
          // Find the source section
          const sourceSection = Inputs.find(
            (section: any) => section.sectionId === options.sectionId
          );

          // Loop through fieldsToCopy
          Object.entries(options.fieldsToCopy).forEach(
            ([sourceFieldName, targetFieldName]) => {
              // Get the target field in the current section
              const targetField = clickedSection.fields.find(
                (field: any) => field.systemFieldName === sourceFieldName
              );

              if (targetField) {
                if (!field.defaultValue) {
                  // If checkbox is checked, copy the value from source
                  const sourceField = sourceSection?.fields.find(
                    (field: any) => field.systemFieldName === targetFieldName
                  );
                  targetField.defaultValue = sourceField?.defaultValue || "";
                } else {
                  // If checkbox is unchecked, clear the target field's default value
                  targetField.defaultValue = "";
                }
              }
            }
          );
        }
      }
    }

    if (Inputs[index].fields[fieldIndex].systemFieldName === "NoDrugAllergy") {
      let otherFieldsIndex = Inputs[index].fields.findIndex(
        (items: any) => items?.systemFieldName === "DrugAllergies"
      );
      Inputs[index].fields[otherFieldsIndex].defaultValue = [];
    }
    Inputs[index].fields[fieldIndex].defaultValue =
      Inputs[index].fields[fieldIndex].systemFieldName === "PatientOption"
        ? inputValue
        : inputValue;
    Inputs[index].fields[fieldIndex].selectedText = selectedText;
    if (
      Inputs[index].sectionId == 13 &&
      Inputs[index].fields[fieldIndex].systemFieldName != "PhysicianSignature"
    ) {
      let signndex = Inputs[index].fields.findIndex(
        (items: any) => items?.systemFieldName === "PhysicianSignature"
      );
      let signTypeIndex = Inputs[index].fields.findIndex(
        (items: any) => items?.systemFieldName === "PhysicianSignatureType"
      );

      if (
        Inputs[index].fields[signTypeIndex].selectedText.toLowerCase() ===
        "Use Physician Signature".toLowerCase()
      ) {
        const phySign = store.getState()?.ReqReducer?.phySign;
        const inputVal = phySign;
        Inputs[index].fields[signndex].signatureText = btoa(inputValue);
        Inputs[index].fields[signndex].defaultValue = inputVal;
      } else {
        if (
          Inputs[index].fields[signTypeIndex].selectedText.toLowerCase() ===
          "electronically signature" ||
          Inputs[index].fields[signTypeIndex].selectedText.toLowerCase() ===
          "electronically signed"
        ) {
          if (sessionStorage.getItem("PhysicianName")) {
            const text = `Electronically Signed by! ${sessionStorage.getItem(
              "PhysicianName"
            )}!Time ${now.toLocaleTimeString()} !Date: ${now.toLocaleDateString()}`;
            Inputs[index].fields[signndex].signatureText = btoa(inputValue);
            Inputs[index].fields[signndex].defaultValue = convertTextToImage(
              text,
              700,
              300
            );
          }
        } else {
          Inputs[index].fields[signndex].signatureText = inputValue;
          Inputs[index].fields[signndex].defaultValue =
            convertTextToImageForText(inputValue);
        }
      }
      if (inputValue.includes("base64")) {
        let enableRule = Inputs[index].fields[signndex]?.enableRule;
        if (enableRule) {
          Inputs[index].fields[signndex].enableRule = "";
        }
      }
      if (!inputValue.includes("base64")) {
        Inputs[index].fields[fieldIndex].defaultValue = "";
      }
    }
    if (Inputs[index].sectionId == 14) {
      let patientIndex = Inputs.findIndex(
        (inputData: any) => inputData?.sectionId == 3
      );
      let patientSignatureIndex = Inputs.findIndex(
        (inputData: any) => inputData?.sectionId == 14
      );
      ///
      let patientFieldIndex = Inputs[patientIndex].fields.findIndex(
        (fieldsData: any) =>
          fieldsData?.systemFieldName == "SocialSecurityNumber"
      );
      let dobIndex = Inputs[patientIndex].fields.findIndex(
        (fieldsData: any) => fieldsData?.systemFieldName == "DOB"
      );
      let PatientDiscriptionIndex = Inputs[index].fields.findIndex(
        (fieldsData: any) => fieldsData?.systemFieldName == "PatientDescription"
      );
      let PatientSignatureTypeIndex = Inputs[index].fields.findIndex(
        (fieldsData: any) =>
          fieldsData?.systemFieldName == "PatientSignatureType"
      );
      let PatientSignatureIndex = Inputs[index].fields.findIndex(
        (fieldsData: any) => fieldsData?.systemFieldName == "PatientSignature"
      );
      let PatientFullNameIndex = Inputs[index].fields.findIndex(
        (fieldsData: any) => fieldsData?.systemFieldName == "PatientFullName"
      );
      let PatientOptionIndex = Inputs[index].fields.findIndex(
        (fieldsData: any) => fieldsData?.systemFieldName == "PatientOption"
      );

      ///
      const isPaperReqCheck =
        Inputs[index].fields[PatientSignatureTypeIndex].defaultValue;
      if (!isPaperReqCheck) {
        if (inputValue === "Date of Birth") {
          let dob = Inputs[patientIndex].fields[dobIndex].defaultValue;
          Inputs[index].fields[PatientDiscriptionIndex].defaultValue = "";
          if (dob) {
            Inputs[index].fields[PatientDiscriptionIndex].uiType = "Date";
            Inputs[index].fields[PatientDiscriptionIndex].defaultValue = dob;
          } else {
            toast.error("Please Select DOB in Patient");
          }
        }
        if (inputValue === "Mother's Maiden Name") {
          Inputs[index].fields[PatientDiscriptionIndex].defaultValue = "";
          Inputs[index].fields[PatientDiscriptionIndex].uiType = "TextArea";
        } else {
          if (inputValue === "Last 4 SSN Digits") {
            Inputs[index].fields[PatientDiscriptionIndex].length = 4;
            let ssn =
              Inputs[patientIndex].fields[patientFieldIndex].defaultValue;
            Inputs[index].fields[PatientDiscriptionIndex].defaultValue = "";
            if (ssn) {
              Inputs[index].fields[PatientDiscriptionIndex].uiType = "TextBox";
              Inputs[index].fields[PatientDiscriptionIndex].defaultValue =
                ssn.slice(-4);
            } else {
              toast.error("Please Select ssn in Patient");
            }
          }
          if (inputValue === "Mother's Maiden Name") {
            Inputs[index].fields[PatientDiscriptionIndex].defaultValue = "";
            Inputs[index].fields[PatientDiscriptionIndex].length = "";
          }
          if (
            fieldIndex === PatientDiscriptionIndex &&
            index === patientSignatureIndex &&
            inputValue
          ) {
            let patientDobValue =
              Inputs[patientIndex].fields[dobIndex].defaultValue;
            let patientssnValue =
              Inputs[patientIndex].fields[patientFieldIndex].defaultValue;
            patientssnValue = patientssnValue.substring(
              patientssnValue.length,
              patientssnValue.length - 4
            );
            let patientssnValuesplice = patientssnValue.substring(
              patientssnValue.length,
              patientssnValue.length - 4
            );
            //for dob
            if (
              patientDobValue !== inputValue &&
              Inputs[patientSignatureIndex].fields[PatientOptionIndex]
                .defaultValue === "Date of Birth"
            ) {
              Inputs[index].fields[
                PatientDiscriptionIndex
              ].enableRule = `dob didn't match`;
            }
            if (
              patientDobValue == inputValue &&
              Inputs[patientSignatureIndex].fields[PatientOptionIndex]
                .defaultValue === "Date of Birth"
            ) {
              Inputs[index].fields[PatientDiscriptionIndex].enableRule = ``;
            }
            //for ssn
            if (
              patientssnValuesplice != inputValue &&
              Inputs[patientSignatureIndex].fields[PatientOptionIndex]
                .defaultValue == "Last 4 SSN Digits"
            ) {
              Inputs[index].fields[
                PatientDiscriptionIndex
              ].enableRule = `ssn didn't match`;
            }
            if (
              patientssnValuesplice == inputValue &&
              Inputs[patientSignatureIndex].fields[PatientOptionIndex]
                .defaultValue == "Last 4 SSN Digits"
            ) {
              Inputs[index].fields[PatientDiscriptionIndex].enableRule = ``;
            }
            if (
              patientssnValue == inputValue ||
              Inputs[patientSignatureIndex].fields[PatientOptionIndex]
                .defaultValue == `Mother's Maiden Name`
              // Inputs[6].fields[1].defaultValue == `Date of Birth`
            ) {
              Inputs[index].fields[fieldIndex].enableRule = ``;
            }
            ///for dob
            if (
              patientssnValue == inputValue ||
              Inputs[patientSignatureIndex].fields[PatientOptionIndex]
                .defaultValue == `Mother's Maiden Name`
            ) {
              Inputs[index].fields[fieldIndex].enableRule = ``;
            }
          }
        }
      }
      // if (inputValue == false) {
      //   Inputs[index].fields[PatientSignatureIndex].signatureText = "";
      //   Inputs[index].fields[PatientSignatureIndex].defaultValue =
      //     convertTextToImageForText("");
      //   return Inputs;
      // }
      if (Inputs[index].fields[PatientSignatureTypeIndex].defaultValue) {
        Inputs[index].fields[PatientSignatureIndex].signatureText =
          Inputs[index].fields[PatientSignatureTypeIndex].selectedText;
        Inputs[index].fields[PatientSignatureIndex].defaultValue =
          convertTextToImageForText(
            Inputs[index].fields[PatientSignatureTypeIndex].selectedText
          ); //Signature on Paper Requisition

        Inputs[index].fields[PatientFullNameIndex].defaultValue = "";
        Inputs[index].fields[PatientOptionIndex].defaultValue = "";
        Inputs[index].fields[PatientDiscriptionIndex].defaultValue = "";
      }
      if (
        Inputs[index].fields[PatientFullNameIndex].defaultValue &&
        Inputs[index].fields[PatientOptionIndex].defaultValue &&
        Inputs[index].fields[PatientDiscriptionIndex].defaultValue
      ) {
        if (!inputValue) {
          Inputs[index].fields[PatientSignatureIndex].signatureText = "";
        }
      }
    }
  }
  if (isDependency) {
    Inputs[index].dependencyControls[depControlIndex].dependecyFields[
      fieldIndex
    ].defaultValue = inputValue;
    Inputs[index].dependencyControls[depControlIndex].dependecyFields[
      fieldIndex
    ].selectedText = selectedText;
  }
  return Inputs;
};
export const SignatureForPatient = async (
  Inputs: any,
  index: any,
  osInfo: any,
  browserInfo: any,
  setInputs: any
) => {
  let PatientSignatureIndex = Inputs[index].fields.findIndex(
    (fieldsData: any) => fieldsData?.systemFieldName == "PatientSignature"
  );
  let PatientFullNameIndex = Inputs[index].fields.findIndex(
    (fieldsData: any) => fieldsData?.systemFieldName == "PatientFullName"
  );
  try {
    await do_it(
      {
        fullName: Inputs[index].fields[PatientFullNameIndex].defaultValue,
        uniqueKey: moment().unix().toString(),
        ipAddress: "",
        computerInfo: JSON.stringify(osInfo),
        browserInfo: JSON.stringify(browserInfo),
        controlsInfo: "controls",
      },
      (res: any) => {
        const text = `${res?.fullName}!${res?.uniqueKey}!Time ${res?.time} (UTC Time Zone)!Date: ${res?.date}`;
        Inputs[index].fields[PatientSignatureIndex].signatureText = text;
        Inputs[index].fields[PatientSignatureIndex].defaultValue =
          convertTextToImage(text);
      },
      Inputs,
      index
    );

    // After the signature has been set, update the state
    setInputs(Inputs);
  } catch (error) {
    console.error(error);
  }
};

export const assignFormValuesForMedicalNecessity = (
  Inputs: any,
  index: any,
  fieldIndex: any,
  inputValue: any,
  isDependency: boolean,
  selectedText: any
) => {
  let inputsCopy = [...Inputs];
  if (inputsCopy[index].sectionId !== 21) return;

  if (!isDependency) {
    inputsCopy[index].fields[fieldIndex].defaultValue = inputValue;
    inputsCopy[index].fields[fieldIndex].selectedText = selectedText;

    return inputsCopy;
  }
};

export const formValuesForApi = (
  Inputs: any,
  SelecetedReqInfo: any,
  reqId: any,
  action: string,
  RequisitionId?: any,
  RequisitionName?: any
) => {
  let requisitionObjToSend: any = {
    requisitionId: reqId ? reqId : 0,
    isPatientInfoChanged: false,
    action: action ?? "",
    requisitions: [],
    missingFields: [],
  };
  let obj: any = {
    reqId: RequisitionId ? RequisitionId : 0,
    reqName: RequisitionName ? RequisitionName : "common",
    reqSections: [],
  };
  Inputs.forEach((SectionData: any) => {
    let parentObj: any = {
      sectionId: SectionData?.sectionId,
      sectionName: SectionData?.sectionName,
      fields: [],
      sectionBasedRepeatFields: [],
    };

    SectionData.fields.forEach((fieldsData: any) => {
      let fieldArray: any = GetFieldData(fieldsData, SectionData);
      fieldArray?.forEach((element: any) => {
        parentObj.fields.push(element);
      });
    });
    if (SectionData.sectionId === 53) {
      parentObj.sectionBasedRepeatFields.push(
        SectionData.sectionBasedRepeatFields
      );
    }
    if (parentObj.fields.length > 0) {
      obj.reqSections = [...obj.reqSections, parentObj];
    }
    // var mysection = obj.reqSections.findIndex(
    //   (x: any) => x.sectionId == parentObj.sectionId
    // );
    // if (mysection > -1) {
    //   obj.reqSections[mysection].fields.push(sectionsFieldsObj);
    // } else {
    //   parentObj.fields.push(sectionsFieldsObj);

    //   if (
    //     sectionsFieldsObj?.systemFields.length > 0 ||
    //     sectionsFieldsObj.customFields.length > 0
    //   ) {
    //     obj.reqSections = [...obj.reqSections, parentObj];
    //   }
    // }
  });
  let billingInformationFields = Inputs.filter(
    (inputsData: any) =>
      inputsData?.sectionId === 5 || inputsData?.sectionId == 72 || inputsData?.sectionId == 112
  );

  formValuesForApiBillingInformation(billingInformationFields, obj);
  requisitionObjToSend.requisitions = [obj];

  return requisitionObjToSend;
};

const GetFieldData = (
  fieldsData: any,
  SectiontData: any,
  visited = new Set()
) => {
  let lst: any[] = [];
  if (!fieldsData?.defaultValue && !fieldsData?.fieldValue) return lst;
  const fieldKey = fieldsData?.systemFieldName;
  if (visited.has(fieldKey)) return lst;
  visited.add(fieldKey);
  let fieldLevelObj = {
    controlId: fieldsData?.controlId,
    displayName: fieldsData?.displayFieldName,
    uiType: fieldsData?.uiType,
    systemFieldName: fieldsData?.systemFieldName,
    fieldValue: fieldsData?.defaultValue || fieldsData?.fieldValue,
    fieldType: fieldsData?.sectionType,
    selectedText: fieldsData?.selectedText,
    previewDisplayType: fieldsData?.previewDisplayType,
    previewSortOrder: fieldsData?.previewSortOrder,
  };

  if (SectiontData?.sectionId === 14 || SectiontData?.sectionId === 13) {
    fieldLevelObj.fieldValue = fieldLevelObj.fieldValue;
  }
  if (SectiontData?.sectionName === "Family History") {
    fieldLevelObj.fieldValue = fieldLevelObj.fieldValue;
  }
  lst.push(fieldLevelObj);
  const options = SectiontData?.dependencyControls?.filter(
    (x: any) => x.value === fieldsData?.defaultValue
  );
  if (options.length === 0) return lst;
  options.forEach((dependecyData: any) => {
    dependecyData?.dependecyFields.forEach((fieldsDataDependecies: any) => {
      const arraylst = GetFieldData(
        fieldsDataDependecies,
        SectiontData,
        visited
      );

      lst = lst.concat(arraylst);
    });
  });

  return lst;
};

/////////for infectious disease description slice
const getFieldDataWithDescription = (fieldsData: any, SectiontData: any) => {
  if (!fieldsData?.description) return;
  let fieldLevelObj = {
    controlId: fieldsData?.controlId,
    controlName: "Description",
    controlValue: fieldsData?.description,
  };
  return fieldLevelObj;
};
//////////////////////
///////////////////////for billing information
const GetBillingInformationFieldData = (fieldsData: any, SectiontData: any) => {
  let lst: any[] = [];
  //let fieldLevelObj = {};
  //if (!fieldsData?.defaultValue) return fieldLevelObj;
  if (!fieldsData?.defaultValue) return lst;
  let fieldLevelObj = {
    controlId: fieldsData?.controlId,
    displayName: fieldsData?.displayFieldName,
    uiType: fieldsData?.uiType,
    systemFieldName: fieldsData?.systemFieldName,
    fieldValue: fieldsData?.defaultValue,
    fieldType: fieldsData?.sectionType,
    selectedText: fieldsData?.selectedText,
    previewDisplayType: fieldsData?.previewDisplayType,
    previewSortOrder: fieldsData?.previewSortOrder,
  };
  lst.push(fieldLevelObj);
  //
  var option = SectiontData?.repeatDependencyControls?.filter(
    (x: any) => x.value === fieldsData?.defaultValue
  );
  if (option.length == 0) return lst;
  option.forEach((dependecyData: any) => {
    dependecyData?.dependecyFields.forEach((fieldsDataDependecies: any) => {
      let arraylst = GetBillingInformationFieldData(
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
  console.log("billingInformationFields", billingInformationFields);
  billingInformationFields.forEach((SectionData: any) => {


    SectionData.fields.forEach((fieldsLevelData: any) => {
      if (fieldsLevelData?.displayFieldName !== "Repeat Start") return;
      let parentObj: any = {
        sectionId: SectionData?.sectionId,
        sectionName: SectionData?.sectionName,
        fields: [],
      };

      fieldsLevelData.repeatFields.forEach((fieldsData: any) => {
        let fieldArray: any = GetBillingInformationFieldData(
          fieldsData,
          fieldsLevelData
        );

        fieldArray?.forEach((element: any) => {
          parentObj.fields.push(element);
        });
      });
      if (parentObj.fields.length > 0 && obj.reqSections) {
        obj.reqSections = [...obj.reqSections, parentObj];
      }
    });
    SectionData.fields.forEach((fieldsLevelData: any) => {
      if (fieldsLevelData?.displayFieldName === "Repeat Start") return;
      let parentObj: any = {
        sectionId: SectionData?.sectionId,
        sectionName: SectionData?.sectionName,
        fields: [],
      };
      let fieldLevelObj = {
        controlId: fieldsLevelData?.controlId,
        displayName: fieldsLevelData?.displayFieldName,
        uiType: fieldsLevelData?.uiType,
        systemFieldName: fieldsLevelData?.systemFieldName,
        fieldValue: fieldsLevelData?.defaultValue,
        fieldType: fieldsLevelData?.sectionType,
        selectedText: fieldsLevelData?.selectedText,
        previewDisplayType: fieldsLevelData?.previewDisplayType,
        previewSortOrder: fieldsLevelData?.previewSortOrder,
      };
      parentObj.fields.push(fieldLevelObj);
      if (parentObj.fields.length > 0 && obj.reqSections) {
        obj.reqSections = [...obj.reqSections, parentObj];
      }
    });
  });

  return obj;
};

const getRepeatedFieldValues = (inputs: any, obj: any) => {
  inputs.forEach((SectionData: any) => {
    SectionData.fields.forEach((fieldsLevelData: any) => {
      let parentObj: any = {
        sectionId: SectionData?.sectionId,
        sectionName: SectionData?.sectionName,
        fields: [],
      };
      if (fieldsLevelData.systemFieldName) {
        return [...parentObj.fields, fieldsLevelData];
      }

      // fieldsLevelData.repeatFields.forEach((fieldsData: any) => {
      //   console.log(fieldsData, "fieldsData");
      //   let fieldArray: any = GetBillingInformationFieldData(
      //     fieldsData,
      //     fieldsLevelData
      //   );
      //   fieldArray.length &&
      //     fieldArray?.forEach((element: any) => {
      //       parentObj.fields.push(element);
      //     });
      // });
      if (parentObj.fields.length > 0) {
        obj.commonSections = [...obj.commonSections, parentObj];
      }
    });
  });
  return obj;
};

// specific For Patient
export const formValuesForPatient = (Inputs: any) => {
  let obj: any = {
    id: 0,
    commonSections: [],
  };

  Inputs.forEach((SectionData: any) => {
    let parentObj: any = {
      sectionId: SectionData?.sectionId,
      sectionName: SectionData?.sectionName,
      fields: [],
    };

    SectionData.fields.forEach((fieldsData: any) => {
      let fieldArray: any = GetFieldData(fieldsData, SectionData);
      fieldArray?.forEach((element: any) => {
        parentObj.fields.push(element);
      });
    });

    // NOTE: Removed this code as it was making duplicate fieldValues

    // SectionData.dependencyControls.forEach((fieldsData: any) => {
    //   fieldsData.dependecyFields.map((fieldData: any) => {
    //     let fieldArray: any = GetFieldData(fieldData, SectionData);
    //     fieldArray?.forEach((element: any) => {
    //       parentObj.fields.push(element);
    //     });
    //   });
    // });

    if (parentObj.fields.length > 0) {
      obj.commonSections = [...obj.commonSections, parentObj];
    }
  });

  let billingInformationFields = Inputs.filter(
    (inputsData: any) =>
      inputsData?.sectionId === 5 || inputsData?.sectionId === 72 || inputsData?.sectionId == 112
  );

  getRepeatedFieldValues(Inputs, obj);

  if (billingInformationFields.length) {
    formValuesForApiBillingInformation(billingInformationFields, obj);
  }

  return mergeSections(obj);
};

function mergeSections(obj: any) {
  const mergedSections: any = {};

  obj.commonSections.forEach((section: any) => {
    if (mergedSections[section.sectionId]) {
      mergedSections[section.sectionId].fields = [
        ...mergedSections[section.sectionId].fields,
        ...section.fields,
      ];
    } else {
      mergedSections[section.sectionId] = {
        sectionId: section.sectionId,
        sectionName: section.sectionName,
        fields: [...section.fields],
      };
    }
  });

  obj.commonSections = Object.values(mergedSections);
  return obj;
}
