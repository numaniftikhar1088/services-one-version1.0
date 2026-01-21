import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

export const MicroBioCompendiumGetAllData = (obj) => {
  return HttpClient().post(
    apiRoutes.MicroBiologyCompendium.CompendiumPanelSetupGetAll,
    obj
  );
};
export const getCompendiumTestListsLookup = (obj) => {
  return HttpClient().post(
    apiRoutes.MicroBiologyCompendium.CategotyExpandTestListLookup,
    obj
  );
};

export const getCategoryTagsFilterLookup = (labId) => {
  return HttpClient().get(
    `${apiRoutes.MicroBiologyCompendium.CategoryExpandTagsLookup}/${labId}`
  );
};

export const MicroBioTestSetupGetAllData = (obj) => {
  return HttpClient().post(
    apiRoutes.MicroBiologyCompendium.CompendiumTestSetupGetAll,
    obj
  );
};

export const MicroBioTestSetupDeleteData = (id) => {
  const path = `${apiRoutes.MicroBiologyCompendium.CompendiumTestSetupDelete}${id}`;
  return HttpClient().delete(path);
};

export const MicroBioTestSetupPostData = (obj) => {
  return HttpClient().post(
    apiRoutes.MicroBiologyCompendium.CompendiumTestSetupPostData,
    obj
  );
};

export const MicroBioPanelSetupSaveData = (obj) => {
  return HttpClient().post(
    apiRoutes.MicroBiologyCompendium.CompendiumPanelSetupSaveData,
    obj
  );
};
export const MicroBioPanelSetuExpandpSaveData = (obj) => {
  return HttpClient().post(
    apiRoutes.MicroBiologyCompendium.CompendiumPanelSetupExpandSaveData,
    obj
  );
};
export const MicroBioPanelSetupDeleteData = (id) => {
  const path = `${apiRoutes.MicroBiologyCompendium.CompendiumPanelSetupDeleteData}${id}`;
  return HttpClient().delete(path);
};

