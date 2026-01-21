import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getInsuranceAssigment = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.GetInsuranceAssigment}`,
    searchRequest
    // const response: IUserInfo = await PostAsync<IUserInfo>(`/${routes.Login}`,user);
    // searchRequest,
  );
};
const getInventoryItemAllData = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.getInventoryItem}`,
    searchRequest
  );
};
const ShippingAndScheduleAllData = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.ShippingAndScheduleAllData}`,
    searchRequest
  );
};
const ShippingAndScheduleGetAllShipment = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.ShippingAndScheduleGetAllShipment}`,
    searchRequest
  );
};
const ShippingAndScheduleGetAllShipmentTracking = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.GetAllShipmentTrackings}`,
    searchRequest
  );
};
const saveShippingDetails = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.saveShippingDetails}`,
    searchRequest
  );
};
const saveShippingSchedule = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.ShippingAndSchedule}`,
    searchRequest
  );
};
const RestoreRejectedOrders = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.restoreRejectedDetails}`,
    searchRequest
  );
};
const SaveRejectionDetail = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.saveRejectionDetail}`,
    searchRequest
  );
};
const getOrderAllData = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.getOrderAllData}`,
    searchRequest
  );
};
const ShippingandScheduleGetAll = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.getShippingAndSchedule}`,
    searchRequest
  );
};
const deleteRecordInventory = (id) => {
  const path = apiRoutes.InsuranceManagement.deleteRecordInventory;
  return HttpClient().delete(`/${path}/${id}`);
};
const CancelRecordShipment = (id) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.cancelShippment}?Id=${id}`
  );
};
const ArchivedRecordShipment = (id) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.archiveShippment}?Id=${id}`
  );
};
const ArchivedRecordPickup = (id) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.archivePickup}?Id=${id}`
  );
};
const GetFacilityBalanceById = (id) => {
  const path = apiRoutes.InsuranceManagement.getFacilityBalanceById;
  return HttpClient().get(`/${path}?id=${id}`);
};

const GetInventoryBalanceByFacilityId = (facilityId) => {
  const path = apiRoutes.InsuranceManagement.GetInventoryBalanceByFacilityId;
  return HttpClient().get(`/${path}?facilityId=${facilityId}`);
};

const GetQuantityById = (id) => {
  const path = apiRoutes.InsuranceManagement.getQuantityById;
  return HttpClient().get(`/${path}?id=${id}`);
};
const GetAccountName = (courierName) => {
  const path = apiRoutes.InsuranceManagement.getAccountNumberLookup;
  return HttpClient().get(`/${path}?courierName=${courierName}`);
};
const AllRecordsExportToExcel = (ids) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.recordsExportToExcel}`,
    ids
  );
};
const NewOrdersExportToExcel = (ids) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.newOrdersExportToExcel}`,
    ids
  );
};
const GetItemLookup = (type) => {
  const path = apiRoutes.InsuranceManagement.getItemLookup;
  return HttpClient().get(`/${path}?itemType=${type}`);
};
const GetShippingInfoById = (val) => {
  const path = apiRoutes.InsuranceManagement.getShippingInfoById;
  return HttpClient().get(`/${path}?id=${val}`);
};
const GetSupplyItemDescriptionById = (val) => {
  const path = apiRoutes.InsuranceManagement.getSupplyItemDescriptionById;
  return HttpClient().get(`/${path}?id=${val}`);
};
const SelectedRecordsExportToExcel = (ids) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.recordsExportToExcel}`,
    ids
  );
};
const AddTestingSupplies = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.addTestingSupplies}`,
    searchRequest
  );
};
const SavePickup = (schedulePickup) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.savePickup}`,
    schedulePickup
  );
};
const SaveShipment = (schedulePickup) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.saveShipment}`,
    schedulePickup
  );
};
const AddShippingInfo = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.addShippingInfo}`,
    searchRequest
  );
};
const GetStatesLookup = () => {
  return HttpClient().get(`/${apiRoutes.InsuranceManagement.getStatesLookup}`);
};
const DownloadTemplate = () => {
  return HttpClient().get(
    `/${apiRoutes.InsuranceManagement.inventoryItemsDownload}`
  );
};
const BulkItemSupplyUpload = (jsonstring) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.bulkItemSupplyUpload}`,
    jsonstring
  );
};

