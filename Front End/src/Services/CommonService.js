import HttpClient from "../HttpClient.ts";
import apiRoutes from "../Routes/Routes.json";

const PHONE_REGEX = new RegExp(/^[0-9\b]+$/);
const EMAIL_REGEX = /\S+@\S+\.\S+/;
const regex = new RegExp(
  "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
);
const isValidEmail = (emailRequest) => {
  return HttpClient().post(`/api/Account/IsUserEmailValid`, emailRequest);
};
const isValidUsername = (usrnameRequest) => {
  return HttpClient().post(`/api/Account/IsUserNameValid`, usrnameRequest);
};
const uploadFile = (usrnameRequest) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.UploadFile}`,
    usrnameRequest
  );
};
const isValidEmailFormat = (email) => {
  return EMAIL_REGEX.test(email);
};
const isValidMobilNo = (mobileNo) => {
  return PHONE_REGEX.test(mobileNo);
};
const isValidPhoneNo = (phoneNo) => {
  return PHONE_REGEX.test(phoneNo);
};
const urlPatternValidation = (url) => {
  return regex.test(url);
};

const saveEncodedText = (encodedText) => {
  return HttpClient().post(`/${apiRoutes.UserManagement.SaveEncodedText}`, {
    encodedText: encodedText,
  });
};
const getEncodedText = (id) => {
  let path = apiRoutes.UserManagement.GetEncodedText;
  path = path.replace("id", id);

  return HttpClient().get(`/${path}`);
};
const getAutoCompleteData = (query, uri, key) => {
  let path = uri;
  path = path?.replace("key", key);
  path = path?.replace("query", query);
  return HttpClient().get(`/${path}`, key);
};

const getDynamicAutoCompleteData = (query, uri, payload) => {
  let path = uri;
  path = path?.replace("query", "");
  console.log(path, "path");
  return HttpClient().post(`/${path}`, payload);
};

const makeApiCallForDropDown = (uri, payload) => {
  return HttpClient().post(uri, payload);
};

const getLoginPageLogo = () => {
  return HttpClient().get(apiRoutes.UserManagement.GetLoginPageLogo);
};

const getUserSavedSecurityQuestions = (name) => {
  let path = apiRoutes.UserManagement.GetUserAssignedSecurityQuestions;
  // path = path?.replace("email", name);
  return HttpClient().post(path, { item1: name });
};
const validateUserNameEmail = (name) => {
  let path = apiRoutes.UserManagement.validateUserNameEmail;
  path = path?.replace("replace", name);
  return HttpClient().get(`/${path}`);
};
const SecurityQuestionverification = (obj) => {
  let path = apiRoutes.UserManagement.securityquestionvarification;
  return HttpClient().post(path, obj);
};
const setnewpassword = (obj) => {
  let path = apiRoutes.UserManagement.setnewpassword;
  return HttpClient().post(path, obj);
};

const setNewPasswordV2 = (obj) => {
  let path = apiRoutes.UserManagement.apiForTempPasswordScenario;
  return HttpClient().post(path, obj);
};
const getMFATypes = (labId, userId) => {
  let path = apiRoutes.UserManagement.for_MFA_type_fetching;
  path = path.replace("LID", labId);
  path = path.replace("UID", userId);
  return HttpClient().post(path);
};
const getCode = (obj) => {
  let path = apiRoutes.UserManagement.fetch_code_MFA;
  return HttpClient().post(path, obj);
};
const getPortalKey = () => {
  return HttpClient().get(apiRoutes.UserManagement.getPortalKey);
};
const Commonservice = {
  isValidEmail,
  isValidUsername,
  isValidEmailFormat,
  isValidMobilNo,
  isValidPhoneNo,
  urlPatternValidation,
  uploadFile,
  saveEncodedText,
  getEncodedText,
  getAutoCompleteData,
  getLoginPageLogo,
  getDynamicAutoCompleteData,
  makeApiCallForDropDown,
  getUserSavedSecurityQuestions,
  SecurityQuestionverification,
  setnewpassword,
  validateUserNameEmail,
  setNewPasswordV2,
  getMFATypes,
  getCode,
  getPortalKey,
};

export default Commonservice;
