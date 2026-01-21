import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getAllPanelSetup = (queryModel) => {
  return HttpClient().post(`/${apiRoutes.Compendium.getAllPanelSetup}`, queryModel);
};

const requisitionLookUpDropDown = () => {
  return HttpClient().get(`/${apiRoutes.Compendium.requisitionLookUpDropDown}`);
};
const departmentLookUpDropDown = () => {
    return HttpClient().get(`/${apiRoutes.Compendium.departmentLookUpDropDown}`);
  };
const changeStatusPanelSetupCompandium = (object)=>{
  let path = apiRoutes.Compendium.changeStatusPanelSetupCompandium;
  path = path.replace("id", object?.id);
  return HttpClient().patch(`/${path}`, object.status);
}

const savePanelSetupCompandium = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.savePanelSetupCompandium}`, object);
};
  
  
  const PanelSetupData = {
    getAllPanelSetup,
    savePanelSetupCompandium,
    requisitionLookUpDropDown,
    changeStatusPanelSetupCompandium,
    departmentLookUpDropDown

    
  };
  
  export default PanelSetupData;