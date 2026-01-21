import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getAllRequisitionType = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.getAllRequisitionType}`,
    object
  );
};
const saveRequisitionType = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.saveRequisitionType}`,
    object
  );
};
const updateRequisitionType = (object) => {
  return HttpClient().put(
    `/${apiRoutes.Requisition.updateRequisitionType}`,
    object
  );
};
const requisitionLookUp = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.requisitionLookUp}`);
};
const getDefaultPrinter = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.getDefaultPrinterSelected}`
  );
};
const requisitionColorLookup = (query) => {
  let path = apiRoutes.Requisition.requisitionColorLookup;
  path = path.replace("id", query.id);
  return HttpClient().get(`/${path}`);
};
const changeRequisitionStatus = (object) => {
  let path = apiRoutes.Requisition.changeRequisitionStatus;
  path = path.replace("userstatus", !object.isActive);
  path = path.replace("userid", object.id);

  return HttpClient().post(`/${path}`);
};
const searchNpi = (npi) => {
  let path = apiRoutes.Requisition.searchNpi;
  path = path.replace("hello", npi);
  return HttpClient().get(`/${path}`);
};
const getAllViewRequisition = (parameter) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.getAllViewRequisition}`,
    parameter
  );
};
const getAllBillingRequisition = (parameter) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ViewBillingRequisition}`,
    parameter
  );
};
const getAllResultData = (parameter) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.getAllResultData}`,
    parameter
  );
};
const ViewRequisitionBulkStatusChange = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ViewRequisitionBulkStatusChange}`,
    object
  );
};
const OrderViewUnvalidate = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.orderViewUnvalidate}`,
    object
  );
};
const RemoveViewRequisition = (object) => {
  let path = apiRoutes.Requisition.RemoveViewRequisition;
  path = path.replace("ID", object);
  return HttpClient().delete(`/${path}`);
};
const ResendOrder = (id) => {
  let path = apiRoutes.Requisition.ResendOrderRequisition;
  path = path.replace("odr", id);
  return HttpClient().post(`/${path}`);
};
const LoadReqSectionByFacilityIDandInsuranceId = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.loadReqSectionByFacilityIDandInsuranceId}`,
    object
  );
};
const GetAllDrugAllergies = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.getalldrugallergy}`, obj);
};
const SaveDrugAllergy = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.savedrugallergy}`, obj);
};
const DeleteDrugAllergy = (obj) => {
  let path = apiRoutes.Requisition.deletedrugallergy;
  path = path.replace("Id", obj.id);
  return HttpClient().delete(`/${path}`, { data: obj });
};
const StatusDrugAllergy = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.changedrugallergystatus}`,
    obj
  );
};
const GetReferenceLabLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getreferencelookup}`);
};
const GetRequisitionLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getrequisitionlookup}`);
};
const GetPanelLookup = (obj) => {
  let path = apiRoutes.Requisition.getpanellookup;
  path = path.replace("abc", obj);
  return HttpClient().get(`/${path}`);
};
const GetFacilityLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getfacilitylookup}`);
};
const GetDescriptionLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getcodelookup}`);
};
const GetCodeDescription = (obj) => {
  let path = apiRoutes.Requisition.getcodedescription;
  path = path.replace("abc", obj);
  return HttpClient().get(`/${path}`);
};
const waitingRequisition = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.waitingrequisition}`, obj);
};
const incompleteRequisition = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.incompleteRequisition}`,
    obj
  );
};
const PhysicianLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getphysicianlookup}`);
};
const DeleteIncomplete = (obj) => {
  let path = apiRoutes.Requisition.deleteIncomplete;
  path = path.replace("abc", obj);
  return HttpClient().delete(`/${path}`, { data: obj });
};

const NextStepAction = (object) => {
  return HttpClient().post(`/${apiRoutes.Requisition.NextStepAction}`, object);
};
const viewRequisitionExportToExcel = (id) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.viewRequisitionExportToExcel}`,
    id
  );
};
const viewRequisitionExportToExcelV2 = (id) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.viewRequisitionExportToExcelV2}`,
    id
  );
};

const workLogExportToExcel = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.WorkLogExportToExcelV2}`,
    payload
  );
};

const workLogCompleteCollection = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.WorkLogCompleteCollection}`,
    payload
  );
};

