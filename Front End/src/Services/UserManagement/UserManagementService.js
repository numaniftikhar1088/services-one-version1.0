import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const fetchFacilities = (request) => {
  return HttpClient().post(
    `/${apiRoutes.FacilityManagement.GetFacilities}`,
    request
  );
};
const fetchReferenceLabs = (searchRequest) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.GetReferenceLabs}`,
    searchRequest
  );
};
const createUser = (addUserRequest) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.CreateUser}`,
    addUserRequest
  );
};
const updateUser = (updateUserRequest) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.UpdateUser}`,
    updateUserRequest
  );
};
const fetchUserByEmail = (email) => {
  return HttpClient().get(`/${apiRoutes.UserManagement.UserByEmail}/${email}`);
};
const fetchUserById = (userId) => {
  return HttpClient().get(`/${apiRoutes.UserManagement.UserById}/${userId}`);
};

const fetchUserByIdV2 = (userId) => {
  return HttpClient().get(`/${apiRoutes.UserManagement.UserById2}/${userId}`);
};

const isValidEmail = (emailRequest) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.IsUserEmailValid}`,
    emailRequest
  );
};
const isValidUsername = (usrnameRequest) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.IsUserNameValid}`,
    usrnameRequest
  );
};
const makeDefaultLab = (labId) => {
  let path = apiRoutes.UserManagement.MakeDefault;
  path = path.replace("labId", labId);
  return HttpClient().post(`/${path}`);
};
const getUsers = (queryModel) => {
  return HttpClient().post(`/${apiRoutes.UserManagement.UserList}`, queryModel);
};
const getMenus = () => {
  return HttpClient().get(`/${apiRoutes.UserManagement.Menus}`);
};
const updateUserStatus = (user) => {
  let path = apiRoutes.UserManagement.ChangeUserStatus;
  path = path.replace("userId", user.id);
  return HttpClient().post(`/${path}`, !user.isActive);
};

const updateUserStatusInBulk = (usersData) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.BulkActivation}`,
    usersData
  );
};

const getAllUserRolesAndPermissions = (ptype) => {
  // return HttpClient().get(
  //   `/${apiRoutes.UserManagement.getAllUserRolesAndPermissions}`,
  // )
  let path = apiRoutes.UserManagement.getAllUserRolesAndPermissions;
  // debugger;
  path = path.replace("ptype", ptype);
  // path = path.replace('userid', userId)

  return HttpClient().get(`/${path}`);
};
const getByIdAllUserRolesAndPermissions = async (id) => {
  let path = apiRoutes.UserManagement.getByIdAllUserRolesAndPermissions;
  path = path.replace("rollid", id);
  return await HttpClient().get(`/${path}`);
};
const getByIdAdminUser = async (id) => {
  let path = apiRoutes.UserManagement.getByIdAdminUser;

  path = path.replace("adminuserid", id);
  return await HttpClient().get(`/${path}`);
};
const saveUserRoles = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.saveUserRoles}`,
    queryModel
  );
};
const updateUserRoles = (obj) => {
  return HttpClient().put(`/${apiRoutes.UserManagement.updateUserRoles}`, obj);
};
const getAllUserRoles = (search, sort) => {
  let path = apiRoutes.UserManagement.getAllUserRoles;
  path = path.replace("search", search);
  path = path.replace("sorting", sort);
  return HttpClient().get(`/${path}`);
};
const getAddUserRoles = () => {
  return HttpClient().get(`/${apiRoutes.UserManagement.getAddUserRoles}`);
};

/////system field apis

const GetSystemFields = async (id) => {
  let path = apiRoutes.UserManagement.GetSystemFields;
  path = path.replace("id", id);
  return await HttpClient().get(`/${path}`);
};

const getAllFacilityUsers = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.getAllFacilityUsers}`,
    queryModel
  );
};

const getAllFacilityUsersArchived = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.GetAllArchiveFacilityUser}`,
    queryModel
  );
};

export const getAllArchivedUsersList = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.GetAllDeletedUser}`,
    queryModel
  );
};

const GetFacilities = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.GetFacilities}`,
    queryModel
  );
};

const createFacilityUser = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.createFacilityUser}`,
    queryModel
  );
};

