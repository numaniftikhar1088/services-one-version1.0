import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "HttpClient";

export const getAllData = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.GetAll}`,
    parameter
  );
};

export const SaveBloodResultDataExpand = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.SaveBloodResultDataExpand}`,
    parameter
  );
};

export const BloodLISReportView = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.BloodLISReport}`,
    parameter
  );
};

export const GetExpandData = (Id: number) => {
  return HttpClient().get(
    `${apiRoutes.BloodLis.ResultData.GetExpandData}?reqOrderId=${Id}`
  );
};

export const GetCriticalNoteFormData = (Id: number) => {
  return HttpClient().get(
    `${apiRoutes.BloodLis.ResultData.GetCriticalNoteFormData}?testId=${Id}`
  );
};

export const DeleteCriticalNote = (Id: number) => {
  return HttpClient().delete(
    `${apiRoutes.BloodLis.ResultData.DeleteCriticalNote}?noteId=${Id}`
  );
};

export const BloodResultDataExportToExcelV2 = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.BloodResultDataExportToExcelV2}`,
    parameter
  );
};

export const BloodResultDataValidateTest = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.BloodResultDataValidate}`,
    parameter
  );
};
export const BloodResultDataReRunTest = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.BloodResultDataApplyRerun}`,
    parameter
  );
};

export const BloodResultDataTransferTest = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.BloodResultDataTransferTests}`,
    parameter
  );
};

export const SaveCriticalNote = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.SaveCriticalNote}`,
    parameter
  );
};

export const BloodResultDataRejectTest = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.BloodResultDataRejectTests}`,
    parameter
  );
};

export const BloodResultDataReportTest = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.BloodResultDataReportTests}`,
    parameter
  );
};

export const BloodResultDataBulkValidate = (parameter: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.BloodResultDataBulkValidate}`,
    parameter
  );
};

export const getTabsConfiguration = () => {
  return HttpClient().get(`${apiRoutes.BloodLis.ResultData.TabsConfiguration}`);
};

export const GetCannedComments = (name: string) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.GetCannedAndRejectedCommentsLookup}?value=${name}`
  );
};

export const ApplyPrelim = (reqOrderId: number) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.ApplyPrelim}?requisitionorderId=${reqOrderId}`
  );
};

export const UnValidateData = (obj: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.UnValidateData}`,
    obj
  );
};

export const SaveInternalNotes = (payload: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.SaveLabComment}`,
    payload
  );
};

export const SaveValidateBloodData = (payload: any) => {
  return HttpClient().post(
    `${apiRoutes.BloodLis.ResultData.SaveValidateBloodData}`,
    payload
  );
};