const BillingRequisitionExportToExcelV2 = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.BillingRequisitionExportToExcelV2}`,
    payload
  );
};

const resultDataExportToExcelV2 = (id) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.resultDataExportToExcelV2}`,
    id
  );
};

const SavePendingRequisition = (object) => {
  return HttpClient().post(`/${apiRoutes.Requisition.savePending}`, object);
};

const RestoreRequisition = (requisitionId) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.RestoreRequisition}/${requisitionId}`
  );
};

const getCollectorNameArray = (facilityId) => {
  const path = apiRoutes.Requisition.getCollectorNameList.replace(
    "facilityId",
    facilityId
  );
  return HttpClient().get(`/${path}`);
};

const GetPhysicianSignature = (obj) => {
  const path = `${apiRoutes.Requisition.getphysicianSignature}?assigneUserId=${obj?.user_id}&physicianId=${obj?.physician_id}`;

  return HttpClient().get(`/${path}`);
};
const saveRequsitionFormData = async (formdata) => {
  return await HttpClient().post(
    `/${apiRoutes.Requisition.saveRequisitionFormData}`,
    formdata
  );
};

const saveRequsitionPageCheckIn = async (formdata) => {
  return await HttpClient().post(
    `/${apiRoutes.Requisition.saveRequisitionPageCheckIn}`,
    formdata
  );
};
const GetCommonSectionForRequisition = async (queryModel) => {
  return await HttpClient().post(
    `/${apiRoutes.Requisition.getCommonSectionForRequisitiom}`,
    queryModel
  );
};

const GetCommonSectionForPatient = async (queryModel) => {
  return await HttpClient().post(
    `api/PatientManagement/LoadCommonSectionForPage`,
    queryModel
  );
};

const saveCommonSectionForPatient = async (queryModel) => {
  return await HttpClient().post(
    `${apiRoutes.Requisition.saveCommonSectionForPatient}`,
    queryModel
  );
};

const loadDynamicCustomForm = async (queryModel) => {
  return await HttpClient().post(
    `${apiRoutes.Requisition.loadDynamicCustomForm}`,
    queryModel
  );
};

const saveDynamicForm = async (queryModel) => {
  return await HttpClient().post(
    `${apiRoutes.Requisition.saveDynamicForm}`,
    queryModel
  );
};

const Export_To_Excel = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.export_excel}`, obj);
};

const GetPrintersInfo = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetPrintersInfo}`);
};

const GetRejectionReasonLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetRejectionReason}`);
};

const GetCancellationReasonLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.GetCancellationReasonsLookup}`
  );
};

const GetRejectionReasonLookupV2 = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetRejectionReasonV2}`);
};

const RequisitionRejectionDelete = (id) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.RequisitionRejectionDelete}/${id}`
  );
};

const GetDisclaimerReasonLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetRequisitionDisclaimer}`);
};
const FileUpload = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.FileUpload}`, obj);
};
const AddRejectionReason = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.AddRejectionReason}`, obj);
};
const AddNewDisclaimer = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.AddNewDisclaimer}`, obj);
};
const ShowRejectionReason = (val) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ShowRejectionReason}`,
    val
  );
};
const SaveRequisitionAgainstReason = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.SaveAgainstReason}`, obj);
};
const GetColumns = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetColumns}`);
};
const GetResultColumns = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetResultColumns}`);
};
const SaveColumns = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.SaveColumns}`, obj);
};
const SaveResultDataColumns = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.SaveResultDataColumns}`,
    obj
  );
};
const ShowBlob = (Url) => {
  let path = apiRoutes.Requisition.ShowBlob;

  path = path.replace("BLOB", Url); // Convert to string if needed

  return HttpClient().post(`/${path}`);
};
const GetSpecimentypeforFileUploadTox = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.get_tox_file_upload_specimen_type}`
  );
};
const getResultFileUpload = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.getResultFileUpload}`,
    object
  );
};

const getResultPdfFileUpload = (object) => {
  return HttpClient().post(`/${apiRoutes.Requisition.GetAllPdfFiles}`, object);
};

const getToxResultFileUpload = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.getToxResultFileUpload}`,
    object
  );
};
const ArchiveResultFileUpload = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ArchiveResultFileUpload}`,
    object
  );
};
const FileUploadResultFileUpload = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.FileUploadResultFileUpload}`,
    object
  );
};

