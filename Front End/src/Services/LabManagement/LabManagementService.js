import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";
const saveLab = (createLabRequest) => {
  return HttpClient().post(
    `/${apiRoutes.LabManagement.CreateLab}`,
    createLabRequest
  );
};
const getReferenceLabDropDownValues = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.LabManagement.GetReferenceLabDropDownValues}`,
    obj
  );
};
const getRequsitionTypeDropdownValues = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.LabManagement.GetRequsitionTypeDropdownValues}`,
    obj
  );
};
const loadReferenceLabAssignments = (labAssignmentRequest) => {
  return HttpClient().post(
    `/${apiRoutes.LabManagement.GetReferenceLabAssignments}`,
    labAssignmentRequest
  );
};
const addReferenceLab = (request) => {
  return HttpClient().post(
    `/${apiRoutes.LabManagement.AssignReferenceLabToFacility}`,
    request
  );
};
const getAllLabs = (queryModel) => {
  return HttpClient().post(`/${apiRoutes.LabManagement.GetAllLabs}`, queryModel);
};
const ActivateLabById = (labId, status) => {
  let path = apiRoutes.LabManagement.ActivationLabById;
  path = path.replace("labId", labId);
  return HttpClient().put(`/${path}`, status);
};
const DeleteReferenceLab = (request) => {
  let path = apiRoutes.LabManagement.DeleteReferenceLab;
  path = path.replace("facilityId", request?.facilityId);
  path = path.replace("refLabId", request?.refLabId);
  return HttpClient().delete(`/${path}`);
};

const getLoggedUserAssignedLabs = ()=>{
  return HttpClient().get(`/${apiRoutes.LabManagement.GetLoggedUserAssignedLabs}`);

}

const LabManagementService = {
  saveLab,
  loadReferenceLabAssignments,
  addReferenceLab,
  getRequsitionTypeDropdownValues,
  getReferenceLabDropDownValues,
  getAllLabs,
  ActivateLabById,
  DeleteReferenceLab,
  getLoggedUserAssignedLabs
};
export default LabManagementService;