// const userLoginV2 =  async (user: any): Promise<IUserInfo> => {
//   const response: IUserInfo = await PostAsync<IUserInfo>(`/${routes.Login}`,user);
//   return  response;
// };
const AddInsuranceAssigment = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.AddInsuranceAssigment}`,
    searchRequest
  );
};

const ChangeStatusAssigment = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.ChangeStatusAssigment}`,
    searchRequest
  );
};
const getProvidersForDropDown = () => {
  return HttpClient().get(
    `/${apiRoutes.InsuranceManagement.getProvidersForDropDown}`
  );
};
const getInsuranceForDropDown = () => {
  return HttpClient().get(
    `/${apiRoutes.InsuranceManagement.getInsuranceForDropDown}`
  );
};
const getDataByInsuranceId = (insuranceId) => {
  let path = apiRoutes.InsuranceManagement.GetPatientInsuranceDetailByPatientId;
  path = path.replace("id", insuranceId);
  return HttpClient().get(`/${path}`);
};

const GetInsuranceProvidersDropdown = (id) => {
  let path = apiRoutes.InsuranceManagement.GetInsuranceProvidersDropdown;
  const facilityId = localStorage.getItem("facilityID");
  path = path.replace("searchId", id);

  return HttpClient().get(`/${path}&facilityId=${facilityId}`);
};

const addPatientInsurance = (insuranceData) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.AddPatientInsurance}`,
    insuranceData
  );
};
const addPatientInsuranceProvider = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.addpatientinsuranceprovider}`,
    obj
  );
};
/**
 * PreConfiguration: Schedule And Pickup
 */

const getShippingAndSchedulePreconfiguration = (insuranceData) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.getShippingAndSchedulePreconfiguration}`,
    insuranceData
  );
};

const saveShippingAndSchedulePreconfiguration = (insuranceData) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.saveShippingAndSchedulePreconfiguration}`,
    insuranceData
  );
};

const saveArchiveDays = (numberOfDays) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.saveArchiveDays}?numberOfDays=${numberOfDays}`
  );
};

const getAutoArchiveSettings = (obj) => {
  return HttpClient().post(apiRoutes.InsuranceManagement.getArchiveDays, obj);
};

/**
 * Supply Management: BulkCheckIn And BulkCheckout
 */

const getSupplyItemsDescriptionByBarCode = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.getSupplyItemsDescriptionByBarCode}`,
    payload
  );
};

const getSupplyItemsLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.InsuranceManagement.getSupplyItemsLookup}`
  );
};

const inventorySaveCheckInOut = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.saveInventoryCheckInCheckOut}`,
    payload
  );
};

const SaveLabsInInsurance = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.SaveReferenceLab}`,
    obj
  );
};

const CancelPickup = async (obj) => {
  return HttpClient().post(
    `/${apiRoutes.InsuranceManagement.cancelPickup}`,
    obj
  );
};

const InsuranceService = {
  getInsuranceAssigment,
  AddInsuranceAssigment,
  ChangeStatusAssigment,
  getDataByInsuranceId,
  getProvidersForDropDown,
  getInsuranceForDropDown,
  addPatientInsurance,
  getInventoryItemAllData,
  ShippingAndScheduleAllData,
  GetInsuranceProvidersDropdown,
  deleteRecordInventory,
  GetFacilityBalanceById,
  AllRecordsExportToExcel,
  NewOrdersExportToExcel,
  SelectedRecordsExportToExcel,
  AddTestingSupplies,
  DownloadTemplate,
  BulkItemSupplyUpload,
  getOrderAllData,
  saveShippingDetails,
  SaveRejectionDetail,
  GetItemLookup,
  GetSupplyItemDescriptionById,
  AddShippingInfo,
  GetShippingInfoById,
  RestoreRejectedOrders,
  ShippingandScheduleGetAll,
  saveShippingSchedule,
  GetQuantityById,
  ArchivedRecordPickup,
  ArchivedRecordShipment,
  CancelRecordShipment,
  SavePickup,
  GetStatesLookup,
  ShippingAndScheduleGetAllShipment,
  SaveShipment,
  ShippingAndScheduleGetAllShipmentTracking,
  GetAccountName,
  getShippingAndSchedulePreconfiguration,
  saveShippingAndSchedulePreconfiguration,
  saveArchiveDays,
  getAutoArchiveSettings,
  getSupplyItemsDescriptionByBarCode,
  getSupplyItemsLookup,
  inventorySaveCheckInOut,
  addPatientInsuranceProvider,
  SaveLabsInInsurance,
  GetInventoryBalanceByFacilityId,
  CancelPickup,
};

export default InsuranceService;
