import HttpClient from "../../../HttpClient";
import apiRoutes from "../../../Routes/Routes.json";

export const RequisitionReportSave = (obj) => {
  return HttpClient().post(apiRoutes.Requisition.requesitionSaveReport, obj);
};

export const ScheduledReportDownload = (obj) => {
  return HttpClient().post(apiRoutes.Requisition.scheduledReportDownload, obj);
};

export const RequisitionReportGetAll = (obj) => {
  return HttpClient().post(apiRoutes.Requisition.requesitionReportGetAll, obj);
};

export const RequisitionReportShare = (obj) => {
  return HttpClient().post(apiRoutes.Requisition.requisitionReportShare, obj);
};
export const RequisitionReportGeDownload = (obj) => {
  return HttpClient().post(
    apiRoutes.Requisition.requisitionReportDowaloadtab,
    obj
  );
};

export const RequisitionReportDelete = (id) => {
  const path = `${apiRoutes.Requisition.requisitionReportDelete}${id}`;
  return HttpClient().delete(path);
};