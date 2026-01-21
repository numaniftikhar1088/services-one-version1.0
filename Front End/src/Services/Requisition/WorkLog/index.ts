import HttpClient from "../../../HttpClient";
import apiRoutes from "../../../Routes/Routes.json";

export const getPhlebotomistsLookup = () => {
  return HttpClient().post(apiRoutes.Requisition.getPhlebotomistsLookup);
};

interface payloadI {
  facilityId: 0;
  PhlebotomistId: "";
}

interface payloadUpdateWorklog {
  requisitonOrderID: number;
  billingMileage: string;
  nonBillingMileage: string;
  recollectDate: string;
  daysInQueue: string;
  drawLocation: string;
  numberofAttempts: string;
}
interface payloadRejectedReasonI {
  id: number;
  rejectType: string;
  rejectReason: string;
}

export const savePhlebotomistsyAssignment = (payload: payloadI) => {
  return HttpClient().post(
    apiRoutes.Requisition.savePhlebotomistsyAssignment,
    payload
  );
};

export const saveUdateWorkLog = (payload: payloadUpdateWorklog) => {
  return HttpClient().post(apiRoutes.Requisition.UpdateWorkLog, payload);
};

export const saveRejectedReason = (payload: payloadRejectedReasonI) => {
  return HttpClient().post(apiRoutes.Requisition.SaveRejectionReason, payload);
};

export const deleteRecord = (tabId: number, id: number) => {
  return HttpClient().delete(
    `${apiRoutes.Requisition.DeleteRecord}/${tabId}/${id}`
  );
};
