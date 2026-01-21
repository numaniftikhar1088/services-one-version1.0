import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

export const TrainingAidsCAtegorySave = (obj) => {
    return HttpClient().post(apiRoutes.Marketing.TrainingAidsCategorySave, obj)
}

export const TrainingAidsCategoryGetAll = (obj) => {
    return HttpClient().post(apiRoutes.Marketing.TrainingAidsCategoryGetAll, obj)
}
export const TrainingAidsCategoryDelete = (id) => {
    const path = `${apiRoutes.Marketing.TrainingAidsCategoryDelete}${id}`;
    return HttpClient().delete(path);
}