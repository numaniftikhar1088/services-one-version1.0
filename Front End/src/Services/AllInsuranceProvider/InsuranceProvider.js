import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "../../HttpClient";

export const InsuranceProviderSave = (obj) => {
  return HttpClient().post(
    apiRoutes.InsuranceManagement.SaveInsuranceProvider,
    obj
  );
};
export const InsuranceProviderGetAll = (obj) => {
  return HttpClient().post(
    apiRoutes.InsuranceManagement.getInsuranceProvider,
    obj
  );
};

export const InsuranceProviderDelete = (id) => {
  const path = `${apiRoutes.InsuranceManagement.insuranceProviderDelete}${id}`;
  return HttpClient().delete(path);
};

export const InsuranceStatusChange = (obj) => {
  return HttpClient().post(
    apiRoutes.InsuranceManagement.insuranceStatusChange,obj
  );
};
