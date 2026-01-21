import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

export const SalesGroupAgainst = (id) => {
  let path = apiRoutes.ManageSalesGroup.salesRepGroupAgainst;
  path = path.replace("{Id}", id);

  return HttpClient().get(`${path}`);
};

export const SalesRepEditApi = (obj) => {
  return HttpClient().post(apiRoutes.ManageSalesGroup.salesRepEditApi, obj);
};

export const SalesRepsaveAgainst = (obj) => {
  return HttpClient().post(apiRoutes.ManageSalesGroup.salesRepSaveAgainst, obj);
};

export const SalesGroupGetAll = (obj) => {
  return HttpClient().post(apiRoutes.ManageSalesGroup.salesRepGroupGetAll, obj);
};
export const SalesGroupDelete = (obj) => {
  return HttpClient().delete(
    apiRoutes.ManageSalesGroup.salesRepGroupDelete,
    obj
  );
};
export const SalesGroupLookup = () => {
  return HttpClient().get(apiRoutes.ManageSalesGroup.salesRepGroupLookup);
};
export const SalesGroupArchive = (obj) => {
  return HttpClient().put(apiRoutes.ManageSalesGroup.salesRepGroupArchive, obj);
};
