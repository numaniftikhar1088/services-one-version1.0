import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const createFacility = (addFacilityRequest) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.CreateFacility}`,
    addFacilityRequest
  );
};
const getAllFacilities = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.ManageFacility}`,
    searchRequest
  );
};

const GetFacilitiesName = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.GetFacilitiesName}`,
    searchRequest
  );
};

const getActiveFacilities = () => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.GetActiveFacilities}`
  );
};
const getFacilityById = (facilityId) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.GetFacilityById}/${facilityId}`
  );
};
const viewFacility = (requestBody) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.ViewFacility}`,
    requestBody
  );
};
const getUsersAssignedToFacility = (facilityId) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.ViewAssignedUsers}/${facilityId}`
  );
};
const fetchReferenceLabs = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.GetReferenceLabs}`,
    searchRequest
  );
};

const getSalesRepAssignedToFacility = (facilityId) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.assignedSalesRepUser}/${facilityId}`
  );
};

const getPharmDPreference = (facilityId) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.pharmDPreference}/${facilityId}`
  );
};

const fetchUserByEmail = (email) => {
  return HttpClient().get(`/${apiRoutes.UserManagement.UserByEmail}/${email}`);
};
const isFacilityUnique = (facilityName) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.IsFacilityNameUnique}/${facilityName}`
  );
};
const getFacultyOptions = () => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.GetFacilityOptions}`
  );
};
const updateFacilityStatus = (statusRequest) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.ChangeFacilityStatus}`,
    statusRequest
  );
};
const updateFacilityStatusInBulk = (statusRequestInBulk) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.BulkFacilityChangeStatus}`,
    statusRequestInBulk
  );
};
const getManageFacilityUserList = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.UserList}`,
    searchRequest
  );
};
const getAssignedLabsagainstId = (obj) => {
  let path = apiRoutes.FacilityManagement.getAssignedLabsagainstId;
  path = path.replace("abc", obj);
  return HttpClient().get(`/${path}`, obj);
};
const getManageFacilityUserStatus = (userId, status) => {
  let path = apiRoutes.UserManagement.ChangeUserStatus;
  path = path.replace("userId", userId);
  return HttpClient().post(`/${path}`, status);
  // return PostAsync(`/${path}`, status)
};
const ViewAssignedFacilities = (facilityId) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.ViewAssignedFacilities}/${facilityId}`
  );
};
const GoToPortal = (facilityId) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.GoToPortal}?userId=${facilityId}`
  );
};
const BulkFacilityDownloadTemplate = (templateName) => {
  let path = apiRoutes.FacilityManagement.BulkFacilityDownloadTemplate;
  path = path.replace("templateName", templateName);
  return HttpClient().get(`/${path}`);
};
const DownloadTemplate = () => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.FacilityDownloadTemplate}`
  );
};
const BulkFacilityUpload = (jsonstring) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.BulkFacilityUpload}`,
    jsonstring
  );
};
const getProviderBasedOnFacility = (facilityId) => {
  let path = apiRoutes.FacilityManagement.getProviderBasedOnFacility;
  path = path.replace("facilityId", facilityId);
  return HttpClient().get(`/${path}`, facilityId);
};
const facilityExportToExcel = (facilityIds) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.facilityExportToExcel}`,
    facilityIds
  );
};
const facilityExportToExcel_V2 = (facilityIds) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.facilityExportToExcel_V2}`,
    facilityIds
  );
};
const facilityfileupload = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.facilityfileupload}`,
    obj
  );
};
const BlobUpload = (obj) => {
  return HttpClient().post(`/${apiRoutes.FacilityManagement.BlobUpload}`, obj);
};
const UploadResultToBlob = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.UploadResultToBlob}`,
    obj
  );
};
const UploadResultsToBlob = async (imageData) => {
  return await HttpClient().post(
    `/${apiRoutes.FacilityManagement.UploadResultToBlob}`,
    imageData
  );
};

const RemoveFacilityUpload = (object) => {
  let path = apiRoutes.FacilityManagement.removefacilityupload;
  path = path.replace("abc", object.FacilityId ? "" : object.fileId);
  path = path.replace("xyz", object.fileId ? 0 : object.FacilityId);
  return HttpClient().delete(`/${path}`, {
    data: object,
  });
};
// ************** AssignRefLabAndGroup *****************
const getAllAssignRefLabAndGroup = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.getAllAssignRefLabAndGroup}`,
    searchRequest
  );
};
const DeleteReferenceLab = (object) => {
  let path = apiRoutes.FacilityManagement.deletereflab;
  path = path.replace("abc", object);
  return HttpClient().delete(`/${path}`, {
    data: object,
  });
};
const statuschange = (obj) => {
  return HttpClient().patch(
    `/${apiRoutes.FacilityManagement.statuschange}`,
    obj
  );
};
const CreateAssignedReferenceLab = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.CreateRefetencelab}`,
    obj
  );
};
const DownloadBlob = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.downloadblob}`,
    obj
  );
};
const UpdateAssignedReferenceLab = (obj) => {
  return HttpClient().patch(
    `/${apiRoutes.FacilityManagement.UpdateReferenceLab}`,
    obj
  );
};

