import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

// Get All SalesRepRequest Records--
export const salesRepRequestTable = (obj) => {
    return HttpClient().post(apiRoutes.Marketing.getAllSalesRepRequest, obj)
}
// Get All SalesRepRequest Records--
export const statusChangeSalesRequest = (obj) => {
    return HttpClient().post(apiRoutes.Marketing.changeStatusSalesRepRequest, obj)
}

export const getSalesUserAgainstId = async (id) => {
    let path = apiRoutes.Marketing.getSalesUserAgainstId;
    path = path.replace("salesUserId", id);
    return HttpClient().post(`/${path}`);
};
