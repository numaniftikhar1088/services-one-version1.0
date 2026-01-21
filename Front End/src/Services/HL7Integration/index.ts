import HttpClient from "HttpClient";
import apiRoutes from "../../Routes/Routes.json";

export const getCredentials = (masterIntegrationId: number) => {
  const url = `${apiRoutes.HL7Integration.getCredentials}?masterIntegrationId=${masterIntegrationId}`;
  return HttpClient().get(url);
};

export const postCredentials = (integrationConfigurationAssignmentId: number, payload: any) => {
  const url = `${apiRoutes.HL7Integration.postCredentials}?integrationConfigurationAssignmentId=${integrationConfigurationAssignmentId}`;
  return HttpClient().post(url, payload);
};

// -------- Compendium Data --------
export const getCompendiumData = (masterIntegrationId: number) => {
  const url = `${apiRoutes.HL7Integration.getCompendiumData}?masterIntegrationId=${masterIntegrationId}`;
  return HttpClient().get(url);
};

// -------- Facilities --------
export const postFacilities = (payload: any) => {
  return HttpClient().post(apiRoutes.HL7Integration.postFacilities, payload);
};

export const putFacilities = (facilityId: number, payload: any) => {
  const url = `${apiRoutes.HL7Integration.putFacilities}/${facilityId}`;
  return HttpClient().put(url, payload);
};

export const deleteFacility = (facilityId: number) => {
  const url = `${apiRoutes.HL7Integration.deleteFacility}/${facilityId}`;
  return HttpClient().delete(url);
};

export const facilityLookup = () => {
  return HttpClient().get(apiRoutes.HL7Integration.facilityLookup);
};

// -------- Insurance Types + Names --------
export const getInsuranceTypes = () => {
  return HttpClient().get(apiRoutes.HL7Integration.getInsuranceTypes);
};

export const getInsuranceNames = (insuranceType: string) => {
  const url = `${apiRoutes.HL7Integration.getInsuranceNames}?insuranceType=${insuranceType}`;
  return HttpClient().get(url);
};

// -------- Insurance CRUD --------
export const postInsurance = (payload: any) => {
  return HttpClient().post(apiRoutes.HL7Integration.postInsurance, payload);
};

export const putInsurance = (insuranceId: number, payload: any) => {
  const url = `${apiRoutes.HL7Integration.putInsurance}/${insuranceId}`;
  return HttpClient().put(url, payload);
};

export const deleteInsurance = (insuranceId: number) => {
  const url = `${apiRoutes.HL7Integration.deleteInsurance}/${insuranceId}`;
  return HttpClient().delete(url);
};

export const getIntegrationConfiguration = (masterIntegrationId: number) => {
  const url = `${apiRoutes.HL7Integration.getIntegrationConfiguration}?masterIntegrationId=${masterIntegrationId}`;
  return HttpClient().get(url);
};

export const getIntegrationHeaders = () => {
  const url = `${apiRoutes.HL7Integration.getIntegrationHeaders}`;
  return HttpClient().get(url);
};
export const getComparisonDBFields = () => {
  const url = `${apiRoutes.HL7Integration.getComparisonDBFields}`;
  return HttpClient().get(url);
};
export const getLabControlOperators = () => {
  const url = `${apiRoutes.HL7Integration.getLabControlConfiguration}`;
  return HttpClient().get(url); 
};

export const getEngineHeaderDetails = (masterIntegrationId:number,messageFormatId:number) => {
  //TODOD need to remove this static messageFormate
  const url = `${apiRoutes.HL7Integration.getEngineHeaderDetails}?masterIntegrationId=${masterIntegrationId}&messageFormatId=${messageFormatId}`;
  return HttpClient().get(url);
};

export const getMasterEngineHeaderDetails = (masterIntegrationId:number,messageFormatId:number) => {
  const url = `${apiRoutes.HL7Integration.getMasterEngineHeaderDetails}?masterIntegrationId=${masterIntegrationId}&messageFormatId=${messageFormatId}`;
  return HttpClient().get(url);
};

export const saveEngineHeaderDetails = (payload: any) => {
  //TODOD need to remove this static messageFormate
  const url = `${apiRoutes.HL7Integration.saveEngineHeaderDetails}`;
  return HttpClient().post(url, payload);
};
