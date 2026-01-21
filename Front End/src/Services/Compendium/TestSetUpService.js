import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";
///////old
const getTestSetUp = (queryModel) => {
  return HttpClient().post(`/${apiRoutes.Compendium.getTestSetup}`, queryModel);
};
const saveTestSetUp = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.saveTestSetUp}`, object);
};
const requisitionLookUpDropDown = () => {
  return HttpClient().get(`/${apiRoutes.Compendium.requisitionLookUpDropDown}`);
};
const changeTestSetUpStatus = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.Compendium.changeTestSetUpStatus}`,
    searchRequest
  );
};
//////////old/////////
///////new///////////
const getTestSetUpGridData = (queryModel) => {
  return HttpClient().post(`/${apiRoutes.Compendium.getTestSetUpGridData}`, queryModel);
};
const createTest = (queryModel) => {
  return HttpClient().post(`/${apiRoutes.Compendium.SaveTest}`, queryModel)
}
const updateRecord = (queryModel)=>{
  return HttpClient().put(`/${apiRoutes.Compendium.updateRecord}`, queryModel)
}
const deleteRecord = (id)=>{
  let path = apiRoutes.Compendium.deleteRecord;
  path = path.replace("id", id);
  return HttpClient().delete(`/${path}`);
}
///////new//////////
const TestSetUpService = {
  getTestSetUp,
  getTestSetUpGridData,
  saveTestSetUp,
  requisitionLookUpDropDown,
  changeTestSetUpStatus,
  createTest,
  updateRecord,
  deleteRecord
};

export default TestSetUpService;
