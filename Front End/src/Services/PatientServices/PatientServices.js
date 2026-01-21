import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getFacilityIdDropdownValues = () => {
  return HttpClient().get(
    `/${apiRoutes.PatientManagement.getFacilityIdDropdownValues}`
  );
};

const getInsuranceDropdown = () => {
  return HttpClient().get(`/${apiRoutes.PatientManagement.getInsuranceDropdown}`);
};

const getInsuranceProviderDropdown = () => {
  return HttpClient().get(`/${apiRoutes.PatientManagement.getInsuranceProvider}`);
};

const getFacilityIdbyNameDob = (nameDobObj) => {
  return HttpClient().post(
    `/${apiRoutes.PatientManagement.getFacilityIdbyNameDob}`,
    nameDobObj
  );
};
const getPatientDetailById = (patientId) => {
  let path = apiRoutes.PatientManagement.getPatientDetailById;
  path = path.replace("patientid", patientId);
  return HttpClient().get(`/${path}`);
};

// for patient
const makeApiCall = (path, patientId, methodType, payload) => {
  if (!methodType) return false;
  let _method = methodType.toLowerCase();
  return HttpClient()[_method](`${path}${patientId}`, payload);
};

// for  dynamic-grid
const makeApiCallForDynamicGrid = (path, methodType, payload) => {
  if (!methodType) return false;
  let _method = methodType.toLowerCase();
  return HttpClient()[_method](`${path}`, payload);
};

const APICALL = (path, methodType, payload) => {
  if (!methodType) return false;
  let _method = methodType.toLowerCase();
  return HttpClient()[_method](`${path}`, payload);
};

const createPatient = (addPatientRequest) => {
  return HttpClient().post(
    `/${apiRoutes.PatientManagement.CreatePatient}`,
    addPatientRequest
  );
};
const updatePatient = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.PatientManagement.UpdatePatient}`,
    queryModel
  );
};
const managePatient = (patientlist) => {
  return HttpClient().post(
    `/${apiRoutes.PatientManagement.ManagePatient}`,
    patientlist
  );
};
const deletebyid = (id) => {
  let path = apiRoutes.PatientManagement.deletebyid;
  path = path.replace("Id", id);
  return HttpClient().delete(`/${path}`, {
    data: id,
  });
};
const GetPatientByFacilityId = (filterString, facilityId) => {
  return HttpClient().post(
    `/${apiRoutes.PatientManagement.GetPatientByFacilityId}`,
    {
      filter: filterString,
      facilityId: facilityId,
    }
  );
};
const getPatientDetailEitherByFirstNameOrLastname = (patientDetail) => {
  return HttpClient().post(
    `/${apiRoutes.PatientManagement.getPatientDetailEitherByFirstNameOrLastname}`,
    patientDetail
  );
};

export const getDynamicDropdownControlData = (systemFieldName) => {
  return HttpClient().post(`/api/PatientManagement/DynamicDropdownControl`, {
    systemFieldName: systemFieldName,
  });
};
const DownloadTemplate = () => {
  return HttpClient().get(
    `/${apiRoutes.PatientManagement.BulkPatientTemplateDownload}`
  );
};
const GetBulkUploadFiles = (object) => {
  return HttpClient().post(
    `/${apiRoutes.PatientManagement.GetBulkUploadFiles}`,
    object
  );
};
const FileUploadPatientFileUpload = (object) => {
  return HttpClient().post(
    `/${apiRoutes.PatientManagement.BulkFileUpload}`,
    object
  );
};
const GetLogsById = (Id) => {
  return HttpClient().get(
    `/${apiRoutes.PatientManagement.GetLogsById}?fileId=${Id}`
  );
};
const GetStatusLookup = () => {
  return HttpClient().get(`/${apiRoutes.PatientManagement.GetStatusLookup}`);
};

const PatientServices = {
  createPatient,
  updatePatient,
  managePatient,
  getPatientDetailById,
  getFacilityIdbyNameDob,
  getFacilityIdDropdownValues,
  getInsuranceDropdown,
  getInsuranceProviderDropdown,
  deletebyid,
  GetPatientByFacilityId,
  getPatientDetailEitherByFirstNameOrLastname,
  makeApiCall,
  DownloadTemplate,
  GetBulkUploadFiles,
  FileUploadPatientFileUpload,
  GetLogsById,
  makeApiCallForDynamicGrid,
  GetStatusLookup,
  APICALL,
};

export default PatientServices;
