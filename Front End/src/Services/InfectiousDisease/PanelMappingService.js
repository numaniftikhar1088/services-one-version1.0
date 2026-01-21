import HttpClient from '../../HttpClient.ts'
import apiRoutes from '../../Routes/Routes.json'

const getPanelMapping = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.getPanelMapping}`,
    queryModel,
  )
}
const createOrUpdatePanelMapping = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.createOrUpdatePanelMapping}`,
    queryModel,
  )
}
const getAllDeletedCompendium = (queryModel)=>{
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.getAllDeletedCompedium}`,
     queryModel,
  ) 
}
const AssayDataLookup = () => {
  return HttpClient().get(`/${apiRoutes.InfectiousDisease.AssayDataLookup}`)
}
const ReportingRulesLookup = () => {
  return HttpClient().get(`/${apiRoutes.InfectiousDisease.ReportingRulesLookup}`)
}
const GroupLookup = () => {
  return HttpClient().get(`/${apiRoutes.InfectiousDisease.GroupLookup}`)
}
const PerformingLabLookup = () => {
  return HttpClient().get(`/${apiRoutes.InfectiousDisease.PerformingLabLookup}`)
}
const GetPanelInfoById = (id) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.GetPanelInfoById}/${id}`,
  )
}
const deletePanelMapping = (id) => {
  return HttpClient().delete(
    `/${apiRoutes.InfectiousDisease.deletePanelMapping}?Id=${id}`
  );
};
const restoreDeletedPanelMapping = (id) => {
  return HttpClient().delete(
    `/${apiRoutes.InfectiousDisease.restoredeletePanelMapping}?Id=${id}`
  );
};

const panelMappingExportToExcel = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.panelMappingExportToExcel}`,
    queryModel,
  )
}
const PanelMappingService = {
  getPanelMapping,
  createOrUpdatePanelMapping,
  ReportingRulesLookup,
  AssayDataLookup,
  GroupLookup,
  deletePanelMapping,
  PerformingLabLookup,
  GetPanelInfoById,
  panelMappingExportToExcel,
  getAllDeletedCompendium,
  restoreDeletedPanelMapping
}

export default PanelMappingService