const getLabAssignment = (queryModal) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.getalllabassignment}`,
    queryModal
  );
};
const referenceLabLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.referenceLabLookup}`
  );
};
const insuranceLookup = () => {
  return HttpClient().get(`/${apiRoutes.FacilityManagement.insuranceLookup}`);
};
const genderLookup = () => {
  return HttpClient().get(`/${apiRoutes.FacilityManagement.genderLookup}`);
};
const reqTypeLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.reqTypeLookup}`);
};
const groupLookup = (obj) => {
  let path = apiRoutes.FacilityManagement.groupLookup;
  path = path.replace("xyz", obj);
  return HttpClient().get(`/${path}`);
};
const DeleteLabAssignment = (obj) => {
  let path = apiRoutes.FacilityManagement.DeleteLabAssignment;
  path = path.replace("xyz", obj);
  return HttpClient().delete(`/${path}`);
};
const createassignment = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.createassignment}`,
    obj
  );
};
const savefacilities = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.savefacilities}`,
    obj
  );
};
const FacilityStatusChangedForApproval = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.FacilityStatusChangedForApproval}`,
    searchRequest
  );
};
const GetTemplateSetting = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.GetTemplateSetting}`,
    obj
  );
};
const AddTemplateSetting = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.addtemplatesetting}`,
    obj
  );
};
const SaveResultDataSettings = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.saveResultDataSetting}`,
    obj
  );
};
const ChangeTemplateStatus = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.ChangeTemplateStatus}`,
    obj
  );
};
const GetResultDataSetting = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.getResultData}`,
    obj
  );
};
// const GetResultDataSetting = () => {
//   return HttpClient().get(`/${apiRoutes.FacilityManagement.getresultdata}`)
// }
const SaveTemplateSetting = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.savetemplatesetting}`,
    obj
  );
};
const SaveCells = (obj) => {
  return HttpClient().post(`/${apiRoutes.FacilityManagement.savecells}`, obj);
};
const LoadTemplate = () => {
  return HttpClient().get(`/${apiRoutes.FacilityManagement.loadtemplate}`);
};
const UploadFilesToBlobFormModel = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.ManageFileUpload}`,
    obj
  );
};
const DeleteUploadedFile = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.DeleteUploadedFile}`,
    obj
  );
};
const RestoreUploadedFile = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.RestoreUploadedFile}`,
    obj
  );
};
const handleSubmitNote = (obj) => {
  return HttpClient().post(`/${apiRoutes.FacilityManagement.submitNote}`, obj);
};
const UploadFilesToOrderRequisition = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.UploadFileToOrderRequisition}`,
    obj
  );
};
const getAllFacilitieOptions = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.getAllFacilitieOptions}`,
    searchRequest
  );
};
const SaveFacilityOption = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.SaveFacilityOption}`,
    obj
  );
};

