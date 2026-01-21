import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

export const DrugAllergySaveData = (obj) => {
  return HttpClient().post(apiRoutes.DrugAllergy.DrugAllergySave, obj);
};

export const DrugAllergyGetAll = (obj) => {
  return HttpClient().post(apiRoutes.DrugAllergy.DrugAllergyGetAll, obj);
};

export const DrugAllergyDelete = (id) => {
  const path = `${apiRoutes.DrugAllergy.DrugAllergyDelete}${id}`;
  return HttpClient().delete(path);
};

export const DrugAllergyStatusChange = (obj) => {
  return HttpClient().post(apiRoutes.DrugAllergy.DrugAllergyStatusChange, obj);
};

export const UniqueDescription = (obj) => {
  const path = apiRoutes.DrugAllergy.DescriptionUnique;
  path = path.replace("pid", obj);
  return HttpClient().post(`/${path}`);
};


