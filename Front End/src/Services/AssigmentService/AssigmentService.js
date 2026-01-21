import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getICD10AssigmnetList = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ICD10AssigmnetManagement.getICD10AssigmnetList}`,
    searchRequest
  );
};

const AddICD10Assigmnet = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ICD10AssigmnetManagement.AddICD10Assigmnet}`,
    searchRequest
  );
};
const ICD10CodeLookUp = (ICD10Id) => {
  return HttpClient().get(
    `/${apiRoutes.ICD10AssigmnetManagement.ICD10CodeLookUp}/${ICD10Id}`
  );
};
const ReferenceLabLookUp = () => {
  return HttpClient().get(
    `/${apiRoutes.ICD10AssigmnetManagement.ReferenceLabLookUp}`
  );
};
const FacilityLookUp = () => {
  return HttpClient().get(
    `/${apiRoutes.ICD10AssigmnetManagement.FacilityLookUp}`
  );
};
const RequsitionLookUp = () => {
  return HttpClient().get(
    `/${apiRoutes.ICD10AssigmnetManagement.RequsitionLookUp}`
  );
};
const GetLabTypeAgainstRefLabLookUp = (labid) => {
  return HttpClient().get(
    `/${apiRoutes.ICD10AssigmnetManagement.GetLabTypeAgainstRefLabLookUp}/${labid}`
  );
};
const ChangeStatusICD10Assigment = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ICD10AssigmnetManagement.ChangeStatusICD10Assigment}`,
    searchRequest
  );
};
const GetICD10Codes = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ICD10AssigmnetManagement.GetICD10Codes}`,
    searchRequest
  );
};
const saveICD10Codes = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ICD10AssigmnetManagement.saveICD10Codes}`,
    searchRequest
  );
};
const changeStatusICD10Code = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ICD10AssigmnetManagement.changeStatusICD10Code}`,
    searchRequest
  );
};
const SearchICD10 = (query, key) => {
  let path = apiRoutes.ICD10AssigmnetManagement.SearchICD10;
  path = path.replace("query", query);
  path = path.replace("key", key);
  return HttpClient().get(`/${path}`);
};
const PanelLookUp = () => {
  return HttpClient().get(`/${apiRoutes.ICD10AssigmnetManagement.PanelLookUp}`);
};
const getMedicationAssignmentList = (searchRequest) => {
  return HttpClient().get(
    `/${apiRoutes.ICD10AssigmnetManagement.getMedicationAssignmentlist}`,
    searchRequest
  );
};
const SearchComorbidity = (query, key) => {
  let path = apiRoutes.ComorbidityAssignment.SearchComorbidity;
  path = path.replace("query", query);
  path = path.replace("key", key);
  return HttpClient().get(`/${path}`);
};
const getComorAssigmnetList = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ComorbidityAssignment.ComorbiditiesGetAll}`,
    searchRequest
  );
};
const ComorReferenceLabLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.ComorbidityAssignment.ComorReferenceLabLookup}`
  );
};
const ComorFacilityLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.ComorbidityAssignment.ComorFacilityLookup}`
  );
};
const ComorRequsitionTypeLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.ComorbidityAssignment.ComorRequsitionTypeLookup}`
  );
};

const SaveComorbidity = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ComorbidityAssignment.SaveComorbidity}`,
    searchRequest
  );
};
const changeStatusComor = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ComorbidityAssignment.AssignComorStatusChange}`,
    searchRequest
  );
};
const getAllComorAssigmnetList = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ComorbidityAssignment.AllComorbiditiesGetAll}`,
    searchRequest
  );
};
const SaveAllComorbidity = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ComorbidityAssignment.SaveAllComorbidityCode}`,
    searchRequest
  );
};
const StatusChangedAllComorbidity = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.ComorbidityAssignment.StatusChangedAllComorbidity}`,
    searchRequest
  );
};
const AssigmentService = {
  getICD10AssigmnetList,
  AddICD10Assigmnet,
  ICD10CodeLookUp,
  ReferenceLabLookUp,
  FacilityLookUp,
  RequsitionLookUp,
  PanelLookUp,
  ComorFacilityLookup,
  ComorReferenceLabLookup,
  ComorRequsitionTypeLookup,
  GetLabTypeAgainstRefLabLookUp,
  ChangeStatusICD10Assigment,
  GetICD10Codes,
  saveICD10Codes,
  changeStatusICD10Code,
  SearchICD10,
  SaveAllComorbidity,
  changeStatusComor,
  SaveComorbidity,
  SearchComorbidity,
  getMedicationAssignmentList,
  getComorAssigmnetList,
  getAllComorAssigmnetList,
  StatusChangedAllComorbidity,
};

export default AssigmentService;
