import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

export const postPanelType = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.savePanelType}`, object);
};

export const getPanelType = (queryModel) => {
  return HttpClient().post(`/${apiRoutes.Compendium.getPanelType}`, queryModel);
};

export const panelTypeDelete = (id) => {
  const path = `${apiRoutes.Compendium.PanelTypeDelete}${id}`;
  return HttpClient().delete(path);
};


export const statusChangeType = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.changePanelTypeStatus, obj)
}