const PdfResultFileUpload = (object) => {
  return HttpClient().post(`/${apiRoutes.Requisition.PdfUpload}`, object);
};

const PdfUploadMultiple = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.multiplePdfUpload}`,
    object
  );
};

const ToxFileUpload = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.toxconfirmationfileupload}`,
    object
  );
};
const getResultData = (object) => {
  return HttpClient().post(`/${apiRoutes.Requisition.getResultData}`, object);
};
const ArchiveResultData = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.ArchiveResultData}`, obj);
};
const UnvalidateResultData = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.UnPublishAndUnValidate}`,
    obj
  );
};
const ExportToExcelResultData = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ExportToExcelResultData}`,
    obj
  );
};
const RestoreResultData = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.RestoreResultData}`, obj);
};
const GetViewOfOrder = (obj) => {
  const path = apiRoutes.Requisition.getviewoforder;
  return HttpClient().post(`/${path}`, obj);
};
const GetLogsById = (Id) => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetLogsById}/${Id}`);
};
const GetExpandDataById = (Id) => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetExpandDataById}${Id}`);
};

const fileUpload = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.graphImageUpload}`,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

const ChangeControlStatus = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ChangeControlStatus}`,
    obj
  );
};
const ChangeOrganismStatus = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ChangeOrganismStatus}`,
    obj
  );
};
const PublishAndValidate = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.PublishAndValidate}`, obj);
};

const BulkPublishAndValidate = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.BulkPublishAndValidate}`,
    obj
  );
};
const IDLISReportView = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.IDLISReportView}`, obj);
};
const TOXLISReportView = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.TOXLISReportView}`, obj);
};
const ToxPublishAndValidate = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ToxPublishAndValidate}`,
    obj
  );
};
const SaveIdResultDataExpand = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.SaveIdResultDataExpand}`,
    obj
  );
};
const ApplyRerun = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.ApplyRerun}`, obj);
};
const ShowBlobInViewer = (Url) => {
  let path = apiRoutes.Requisition.ShowBlobInViewer;
  path = path.replace("BLOB", Url); // Convert to string if needed

  return HttpClient().post(`/${path}`);
};

export const ShowBlobInViewerV2 = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ShowBlobInViewer_V2}`,
    payload
  );
};

export const getDrugAllergies = (query) => {
  let path = apiRoutes.Requisition.getDrugAllergies;
  path = path.replace("drugStr", query);
  return HttpClient().get(`/${path}`);
};
const GenerateBlanksAgainstReqOrderId = (reqOrderId) => {
  let path = apiRoutes.Requisition.GenerateBlanksAgainstReqOrderId;
  path = path.replace("ABC", reqOrderId);
  return HttpClient().get(`/${path}`);
};
const generateSignature = async (obj) => {
  return await HttpClient().post(
    `/${apiRoutes.Requisition.generateSignature}`,
    obj
  );
};
const GetFileTypesLookup = (id) => {
  let path = apiRoutes.Requisition.GetFileTypesLookup;
  path = path.replace("IDC", id);
  return HttpClient().get(`/${path}`);
};

const getPrinterSetup = (object) => {
  return HttpClient().post(`/${apiRoutes.Requisition.getPrinterSetup}`, object);
};
const savePrinterSetup = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.savePrinterSetup}`, obj);
};
const deletePrinterSetup = (Id) => {
  return HttpClient().delete(
    `/${apiRoutes.Requisition.deletePrinterSetup}/${Id}`
  );
};
const getDigitalCheckIn = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.getDigitalCheckIn}`, obj);
};
const getScanHistroy = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.getScanHistroy}`, obj);
};

const viewRequisitionTabs = () => {
  return HttpClient().get(`${apiRoutes.Requisition.viewReqGridData}`);
};

const getPrinterContent = (object) => {
  return HttpClient().post(
    `${apiRoutes.Requisition.getPrinterContent}`,
    object
  );
};
const DuplicateRecord = (object) => {
  return HttpClient().post(
    `${apiRoutes.Requisition.DuplicateRecordViewRequisition}`,
    object
  );
};
const getResultGridData = () => {
  return HttpClient().get(`${apiRoutes.Requisition.viewResultGridData}`);
};
const UndoDigitalCheckIn = (query) => {
  let path = apiRoutes.Requisition.undoDigitalCheckIn;
  path = path.replace("abc", query);
  return HttpClient().get(`/${path}`);
};
const RejectDigitalCheckIn = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.rejectDigitalCheckIn}`,
    payload
  );
};

const DisclaimerDigitalCheckIn = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.requisitionDisclaimerAdd}`,
    payload
  );
};

