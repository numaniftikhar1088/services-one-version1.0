import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const ManageSalesRepData = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.ManageSalesRep.Manage_Sales_RepData}`,
    obj
  );
};
const SaveManageSalesRepData = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.ManageSalesRep.Save_Manage_Sales_RepData}`,
    obj
  );
};
const GetSalesInfo = (Id) => {
  let path = apiRoutes.ManageSalesRep.get_sales_rep_info;
  path = path.replace("IDD", Id);
  return HttpClient().post(`/${path}`);
};
const ArchiveUser = (Id) => {
  let path = apiRoutes.ManageSalesRep.archive_user;
  path = path.replace("IDD", Id);
  return HttpClient().post(`/${path}`);
};

const toggleStatus = (userId) => {
  let path = `${apiRoutes.ManageSalesRep.toggleSalesRepUserStatus}/${userId}`;
  return HttpClient().post(`/${path}`);
};

const saveFacilityAgainstSalesRepUser = (obj) => {
  let path = `${apiRoutes.ManageSalesRep.saveFacilityAgainstSalesRepUser}`;
  return HttpClient().post(`/${path}`, obj);
};

const ManageSalesRepServices = {
  ManageSalesRepData,
  SaveManageSalesRepData,
  GetSalesInfo,
  ArchiveUser,
  toggleStatus,
  saveFacilityAgainstSalesRepUser,
};

export default ManageSalesRepServices;
