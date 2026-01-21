import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getAllSpecimenType = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.getSpecimenType}`, object);
};

const saveSpecimenType = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.saveSpecimenType}`, object);
};

const changeSpecimenStatus = (object) => {
  return HttpClient().post(
    `/${apiRoutes.Compendium.changeSpecimenStatus}`,
    object
  );
};

const getSpecimenTypeDropdown = () => {
  return HttpClient().get(`/${apiRoutes.Compendium.getSpecimenTypeDropdown}`);
};
const checkSpecimenType = (obj) => {
  let path = apiRoutes.Compendium.IsSpecimenPreFixExistsAsync;
  path = path.replace("xyz", obj);
  return HttpClient().post(`/${path}`, obj);
};
const IsSpecimenTypeExistsAsync = (obj) => {
  let path = apiRoutes.Compendium.IsSpecimenTypeExistsAsync;
  path = path.replace("xyz", obj);
  return HttpClient().post(`/${path}`, obj);
};

const DeleteSpecimenType = (id) => {
  let path = apiRoutes.Compendium.deletespecimenTypebyid;
  path = path.replace("xyz", id);
  return HttpClient().delete(`/${path}`);
};
const SpecimenType = {
  getAllSpecimenType,
  saveSpecimenType,
  changeSpecimenStatus,
  getSpecimenTypeDropdown,
  checkSpecimenType,
  IsSpecimenTypeExistsAsync,
  DeleteSpecimenType,
};

export default SpecimenType;
