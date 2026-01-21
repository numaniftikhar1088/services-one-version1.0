import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

export const getFacilitiesLookup = () => {
    return HttpClient().get(apiRoutes.UserManagement.GetFacilitiesLookup)
}

export const TrainingAidsSaveData = (obj) => {
    return HttpClient().post(apiRoutes.Marketing.FacilitySalesrepSave, obj)
}

export const TrainingAidsGetAll = (obj) => {
    return HttpClient().post(apiRoutes.Marketing.GetAllTrainingAids, obj)
}

export const TrainingAidsCategory = () => {
    return HttpClient().get(apiRoutes.Marketing.TrainingAidsCategory)
}
export const SAlesRepLookupApi = () => {
    return HttpClient().get(apiRoutes.Marketing.salesRepLookup)
}

export const TrainingAidsDelete = (id) => {
    const path = `${apiRoutes.Marketing.DeleteTrainingAidApi}${id}`;
    return HttpClient().delete(path);
}
export const postFilePAth = (obj) => {
    return HttpClient().post(apiRoutes.FacilityManagement.BlobUpload, obj)
  }