import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getPanelSetup = (queryModel) => {
  return HttpClient().post(`/${apiRoutes.Compendium.getPanelSetup}`, queryModel);
};

const requisitionLookUpDropDown = () => {
  return HttpClient().get(`/${apiRoutes.Compendium.requisitionLookUpDropDown}`);
};

const changePanelSetupStatus = (object)=>{
  let path = apiRoutes.Compendium.changePanelStatus;
  path = path.replace("id", object?.id);
  return HttpClient().patch(`/${path}`, object.status);
}

const updatePanelSetup = (object)=>{
  return HttpClient().put(`/${apiRoutes.Compendium.updatePanelSetup}`, object);
}

const savePanelSetup = (object) => {
  return HttpClient().post(`/${apiRoutes.Compendium.savePanelSetup}`, object);
};
  
  
  const PanelSetupData = {
    getPanelSetup,
    savePanelSetup,
    updatePanelSetup,
    requisitionLookUpDropDown,
    changePanelSetupStatus
  };
  
  export default PanelSetupData;
