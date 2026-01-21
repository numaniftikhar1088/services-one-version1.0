import HttpClient from "../../../HttpClient";
import apiRoutes from "../../../Routes/Routes.json";

// APIS for Blood compendium Test Setup
export const getAllTestSetup = (payload) => {
  return HttpClient().post(
    apiRoutes.Compendium.getBloodCompendiumTestSetup,
    payload
  );
};

export const saveAllTestsSetup = (payload) => {
  return HttpClient().post(
    apiRoutes.Compendium.saveBloodCompendiumTestSetup,
    payload
  );
};

export const getTestMappingData = (testId) => {
  return HttpClient().post(
    `${apiRoutes.Compendium.getTestMappingData}?testId=${testId}`
  );
};

export const saveTestMappingData = (testId) => {
  return HttpClient().post(apiRoutes.Compendium.saveTestMappingData, testId);
};

export const deleteTestMappingData = (testConfigId) => {
  return HttpClient().delete(
    `${apiRoutes.Compendium.deleteTestMappingData}/${testConfigId}`
  );
};

export const saveAdditionalSetupAsync = (payload) => {
  return HttpClient().post(
    apiRoutes.Compendium.saveAdditionalSetupAsync,
    payload
  );
};
export const GetAdditionalSetupAsync = (payload) => {
  return HttpClient().post(
    apiRoutes.Compendium.GetAdditionalSetupAsync,
    payload
  );
};

/**
 * Function to get the lookup data for result instrument names (lookup # 01).
 *
 * Method: Get
 * @param {string} resultMethod - The result method (e.g., 'ResultInstrumentName' or 'OrderInstrumentName')
 * @param {number} labId - The lab ID
 *
 */
export const getResultInstrumentNameLookup = (resultMethod, labId) => {
  return HttpClient().get(`${apiRoutes.Compendium.getInstrumentNameLookup}/${resultMethod}/${labId}/Lookup`);
};

export const getTestMethodDataLookup = () => {
  return HttpClient().get(`api/BloodCompendiumTestSetup/GetResultMethodRelatedData/ResultInstrumentName/Lookup`);
};

/**
 *
 * Function to get the lookup data for result instrument names (lookup # 02).
 *
 * Method: Get
 *
 */
export const getResultInstrumentName2Lookup = () => {
  return HttpClient().get(apiRoutes.Compendium.getInstrumentNameLookup2);
};

export const getOrderInstrumentLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.getOrderInstrumentNameLookup);
};

export const getSpecimenTypeLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.getSpecimenTypeLookup);
};

export const getTubeTypeLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.getTubeTypeLookup);
};

export const getStorageTypeLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.getStorageTypeLookup);
};

export const getAutoValidateTestLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.getAutoValidateTestLookup);
};

export const GetDependencyTestsLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.GetDependencyTestsLookup);
};

export const GetCalculationFormulaLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.GetCalculationFormulaLookup);
};

export const GetGenderLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.GetGenderLookup);
};
export const GetSendOrderLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.GetSendOrderLookup);
};
export const GetPanelDisplayTypeLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.GetPanelDisplayTypeLookup);
};

export const GetResultFlagLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.GetResultFlagLookup);
};

export const GetResultOnLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.GetResultOnLookup);
};

export const GetReflexTexts = (query) => {
  return HttpClient().get(
    `${apiRoutes.Compendium.getReflexTexts}?query=${query}`
  );
};

export const getAllPanelSetup = (obj) => {
  return HttpClient().post(
    apiRoutes.Compendium.bloodCompendiumPanelSetupGetALL,
    obj
  );
};

export const savePanelSetup = (obj) => {
  return HttpClient().post(
    apiRoutes.Compendium.bloodCompendiumSavePanelSetup,
    obj
  );
};

export const SavePanelSetupExpand = (obj) => {
  return HttpClient().post(
    apiRoutes.Compendium.bloodCompendiumSavePanelSetupExpand,
    obj
  );
};

export const getPanelTypeLookup = () => {
  return HttpClient().get(apiRoutes.Compendium.bloodCompendiumPanelTypeLookup);
};

export const getTagsFilterLookup = (labId) => {
  return HttpClient().get(`${apiRoutes.Compendium.tagsFilterLookup}/${labId}`);
};

export const getTestListsLookup = (obj) => {
  return HttpClient().post(apiRoutes.Compendium.bloodCompendiumTestLists, obj);
};

export const IndividualTestsAgainstLabId = (obj) => {
  return HttpClient().post(
    apiRoutes.Compendium.IndividualTestsAgainstLabId,
    obj
  );
};
