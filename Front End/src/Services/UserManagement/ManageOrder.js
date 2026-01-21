import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

export const GetFacilityById = (id) => {
  const path = `${apiRoutes.UserManagement.GetFacilityById}${id}`;
  return HttpClient().get(path);
};
