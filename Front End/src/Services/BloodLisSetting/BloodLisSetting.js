import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

export const CannedAndRejectionGetAll = (obj) => {
  return HttpClient().post(
    apiRoutes.Compendium.getGetCannedAndRejectionRecords,
    obj
  );
};

export const CannedAndRejectionSave = (obj) => {
  return HttpClient().post(
    apiRoutes.Compendium.saveCannedAndRejectionRecords,
    obj
  );
};

export const deleteCannedAndRejectionRecords = (id) => {
  const path = `${apiRoutes.Compendium.deleteCannedAndRejectionRecords}${id}`;
  return HttpClient().get(path);
};

export const SaveSpecimenType = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.SaveSpecimenTypeRecord, obj);
};
export const GetSpecimenType = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.GetSpecimenTypeRecords, obj);
};
export const ChangeSpecimenType = (id) => {
  const path = `${apiRoutes.Compendium.ChangeSpecimenTypeRecord}${id}`;
  return HttpClient().get(path);
};
export const TubeTypeGetAll = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.BloodLISGetTubeType, obj);
};
export const TubeTypeSaveData = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.BloodLisSaveTubeType, obj);
};

export const StorageTypeGetAll = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.BloodLisGetStorageType, obj);
};
export const StorageTypeSaveData = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.BloodLisSaveStorageType, obj);
};
