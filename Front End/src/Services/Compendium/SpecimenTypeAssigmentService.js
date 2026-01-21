import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getSpecimenTypeAssigment = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.Compendium.getSpecimenTypeAssigment}`,
    queryModel
  );
};
const createOrUpdateSpecimenTypeAssigment = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.Compendium.createOrUpdateSpecimenTypeAssigment}`,
    queryModel
  );
};

const RequisitionTypeLookup = () => {
  return HttpClient().get(`/${apiRoutes.Compendium.RequisitionTypeLookupV2}`);
};
const SpecimenTypeLookup = () => {
  return HttpClient().get(`/${apiRoutes.Compendium.SpecimenTypeLookup}`);
};
const TestSetupLookup = () => {
  return HttpClient().get(`/${apiRoutes.Compendium.TestSetupLookup}`);
};
const PanelSetupLookup = (id) => {
  let path = apiRoutes.Compendium.PanelSetupLookup;
  path = path.replace("abc", id);
  return HttpClient().get(`/${path}`);
};

const getPanelsByReqTypeIdAndLabId = (reqTypeId, refLabId) => {
  return HttpClient().get(
    `/${apiRoutes.Compendium.getPanelsByReqTypeIdAndLabId}/${reqTypeId}/${refLabId}`
  );
};

const changeSpecimenTypeAssigmentStatus = (statusRequest) => {
  return HttpClient().post(
    `/${apiRoutes.Compendium.ChangeSpecimenTypeAssigmentStatus}`,
    statusRequest
  );
};
const DeleteSpecimenTypeAssignmentById = (id) => {
  let path = apiRoutes.Compendium.DeleteSpecimenTypeAssignmentById;
  path = path.replace("id", id);
  return HttpClient().delete(`/${path}`);
};

const SpecimenTypeAssigmentService = {
  getSpecimenTypeAssigment,
  createOrUpdateSpecimenTypeAssigment,
  RequisitionTypeLookup,
  SpecimenTypeLookup,
  TestSetupLookup,
  PanelSetupLookup,
  changeSpecimenTypeAssigmentStatus,
  DeleteSpecimenTypeAssignmentById,
  getPanelsByReqTypeIdAndLabId,
};

export default SpecimenTypeAssigmentService;
