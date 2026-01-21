import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getAssayData = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.getAssayData}`,
    queryModel
  );
};
const createOrUpdateAssayData = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.createOrUpdateAssayData}`,
    queryModel
  );
};

export const AOEsAssayNameLookup = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.AOEsAssayNameLookup}`,
    queryModel
  );
};
const ReferenceLabsLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.ReferenceLabsLookup}`
  );
};
const GetPanelsAndReportingRulesById = (id) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.GetPanelsAndReportingRulesById}/${id}`
  );
};
const AssayDataService = {
  getAssayData,
  createOrUpdateAssayData,
  ReferenceLabsLookup,
  GetPanelsAndReportingRulesById,
};

export default AssayDataService;
