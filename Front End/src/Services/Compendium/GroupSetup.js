import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getAllGroupSetup = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.getAllGroupSetup}`, object);
};

const CreateGroups = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.creategroup}`, object);
};
const UpdateGroups = (object) => {
  return HttpClient().put(`/${apiRoutes.Compendium.updategroups}`, object);
};
const changeGroupStatus = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.changeGroupstatus}`, object);
};
const deleteGroup = (object) => {
  let path = apiRoutes.Compendium.deletegroup;
  path = path.replace("id", object.id);
  return HttpClient().delete(`/${path}`, { data: object });
};
const getRequisitionTypeLookup = () => {
  return HttpClient().get(`/${apiRoutes.Compendium.getreqtypelookup}`);
};

const GroupSetup = {
  getAllGroupSetup,
  CreateGroups,
  changeGroupStatus,
  getRequisitionTypeLookup,
  deleteGroup,
  UpdateGroups,
};

export default GroupSetup;
