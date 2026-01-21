import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getAllPanelGroups = (queryModel) => {
    return HttpClient().post(
      `/${apiRoutes.Compendium.getPanelGroups}`,queryModel
    );
  };
const changePanelGroupStatus = (object)=>{
  let path = apiRoutes.Compendium.changePanelGroupStatus;
  path = path.replace("id", object?.id);
  return HttpClient().patch(`/${path}`, object.status);
}


const updatePanelGroup = (object)=>{
  return HttpClient().put(`/${apiRoutes.Compendium.updatePanelGroup}`, object);
}

  const savePanelGroup = (object) => {
    return HttpClient().post(`/${apiRoutes.Compendium.savePanelGroup}`, object);
  };
  const PanelGroups = {
    changePanelGroupStatus,
    getAllPanelGroups,
    savePanelGroup,
    updatePanelGroup
  };
  
  export default PanelGroups;