const SaveOrEditFacilityUser = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.SaveOrEditFacilityUser}`,
    queryModel
  );
};

const GetAllUser = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.GetAllUser}`,
    queryModel
  );
};
const deleteRecord = (id) => {
  let path = apiRoutes.UserManagement.deleteRecord;
  path = path.replace("abc", id);
  return HttpClient().delete(`/${path}`, {
    data: id,
  });
};

const saveUserManagment = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.saveUserManagment}`,
    queryModel
  );
};
const saveAminUserManagment = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.saveAminUserManagment}`,
    queryModel
  );
};
const updateUserManagment = (updateUserRequest) => {
  return HttpClient().put(
    `/${apiRoutes.UserManagement.updateUserManagment}`,
    updateUserRequest
  );
};

const saveAssignedFacility = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.saveassignedfacility}`,
    queryModel
  );
};
const LookUpUserGroup = () => {
  return HttpClient().get(`/${apiRoutes.UserManagement.LookUpUserGroup}`);
};
const GetAllUserRoleList = async (type) => {
  // return HttpClient().get(`/${apiRoutes.UserManagement.LookUpUserGroup}`)
  let path = apiRoutes.UserManagement.GetAllUserRoleList;
  path = path.replace("accountType", type);
  return await HttpClient().get(`/${path}`);
};

const getFacilityUserAgainstId = async (id) => {
  let path = apiRoutes.UserManagement.getFacilityUserAgainstId;
  path = path.replace("facilityuserid", id);

  return HttpClient().get(`/${path}`);
};

const getUserType = () => {
  return HttpClient().get(`/${apiRoutes.UserManagement.getUserType}`);
};
const getSalesUserType = () => {
  return HttpClient().get(`/${apiRoutes.UserManagement.getSalesUserType}`);
};
//getSalesUserType
const getAminType = () => {
  return HttpClient().get(`/${apiRoutes.UserManagement.getAminType}`);
};
const deleteRecordUser = (id) => {
  let path = apiRoutes.UserManagement.deleteRecordUser;
  path = path.replace("id", id);
  return HttpClient().post(`/${path}`);
};

const archiveRecordUser = (id) => {
  let path = apiRoutes.UserManagement.archiveRecordUser;
  path = path.replace("id", id);
  return HttpClient().post(`/${path}`);
};
const deleteRecordFacilityUser = (id) => {
  let path = apiRoutes.UserManagement.deleteRecordFacilityUser;
  path = path.replace("id", id);
  return HttpClient().post(`/${path}`);
};
const RestoreRecordFacilityUser = (id) => {
  return HttpClient().post(
    `${apiRoutes.UserManagement.RestoreRemoveFacilityUser}?Id=${id}`
  );
};
export const RestoreRecordUser = (id) => {
  return HttpClient().post(
    `${apiRoutes.UserManagement.RestoreUserRemove}?Id=${id}`
  );
};
const suspendRecord = (id) => {
  let obj = {
    userId: id,
  };
  let path = apiRoutes.UserManagement.suspendRecord;
  return HttpClient().post(`/${path}`, obj);
};
const InitializePassword = (queryModel) => {
  HttpClient().post();
  return HttpClient().post(
    `/${apiRoutes.UserManagement.InitializePassword}`,
    queryModel
  );
};
const ResetPassword = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.ResetPassword}`,
    queryModel
  );
};
const TokenForResetPassword = (userId) => {
  let path = `${apiRoutes.UserManagement.TokenForResetPassword}/${userId}/ResetPassword`;

  return HttpClient().get(`/${path}`);
};
const GetDataAgainstRoles = (RoleId) => {
  let path = apiRoutes.UserManagement.GetDataAgainstRoles;
  path = path.replace("id", RoleId);
  return HttpClient().get(`/${path}`);
};
const GetDataAgainstRolesByUserId = (userId) => {
  let path = apiRoutes.UserManagement.GetDataAgainstRolesByUserId;
  path = path.replace("userid", userId);
  // path = path.replace('userid', userId)

  return HttpClient().get(`/${path}`);
};
const AddOREditRoleClaim = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.AddOREditRoleClaim}`,
    queryModel
  );
};
// Lab_ReferenceLabManagement
const AddAdminReferenceLab = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.AddAdminReferenceLab}`,
    queryModel
  );
};
const EditGetByIdReferenceLab = (labId) => {
  let path = apiRoutes.UserManagement.EditGetByIdReferenceLab;
  path = path.replace("ID", labId);
  return HttpClient().get(`/${path}`);
};
const GetAllReferenceLab = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.GetAllReferenceLab}`,
    queryModel
  );
};
const StatusChangeReferenceLab = (labId, status) => {
  let path = apiRoutes.UserManagement.StatusChangeReferenceLab;
  path = path.replace("ID", labId);
  path = path.replace("STATUS", status);
  return HttpClient().post(`/${path}`);
};
const GetFacilitiesLookup = () => {
  return HttpClient().get(`/${apiRoutes.UserManagement.GetFacilitiesLookup}`);
};
const GetRequisitionTypeLookup = () => {
  return HttpClient().get(
    `/${apiRoutes.UserManagement.GetRequisitionTypeLookup}`
  );
};
const getLablookup = () => {
  return HttpClient().get(`/${apiRoutes.UserManagement.GetLab}`);
};
const SelectTenantLogin = (labID) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.SelectTenantLogin}`,
    labID
  );
};

