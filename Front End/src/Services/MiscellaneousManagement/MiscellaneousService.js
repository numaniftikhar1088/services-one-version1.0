import apiRoutes from "../../Routes/Routes.json";
import HttpClient from "HttpClient";

const GetAllNotification = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.MiscellaneousManagement.GetAllNotification}`,
    obj
  );
};

const SaveNotification = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.MiscellaneousManagement.SaveNotification}`,
    obj
  );
};

const StatusChangedNotification = (obj) => {
  return HttpClient().post(
    `/${apiRoutes.MiscellaneousManagement.ChangeStatus}`,
    obj
  );
};
const getAllUserLookup = (userType) => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.getAllUserLookup}/${userType}/Lookup`
  );
};

const getAllUserLookupPublicUrl = (
  userType,
  portalKey,
  userId
) => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.getAllUserLookup}/${userType}/Lookup`,
    {
      headers: {
        "X-Portal-Key": portalKey,
        UserId: userId,
      },
    }
  );
};

const getAllUserLookupV2 = (userType) => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.getAllUserLookup}/${userType}/LookupV2`
  );
};

const getUserRoleTypeLookup = (notificationTypeId) => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.getRoleTypeLookup}?notificationTypeId=${notificationTypeId}`
  );
};

const getNotificationTypeLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.GetNotificationTypeLookup}`
  );
};

// DynamicSingleGrid
const singleGridTabsConfiguration = (tableId) => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.singleGridTabsConfiguration}/${tableId}/SingleUI`
  );
};

const getTablesSingleGrid = () => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.getTablesSingleUi}`
  );
};

const getSingleUiDynamicGrid = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.MiscellaneousManagement.getSingleUiDynamicGrid}`,
    payload
  );
};

const saveSingleUiColumn = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.MiscellaneousManagement.saveSingleUiColumn}`,
    payload
  );
};

// DynamicSplitPaneView
const getMainFilterSplitPane = () => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.getMainFilterSplitPane}`
  );
};

const getTabsForSplitPane = () => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.getTabsForSplitPane}`
  );
};

const saveColumnsSplitPane = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.MiscellaneousManagement.saveColumnSplitPane}`,
    payload
  );
};

const dynamicGridSplitPane = (payload) => {
  return HttpClient().post(
    `/${apiRoutes.MiscellaneousManagement.dynamicGridSplitPane}`,
    payload
  );
};

//DynamicGrid
const dynamicGridTabs = () => {
  return HttpClient().get(
    `/${apiRoutes.MiscellaneousManagement.dynamicGridTabs}`
  );
};

const MiscellaneousService = {
  dynamicGridTabs,
  getAllUserLookup,
  SaveNotification,
  getAllUserLookupV2,
  GetAllNotification,
  saveSingleUiColumn,
  getTabsForSplitPane,
  getTablesSingleGrid,
  saveColumnsSplitPane,
  dynamicGridSplitPane,
  getUserRoleTypeLookup,
  getSingleUiDynamicGrid,
  getMainFilterSplitPane,
  getAllUserLookupPublicUrl,
  getNotificationTypeLookup,
  StatusChangedNotification,
  singleGridTabsConfiguration,
};

export default MiscellaneousService;