const getPendingDataEntry = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.getPendingData}`, obj);
};
const DeletePendingDataEntry = (Id) => {
  return HttpClient().delete(
    `/${apiRoutes.Requisition.deletePendingDataEntry}/${Id}`
  );
};
const GetRequisitionTypeLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.reqTypeLookup}`);
};
const GetLisStatusLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.lisStatusLookup}`);
};
const GetIDLISPanelLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getPanelLookup}`);
};
const GetInsuranceLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.insurancelookup}`);
};
const GetPanelTypeLookup = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.paperCheckInpanellookup}`,
    payload
  );
};
const GetFileStatusLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getFileStatusLookup}`);
};
const GetFileStatusLookupID = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getFileStatusLookupID}`);
};
const GetFacilityLookupForPaperCheckIn = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.facilitylookuppapercheckin}`
  );
};
const GetPhysicianPaperCheckIn = (Id) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.paperCheckInphysicianlookup}/${Id}`
  );
};
const ShowOrderViewPdf = (query) => {
  return HttpClient().post(`/${apiRoutes.Requisition.showOrderViewPdf}`, query);
};
const CreateFacilityProvider = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.createFacilityProvider}`,
    obj
  );
};
const getProvidersList = (facilityId) => {
  let path = apiRoutes.Requisition.getProvidersList;
  path = path.replace("fid", facilityId);
  return HttpClient().get(`/${path}`);
};
const getCollectorsList = (facilityId) => {
  let path = apiRoutes.Requisition.getCollectorList;
  path = path.replace("fid", facilityId);
  return HttpClient().get(`/${path}`);
};
const PrintSelectedReports = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.PrintSelectedReports}`,
    obj
  );
};
const PrintSelectedRecords = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.PrintSelectedRecords}`,
    obj
  );
};
const getIDBatchQC = (object) => {
  return HttpClient().post(`/${apiRoutes.Requisition.getIDBatchQC}`, object);
};
const IDBatchQCArchive = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.IDBatchQCArchive}`, obj);
};
const GetIDBatchQCExpandData = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.GetIDBatchQCExpandData}`,
    obj
  );
};
const SaveIdBatchQCExpand = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.SaveIdBatchQCExpand}`,
    obj
  );
};
const getQCBatchSetup = (object) => {
  return HttpClient().post(`/${apiRoutes.Requisition.getQCBatchSetup}`, object);
};
const saveQCBatchSetup = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.saveQCBatchSetup}`, obj);
};
const ChangeStatusQCBatchSetup = (Id) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.ChangeStatusQCBatchSetup}/${Id}`
  );
};
const ChangeStatusPreConfiguration = (Id) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.ChangeStatusPreConfiguration}?id=${Id}`
  );
};
const ViewContactInformation = (Id) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.ViewContactInformation}?Id=${Id}`
  );
};
const RestoreQCBatchSetup = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.RestoreQCBatchSetup}`,
    obj
  );
};

const GetReportAsync = (Id) => {
  return HttpClient().get(`/${apiRoutes.Requisition.GetReportAsync}${Id}`);
};
const LeveyJenningReport = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Lenveingjenningreport}`,
    obj
  );
};
const ToxicologyGroupLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.tox_group_lookup}`);
};
const ScreenTestLookup = (specimenTypeId, performingLabId) => {
  const path = apiRoutes.Requisition.tox_screen_test_lookup
    .replace("{SpecimenTypeID}", specimenTypeId)
    .replace("{LabId}", performingLabId);

  return HttpClient().get(path);
};

const ToxicologyReferenceLab = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.Tox_Reference_Lab}`);
};

const getConfirmationTestLookup = (specimenTypeId, LabId) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.getConfirmationTestLookup}?specimenTypeId=${specimenTypeId}&LabId=${LabId}`
  );
};

const ToxicologyPanelTypeLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.Tox_PanelType_Lookup}`);
};
const SpecimenTypeLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.Tox_SpecimenType_Lookup}`);
};
const ToxCompendiumGetAll = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.Tox_GetAll}`, obj);
};