/**
 * Security Questions API
 */

export const getSecurityQuestions = async () => {
  const response = await HttpClient().get(
    `${apiRoutes.UserManagement.getSecurityQuestions}`
  );

  return response;
};

export const saveSecurityQuestionsOfUser = async (payload) => {
  const response = await HttpClient().post(
    `${apiRoutes.UserManagement.saveSecurityQuestionsOfUser}`,
    payload
  );

  return response;
};

/**
 * account-settings API functions
 */

export const getUserInfo = async () => {
  const response = await HttpClient().get(`api/Account/UserInfo`);

  return response;
};

export const physicianProfileUpdate = async (payload) => {
  const response = await HttpClient().post(
    `api/Account_V2/PhysicianProfileUpdate`,
    payload
  );

  return response;
};

export const getSignatureAssigneeUser = async (userId) => {
  const response = await HttpClient().get(
    `api/Account_V2/GetSignatureAssigneeUser?userId=${userId}`
  );

  return response;
};

export const SignatureRequest = async (userId, eventType) => {
  const response = await HttpClient().post(
    `${apiRoutes.UserManagement.SendEmailForAddSignature}/${userId}/${eventType}`
  );

  return response;
};

const AddSignatureViaEmail = (payload, portalKey, userId) => {
  return HttpClient().post(
    `/${apiRoutes.UserManagement.AddSignatureViaEmail}`,
    payload,
    { headers: { "X-Portal-Key": portalKey, UserId: userId } }
  );
};

// ***** end
const UserManagementService = {
  AddSignatureViaEmail,
  fetchFacilities,
  fetchReferenceLabs,
  createUser,
  updateUser,
  fetchUserByEmail,
  fetchUserById,
  isValidEmail,
  isValidUsername,
  makeDefaultLab,
  getUsers,
  updateUserStatus,
  updateUserStatusInBulk,
  getMenus,
  getAddUserRoles,
  getAllUserRoles,
  getAllUserRolesAndPermissions,
  saveUserRoles,
  GetSystemFields,
  deleteRecord,
  updateUserRoles,
  saveUserManagment,
  updateUserManagment,
  LookUpUserGroup,
  getAllFacilityUsers,
  GetFacilities,
  createFacilityUser,
  SaveOrEditFacilityUser,
  GetAllUser,
  getFacilityUserAgainstId,
  getUserType,
  getAminType,
  deleteRecordUser,
  deleteRecordFacilityUser,
  InitializePassword,
  ResetPassword,
  TokenForResetPassword,
  GetDataAgainstRoles,
  AddOREditRoleClaim,
  GetDataAgainstRolesByUserId,
  AddAdminReferenceLab,
  EditGetByIdReferenceLab,
  GetAllReferenceLab,
  StatusChangeReferenceLab,
  GetFacilitiesLookup,
  SelectTenantLogin,
  getByIdAllUserRolesAndPermissions,
  getByIdAdminUser,
  saveAminUserManagment,
  GetAllUserRoleList,
  GetRequisitionTypeLookup,
  getLablookup,
  getSalesUserType,
  fetchUserByIdV2,
  suspendRecord,
  saveAssignedFacility,
  getAllFacilityUsersArchived,
  RestoreRecordFacilityUser,
  archiveRecordUser,
};
export default UserManagementService;
