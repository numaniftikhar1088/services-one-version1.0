import HttpClient from "HttpClient";
import apiRoutes from "../../Routes/Routes.json";

interface FilterOptions {
  startDate: string;
  endDate: string;
}

export interface PayloadI {
  pageNumber: number;
  pageSize: number;
  sortColumn: string;
  sortOrder: string;
  filterData: {
    facilityName: string;
    state: string;
  };
}

export const getDashboardDataWithFilter = (payload: FilterOptions) => {
  return HttpClient().post(
    apiRoutes.Dashboard.getDashboardDataWithFilter,
    payload
  );
};

export const getDashboardBarGraphData = (payload: "current" | "last") => {
  return HttpClient().get(
    `${apiRoutes.Dashboard.barGraphData}/${payload}/BarGraphData`
  );
};

export const getFacilityDataForDashboard = (payload: PayloadI) => {
  return HttpClient().post(
    `${apiRoutes.Dashboard.getDashboardFacilityData}`,
    payload
  );
};

export const getDashboardFacilityDataToExcel = (referenceLabId: number) => {
  const endpoint = `${apiRoutes.Dashboard.dashboardFacilityDataToExcel}/${referenceLabId}`;
  
  return HttpClient().get(endpoint);
};