const toxCompendiumOtherThanPanelMapping = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Tox_OtherThanPanelMapping}`,
    obj
  );
};

const saveConfirmationTabData = (payload) => {
  return HttpClient().post(
    `api/ToxCompendium/SaveToxCompendiumConfirmationData`,
    payload
  );
};

const saveScreenDataTabTox = (payload) => {
  return HttpClient().post(
    `api/ToxCompendium/SaveToxCompendiumScreeningData`,
    payload
  );
};

const saveToxPanelMappingData = (payload) => {
  return HttpClient().post(
    `api/ToxCompendium/SaveToxCompendiumPanelMappingData`,
    payload
  );
};

const saveNewValidityTabData = (payload) => {
  return HttpClient().post(
    `api/ToxCompendium/SaveToxCompendiumValidityData`,
    payload
  );
};
const PanelCodeLookup = (AnalyteId) => {
  let path = apiRoutes?.Requisition?.getpanelcodelookup;
  path = path.replace("analyteId", AnalyteId);
  return HttpClient().post(`/${path}`);
};
const ToxCompendiumReflexRule = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.Tox_ReflexRules}`, obj);
};
const GetAllToxScreenTestSetup = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Tox_Screen_TestSetup}`,
    obj
  );
};
const SaveToxCompendium = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.save_tox_compendium}`,
    obj
  );
};
const SaveToxRefelexRules = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.save_tox_compendium_ReflexRules}`,
    obj
  );
};
const TestLookup = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Tox_Compendium_TestLookup}`,
    obj
  );
};

const getConfirmationDrugClassLookup = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.tox_drug_class_lookup}`,
    payload
  );
};

const getConfirmationTestOnConfirmationDrugClass = (drugClass) => {
  return HttpClient().get(
    `api/ToxCompendium/GetConfirmationTest/${drugClass}/ByDrugClassLookup`
  );
};

const ExportAllToxCompendiumData = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ExportAlltoExcelToxCompendium}`,
    obj
  );
};
const SaveToxScreenTestSet = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Save_Screen_Test_Setup}`,
    obj
  );
};
const SaveToxDrugsAnalytes = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.Save_Drug_Analytes}`, obj);
};

/**
 * Services API
 * Workflow Management
 */
const getAllWorkflowStatus = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.getAllWorkflowStatus}`,
    queryModel
  );
};

const getLabLookupWorkflowStatus = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.getLabLookupWorkflowStatus}`
  );
};

const getRequisitionTypesLookupWorkflowStatus = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.getRequisitionTypesLookupWorkflowStatus}`
  );
};

const getPortalTypesLookupWorkflowStatus = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.getPortalTypesLookupWorkflowStatus}`
  );
};

const getWorkFlowStatusLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getWorkFlowStatusLookup}`);
};

const saveWorkFlowStatus = (searchQuery) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.saveWorkFlowStatus}`,
    searchQuery
  );
};

const ChangeWorkflowStatus = (workflowStatusId) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ChangeWorkflowStatus}`,
    workflowStatusId
  );
};
const GetAssignedAgainstIDS = (ID, specimenTypeId) => {
  let path = apiRoutes.Requisition.getAssinedToxAnalytes;
  path = path.replace("ELLO", ID);
  path = path.replace("{SpecimenTypeID}", specimenTypeId);

  return HttpClient().get(`/${path}`);
};
const DeleteToxScreenTestSetupAnalyte = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Delete_ToxScreenTestSetup_Analyte}`,
    obj
  );
};
const GetAllToxMedicationList = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.GetAllTox_MedicationList}`,
    obj
  );
};
const ConfirmationTestTypeLookup = (specimenTypeId, LabId) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.Cofirmation_TestType_Lookup}?specimenTypeId=${specimenTypeId}&LabId=${LabId}`
  );
};

const AllConfirmationTestTypeLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.Cofirmation_TestType_Lookup}`
  );
};

const GetToxMedication = (suggestions) => {
  let path = apiRoutes.Requisition.Tox_medication_list;
  path = path.replace("suggestions", suggestions);
  return HttpClient().get(`/${path}`);
};
const SaveMedicationList = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.SaveMedicationList}`, obj);
};

