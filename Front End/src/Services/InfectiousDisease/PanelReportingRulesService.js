import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getPanelReportingRules = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.getPanelReportingRules}`,
    queryModel
  );
};
const createOrUpdatePanelReportingRules = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.createOrUpdatePanelReportingRules}`,
    queryModel
  );
};

const GetPanelsAndTestsById = (id) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.GetPanelsAndTestsById}/${id}`
  );
};
const DownloadTemplate = () => {
  return HttpClient().get(`/${apiRoutes.InfectiousDisease.Downloadtemplate}`);
};
const BulkCompandiumUpload = (jsonstring) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.BulkCompandiumUpload}`,
    jsonstring
  );
};
const panelReportingExportToExcel = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.panelReportingExportToExcel}`,
    queryModel
  );
};
const ToxCompendiumDownloadTemplate = () => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.Tox_Compendium_Download_Template}`
  );
};
const ToxCompendiumTemplateUpload = (jsonstring) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.Tox_Compendium_Upload_Template}`,
    jsonstring
  );
};
const PanelReportingRulesService = {
  getPanelReportingRules,
  createOrUpdatePanelReportingRules,
  GetPanelsAndTestsById,
  DownloadTemplate,
  BulkCompandiumUpload,
  panelReportingExportToExcel,
  ToxCompendiumDownloadTemplate,
  ToxCompendiumTemplateUpload,
};

export default PanelReportingRulesService;
