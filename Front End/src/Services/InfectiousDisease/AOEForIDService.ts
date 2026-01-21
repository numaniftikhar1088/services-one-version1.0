import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "HttpClient";

export const GetAllAOEForID = (payLoad: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.GetAOEsDetails}`,
    payLoad
  );
};

export const SaveOrUpdateAOEs = (payLoad: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.SaveOrUpdateAOEs}`,
    payLoad
  );
};

export const SaveExpandAOEs = (payLoad: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.SaveExpandData}`,
    payLoad
  );
};

export const GetExpandDataAOEs = (id: number) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.GetExpandDataAOEs}/${id}`
  );
};

export const AOEsDeleteById = (id: number) => {
  return HttpClient().delete(
    `/${apiRoutes.InfectiousDisease.AOEsDeleteById}/${id}`
  );
};