const deleteToxMedicationRow = (id) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.DeleteToxMedicationRow}/${id}/Medication`
  );
};

const LoadDataDynamicConfiguration = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.load_dynamic_config}`,
    obj
  );
};
const UpdateDynamicConfiguration = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.update_dynamic_configuration}`,
    obj
  );
};
const GetAllToxMedicationAssignment = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Get_Medication_Assignment}`,
    obj
  );
};
const SaveMedicationAssignment = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.save_medication_assignment}`,
    obj
  );
};

const DeleteMedicationAssignmentById = (id) => {
  let path = apiRoutes.Requisition.DeleteMedAssignment;
  path = path.replace("IDD", id);
  return HttpClient().delete(`/${path}`);
};
const getToxicologyAllResultData = (parameter) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ToxicologyAllResultData}`,
    parameter
  );
};
const getToxResultGridTabsData = () => {
  return HttpClient().get(`${apiRoutes.Requisition.tox_grid_tabs_data}`);
};
const ToxicologyBulkPublishAndValidate = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Toxicology_Bulk_Publish_Validate}`,
    obj
  );
};
const GetToxExpandDataById = (Id) => {
  let path = apiRoutes.Requisition.GetToxExpandById;
  path = path.replace("REQIDC", Id);
  return HttpClient().get(`/${path}`);
};
const GetToxMedicationList = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.Toxicology_Medication_Expand}`,
    obj
  );
};
const SaveToxMedicationExpand = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.save_tox_expand}`, obj);
};
const RestoreToxResultData = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.RestoreToxResultData}`,
    obj
  );
};
const ArchiveToxResultData = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.ArchiveToxResultData}`,
    obj
  );
};
const ToxresultDataExportToExcelV2 = (id) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.toxresultDataExportToExcelV2}`,
    id
  );
};
const SaveToxResultDataExpand = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.SaveToxResultDataExpand}`,
    obj
  );
};

const dynamicGrid = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.requisitionDynamicGrid}`,
    object
  );
};

const workLogGetAll = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.getRequisitionWorkLogAll}`,
    object
  );
};

const dynamicGridExpandableData = (id) => {
  return HttpClient().post(`/api/ViewRequisition/DynamicGrid/${id}/Expand`);
};

const GetToxLISPanelLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getToxLisstatus}`);
};
const ToxApplyRerun = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.tox_Apply_Rerun}`, obj);
};

const saveReDraw = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.saveReDraw}`, obj);
};

const saveReCollect = (obj) => {
  return HttpClient().post(`/${apiRoutes.Requisition.SaveReCollect}`, obj);
};

const saveAssignPhlebotomist = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.saveAssignPhlebotomist}`,
    obj
  );
};

const checkSpecimenDuplicationForReq = (specimenId) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.checkSpecimenId}/${specimenId}/SpecimenId`
  );
};

const workLogExpandInfo = (id) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.workLogExpandInfo}?requisitionOrderId=${id}`
  );
};

const GetReCollectData = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.GetReCollectData}`,
    payload
  );
};

const getCancellationReasonsLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.getCancellationReasonsLookup}`
  );
};
const getRejectReasonTypesLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.getRejectReasonTypesLookup}`
  );
};
const getPartialRejectionLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.getPartialRejectionLookup}`
  );
};

const getPhlebotomistsLookup = () => {
  return HttpClient().get(`/${apiRoutes.Requisition.getPhlebotomistsLookup}`);
};

const GenerateAssecission = (obj) => {
  let path = apiRoutes.Requisition.genaretspecimenId;
  path = path.replace("fid", obj.fid);
  path = path.replace("rid", obj.rid);
  return HttpClient().get(`/${path}`);
};

const GetFacilityByProviderId = (providerId) => {
  let path = apiRoutes.Requisition.FacilityLookupByProviderId;
  path = path.replace("pid", providerId);
  return HttpClient().get(`/${path}`);
};

const GetBillingPanels = (Id) => {
  let path = apiRoutes.Requisition.getBillingPanels;
  path = path.replace("Idxdxd", Id);
  return HttpClient().get(`/${path}`);
};
const ChangeBillingStatus = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.changeBillingStatus}`,
    obj
  );
};

const requisitionStatuses = (obj) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.workFlowStatusLookup}`,
    obj
  );
};

const requisitionTypeLookup = (obj) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.requisitionTypeLookup}`,
    obj
  );
};

