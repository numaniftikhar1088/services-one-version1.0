import HttpClient from "HttpClient";

const getPatientDemographicsList = (searchRequest) => {
  return HttpClient().post(
    `api/PatientManagement/GetAllPatientsV2`,
    searchRequest
  );
};
const ViewPatientDemoGraphics = (obj) => {
  return HttpClient().post(`api/PatientManagement/ViewPatient`, obj);
};
const getPatientRequisitionOrder = (patientId) => {
  return HttpClient().get(
    `api/PatientManagement/Patient/${patientId}/Requisitions`
  );
};

const getDynamicGridExpand = (patientId) => {
  return HttpClient().post(`/api/DynamicGrid/DynamicGrid/${patientId}/Expand`);
};

const downloadPatientReport = (payload) => {
  return HttpClient().post(`/api/PatientViewReport/Generate-pdf`, payload);
};

const getPatientInsuranceHistory = (payload) => {
  return HttpClient().post(
    `api/PatientManagement/GetPatientInsuranceHistory`,
    payload
  );
};

const UploadFilesPatientView = (obj) => {
  return HttpClient().post(`/api/PatientManagement/SaveFiles`, obj);
};

const DeleteUploadedFile = (obj) => {
  return HttpClient().post(`/api/PatientManagement/DeleteOrRestoreFile`, obj);
};

const PatientService = {
  getPatientDemographicsList,
  getPatientRequisitionOrder,
  ViewPatientDemoGraphics,
  downloadPatientReport,
  getDynamicGridExpand,
  getPatientInsuranceHistory,
  UploadFilesPatientView,
  DeleteUploadedFile,
};

export default PatientService;
