import HttpClient from "HttpClient";
import apiRoutes from "../../Routes/Routes.json";

export const labIntegrationRequest = (payload: any) => {
  return HttpClient().post(
    apiRoutes.MarketPlace.labIntegrationRequest,
    payload
  );
};

export const getIntegrationDetailById = (Id: number) => {
  return HttpClient().get(
    `${apiRoutes.MarketPlace.getIntegrationDetailById}/${Id}`
  );
};

export const getMarketPlaceGetAll = (payload: any) => {
  return HttpClient().post(apiRoutes.MarketPlace.getAllIntegration, payload);
};

export const getIntegrationCategories = () => {
  return HttpClient().get(apiRoutes.MarketPlace.getIntegrationCategories);
};