const updateRequisitionCollectionDateAndTime = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.updateCollectionDateAndTime}`,
    obj
  );
};

const trackingActivityLogs = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.Requisition.trackingActivityLogs}`,
    payload
  );
};

const trackingAuditLogs = (requisitionOrderId, trackingType) => {
  return HttpClient().get(
    `/${apiRoutes.Requisition.trackingAuditLogs}/${requisitionOrderId}/${trackingType}/AuditLogs`
  );
};

const resendFax = (id) => {
  return HttpClient().post(`/${apiRoutes.Requisition.resendFaxUrl}/${id}`);
};

const getMetabolites = () => {
  return HttpClient().get(`api/ToxCompendium/GetMetabolites`);
};

const transferRecords = (ids, actionName) => {
  return HttpClient().post(apiRoutes.Requisition.bulkTransferOrder, {
    orderIdList: ids,
    action: actionName,
  });
};
const GetDrugBankData = (suggestions) => {
  let path = apiRoutes.Requisition.getDrugBanKApi;
  path = path.replace("xyz", suggestions);
  return HttpClient().get(`/${path}`);
};
const RequisitionType = {
  getAllRequisitionType,
  changeRequisitionStatus,
  saveRequisitionType,
  updateRequisitionType,
  searchNpi,
  requisitionLookUp,
  requisitionColorLookup,
  getAllViewRequisition,
  getAllBillingRequisition,
  GetAssignedAgainstIDS,
  getAllResultData,
  GetBillingPanels,
  ChangeBillingStatus,
  ViewRequisitionBulkStatusChange,
  RemoveViewRequisition,
  LoadReqSectionByFacilityIDandInsuranceId,
  GetAllDrugAllergies,
  SaveDrugAllergy,
  DeleteDrugAllergy,
  StatusDrugAllergy,
  GetReferenceLabLookup,
  GetRequisitionLookup,
  GetPanelLookup,
  GetFacilityLookup,
  GetDescriptionLookup,
  GetCodeDescription,
  waitingRequisition,
  incompleteRequisition,
  PhysicianLookup,
  DeleteIncomplete,
  NextStepAction,
  viewRequisitionExportToExcel,
  SavePendingRequisition,
  RestoreRequisition,
  saveRequsitionFormData,
  saveRequsitionPageCheckIn,
  Export_To_Excel,
  GetPrintersInfo,
  FileUpload,
  GetColumns,
  GetResultColumns,
  SaveColumns,
  SaveResultDataColumns,
  getCollectorNameArray,
  ShowBlob,
  getResultFileUpload,
  ArchiveResultFileUpload,
  FileUploadResultFileUpload,
  getResultData,
  ArchiveResultData,
  UnvalidateResultData,
  ExportToExcelResultData,
  RestoreResultData,
  GetCommonSectionForRequisition,
  GetViewOfOrder,
  GetLogsById,
  GetExpandDataById,
  ChangeControlStatus,
  ChangeOrganismStatus,
  PublishAndValidate,
  BulkPublishAndValidate,
  IDLISReportView,
  SaveIdResultDataExpand,
  ShowBlobInViewer,
  getDrugAllergies,
  GenerateBlanksAgainstReqOrderId,
  generateSignature,
  GetFileTypesLookup,
  DeleteToxScreenTestSetupAnalyte,
  getPrinterSetup,
  savePrinterSetup,
  deletePrinterSetup,
  getDigitalCheckIn,
  getScanHistroy,
  getResultGridData,
  UndoDigitalCheckIn,
  RejectDigitalCheckIn,
  getPendingDataEntry,
  DeletePendingDataEntry,
  GetRequisitionTypeLookup,
  GetInsuranceLookup,
  GetPanelTypeLookup,
  GetFacilityLookupForPaperCheckIn,
  GetPhysicianPaperCheckIn,
  ShowOrderViewPdf,
  CreateFacilityProvider,
  viewRequisitionExportToExcelV2,
  BillingRequisitionExportToExcelV2,
  resultDataExportToExcelV2,
  getProvidersList,
  getCollectorsList,
  PrintSelectedReports,
  PrintSelectedRecords,
  ApplyRerun,
  getIDBatchQC,
  IDBatchQCArchive,
  GetIDBatchQCExpandData,
  SaveIdBatchQCExpand,
  getQCBatchSetup,
  saveQCBatchSetup,
  ChangeStatusQCBatchSetup,
  ChangeStatusPreConfiguration,
  GetReportAsync,
  RestoreQCBatchSetup,
  LeveyJenningReport,
  GetLisStatusLookup,
  GetIDLISPanelLookup,
  ToxicologyGroupLookup,
  ToxicologyReferenceLab,
  ToxicologyPanelTypeLookup,
  SpecimenTypeLookup,
  ToxCompendiumGetAll,
  SaveToxCompendium,
  ToxCompendiumReflexRule,
  SaveToxRefelexRules,
  TestLookup,
  ExportAllToxCompendiumData,
  GetAllToxScreenTestSetup,
  SaveToxScreenTestSet,
  getAllWorkflowStatus,
  ChangeWorkflowStatus,
  saveWorkFlowStatus,
  getLabLookupWorkflowStatus,
  getRequisitionTypesLookupWorkflowStatus,
  getPortalTypesLookupWorkflowStatus,
  getWorkFlowStatusLookup,
  ScreenTestLookup,
  SaveToxDrugsAnalytes,
  GetAllToxMedicationList,
  GetToxMedication,
  SaveMedicationList,
  LoadDataDynamicConfiguration,
  UpdateDynamicConfiguration,
  GetAllToxMedicationAssignment,
  SaveMedicationAssignment,
  DeleteMedicationAssignmentById,
  toxCompendiumOtherThanPanelMapping,
  saveConfirmationTabData,
  getToxicologyAllResultData,
  getToxResultGridTabsData,
  ToxicologyBulkPublishAndValidate,
  GetToxExpandDataById,
  GetToxMedicationList,
  SaveToxMedicationExpand,
  RestoreToxResultData,
  ArchiveToxResultData,
  ToxresultDataExportToExcelV2,
  SaveToxResultDataExpand,
  GetToxLISPanelLookup,
  saveScreenDataTabTox,
  saveNewValidityTabData,
  ToxApplyRerun,
  saveToxPanelMappingData,
  getConfirmationDrugClassLookup,
  getConfirmationTestOnConfirmationDrugClass,
  getToxResultFileUpload,
  ToxFileUpload,
  deleteToxMedicationRow,
  GetSpecimentypeforFileUploadTox,
  dynamicGrid,
  TOXLISReportView,
  dynamicGridExpandableData,
  GetCommonSectionForPatient,
  saveCommonSectionForPatient,
  ToxPublishAndValidate,
  loadDynamicCustomForm,
  saveDynamicForm,
  ViewContactInformation,
  GetPhysicianSignature,
  GetFileStatusLookup,
  GetFileStatusLookupID,
  PanelCodeLookup,
  workLogGetAll,
  checkSpecimenDuplicationForReq,
  getDefaultPrinter,
  getPrinterContent,
  ResendOrder,
  GenerateAssecission,
  workLogExpandInfo,
  GetReCollectData,
  getCancellationReasonsLookup,
  getRejectReasonTypesLookup,
  GetFacilityByProviderId,
  GetRejectionReasonLookup,
  AddRejectionReason,
  ShowRejectionReason,
  SaveRequisitionAgainstReason,
  viewRequisitionTabs,
  workLogExportToExcel,
  workLogCompleteCollection,
  saveReDraw,
  saveReCollect,
  getPhlebotomistsLookup,
  saveAssignPhlebotomist,
  GetDisclaimerReasonLookup,
  DisclaimerDigitalCheckIn,
  getConfirmationTestLookup,
  requisitionStatuses,
  requisitionTypeLookup,
  trackingAuditLogs,
  updateRequisitionCollectionDateAndTime,
  trackingActivityLogs,
  AddNewDisclaimer,
  DuplicateRecord,
  OrderViewUnvalidate,
  GetRejectionReasonLookupV2,
  RequisitionRejectionDelete,
  ConfirmationTestTypeLookup,
  resendFax,
  fileUpload,
  GetCancellationReasonLookup,
  getPartialRejectionLookup,
  AllConfirmationTestTypeLookup,
  getMetabolites,
  getResultPdfFileUpload,
  PdfResultFileUpload,
  transferRecords,
  GetDrugBankData,
  PdfUploadMultiple,
};

export default RequisitionType;
