import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

// For Facility (get) Lookup Drop Down 
export const getFacilitiesLookup = () => {
    return HttpClient().get(apiRoutes.UserManagement.GetFacilitiesLookup)
}

// for sales (get)
export const fetchSales = () => {
    return HttpClient().get(apiRoutes.BulletinBoard.fetchSales)
}

// to post FACILITY DATA
export const savePhysician = (obj) => {
    return HttpClient().post(apiRoutes.BulletinBoard.savePhysician, obj)
}

// to post SALES DATA
export const saveSales = (obj) => {
    return HttpClient().post(apiRoutes.BulletinBoard.saveSales, obj)
}

// POST in order to get resposnse
// physicianTable API
export const physicianTable = (obj) => {
    return HttpClient().post(apiRoutes.BulletinBoard.physicianTable, obj)
}

// POST in order to get resposnse
// SalesTable API
export const SalesTableData = (obj) => {
    return HttpClient().post(apiRoutes.BulletinBoard.SalesTable, obj)
}

// delete API

export const deleteRecord = (id) => {
    // Construct the API path with the ID
    const path = `${apiRoutes.BulletinBoard.deleteRecord}${id}`;
    // Send the DELETE request
    return HttpClient().delete(path);
}

