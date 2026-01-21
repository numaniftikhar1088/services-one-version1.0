import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

export const MicroBioGetAllData = (obj) => {
  return HttpClient().post(
    apiRoutes.MicroBiologyLisSetting.MicroBiologyLisGetAll,
    obj
  );
};

export const MicroBioSaveData = (obj) => {
  return HttpClient().post(
    apiRoutes.MicroBiologyLisSetting.MicroBiologyLisSaveData,
    obj
  );
};

export const deleteMicroBioLisRecords = (id) => {
  const path = `${apiRoutes.MicroBiologyLisSetting.MicroBiologyLisDeleteData}${id}`;
  return HttpClient().get(path);
};
