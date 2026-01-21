import HttpClient from "HttpClient";
import apiRoutes from "../../Routes/Routes.json";

export const SavePharmDPreference = (queryModel: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.SavePharmDPreference}`,
    queryModel
  );
};

export const GetAllPharmDPreferences = (queryModel: any) => {
  return HttpClient().post(
    `/${apiRoutes.InfectiousDisease.GetAllPharmDPreferences}`,
    queryModel
  );
};

export const GetFacilityLookUpByPerformingLab = (id: number) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.GetFacilitiesLookup}/${id}/Lookup`
  );
};

export const GetPharmDSelectionLookUp = (id: number) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.GetPharmDLookup}/${id}/Lookup`
  );
};

export const GetPanelLookUp = (labId: number, facilityId: number) => {
  return HttpClient().get(
    `/${apiRoutes.InfectiousDisease.GetPanelsLookup}/${labId}/${facilityId}/Lookup`
  );
};