const changeLabFeature = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.changeLabFeature}`,
    obj
  );
};

const SaveFacilitiesInFacilityOptions = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.SaveFacilitiesInFacilityOptions}`,
    obj
  );
};

const getProviderByFnameLnameNpi = (requestBody) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.getProviderByFnameLnameNpi}`,
    requestBody
  );
};

const getLabAssignmentLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.labAssignmentLookups}`
  );
};
const ChangeStatusLabAssigment = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.ChangeStatusLabAssigment}`,
    searchRequest
  );
};

const UploadLogo = (obj) => {
  return HttpClient().post(`/${apiRoutes.FacilityManagement.UploadLogo}`, obj);
};

const facilityDynamicCustomPage = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.facilityDynamicCustomPage}`,
    payload
  );
};

const saveDynamicFacility = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.saveDynamicFacility}`,
    payload
  );
};

const getBase64ForAzureLink = (azureUrl) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.getBase64ByAzureUrl}?azureUrl=${azureUrl}`
  );
};
// **********************************************
const physicianSignatureGetAll = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.physicianSignatureGetAll}`,
    obj
  );
};
const getSignatureAndFacilityDetailsById = (userId) => {
  return HttpClient().get(
    `/${apiRoutes.FacilityManagement.getSignatureAndFacilityDetailsById}?UserId=${userId}`
  );
};
const saveAndAssignSignature = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.saveAndAssignSignature}`,
    payload
  );
};

const getFacilities = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.getAllFacilities}`,
    payload
  );
};

const FacilityService = {
  createFacility,
  isFacilityUnique,
  getFacultyOptions,
  getActiveFacilities,
  fetchReferenceLabs,
  getAllFacilities,
  fetchUserByEmail,
  updateFacilityStatus,
  updateFacilityStatusInBulk,
  getFacilityById,
  viewFacility,
  getUsersAssignedToFacility,
  getManageFacilityUserList,
  getManageFacilityUserStatus,
  ViewAssignedFacilities,
  BulkFacilityDownloadTemplate,
  DownloadTemplate,
  BulkFacilityUpload,
  getProviderBasedOnFacility,
  facilityExportToExcel,
  facilityfileupload,
  RemoveFacilityUpload,
  BlobUpload,
  UploadResultToBlob,
  getAllAssignRefLabAndGroup,
  DeleteReferenceLab,
  statuschange,
  CreateAssignedReferenceLab,
  UpdateAssignedReferenceLab,
  DownloadBlob,
  getLabAssignment,
  referenceLabLookup,
  insuranceLookup,
  genderLookup,
  reqTypeLookup,
  groupLookup,
  createassignment,
  savefacilities,
  getAssignedLabsagainstId,
  FacilityStatusChangedForApproval,
  UploadResultsToBlob,
  GetTemplateSetting,
  AddTemplateSetting,
  GetResultDataSetting,
  SaveResultDataSettings,
  SaveTemplateSetting,
  SaveCells,
  LoadTemplate,
  UploadFilesToBlobFormModel,
  getAllFacilitieOptions,
  SaveFacilityOption,
  SaveFacilitiesInFacilityOptions,
  ChangeTemplateStatus,
  getProviderByFnameLnameNpi,
  getLabAssignmentLookup,
  GoToPortal,
  ChangeStatusLabAssigment,
  UploadLogo,
  facilityDynamicCustomPage,
  saveDynamicFacility,
  getBase64ForAzureLink,
  DeleteLabAssignment,
  changeLabFeature,
  UploadFilesToOrderRequisition,
  DeleteUploadedFile,
  physicianSignatureGetAll,
  getSignatureAndFacilityDetailsById,
  saveAndAssignSignature,
  getFacilities,
  facilityExportToExcel_V2,
  handleSubmitNote,
  getPharmDPreference,
  getSalesRepAssignedToFacility,
  RestoreUploadedFile,
  GetFacilitiesName,
};

export default FacilityService;
