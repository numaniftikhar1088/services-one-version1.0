import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "HttpClient";

export const GetAllMicroBiologyPanelMapping = (queryModel: any) => {
  return HttpClient().post(
    `/${apiRoutes.MicroBiologyLis.PanelMapping.GetAll}`,
    queryModel
  );
};

export const SavePanelMapping = (queryModel: any) => {
  return HttpClient().post(
    `/${apiRoutes.MicroBiologyLis.PanelMapping.SavePanelMapping}`,
    queryModel
  );
};

export const DeleteRecordPanelMapping = (id: number) => {
  return HttpClient().delete(
    `/${apiRoutes.MicroBiologyLis.PanelMapping.DeleteByIdPanelMapping}/${id}`
  );
};

export const GroupLookupByReqType = (id: number) => {
  return HttpClient().get(
    `/${apiRoutes.MicroBiologyLis.PanelMapping.GroupLookupByReqType}/${id}`
  );
};
