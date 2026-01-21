import HttpClient from "HttpClient";
import apiRoutes from "../../Routes/Routes.json";

export const GetAllReflexRules = (queryModel: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.GetAllReflexRules}`,
    queryModel
  );
};

export const SaveReflexRules = (queryModel: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.SaveReflexRules}`,
    queryModel
  );
};

export const PanelsAgainstLabId = (labId: number | null) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.PanelsAgainstLabId}${
      labId ? `?labId=${labId}` : ""
    }`
  );
};

export const TestsAgainstLabId = (labId: number | null) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.TestsAgainstLabId}${
      labId ? `?labId=${labId}` : ""
    }`
  );
};
