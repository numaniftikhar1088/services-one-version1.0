import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

export const getTestType = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.getTestType, obj)
}

export const saveTestType = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.saveTestType, obj);
};

export const testTypeDelete = (id) => {
  const path = `${apiRoutes.Compendium.deleteTestType}/${id}`;
  return HttpClient().delete(path);
};

export const statusChangeTestType = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.changeTestTypeStatus, obj)
}