using Microsoft.AspNet.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Net;
using System.Transactions;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Models.Common;
using TrueMed.Domain.Models.Facility;
using TrueMed.Domain.Models.Response;
using TrueMed.Sevices.MasterEntities;
using TrueMed.UserManagement.Domain.Enums;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;
using TrueMed.UserManagement.Domain.Models.QueryModels.Request;
using TrueMed.UserManagement.Domain.Models.QueryModels.Request.Base;
using TrueMed.UserManagement.Domain.Models.QueryModels.Response;
using TrueMed.UserManagement.Domain.Models.QueryModels.Response.Base;
using IUserManagement = TrueMed.UserManagement.Business.Services.Interfaces.IUserManagement;

namespace TrueMed.UserManagement.Business.Services.Implementations
{
    public class UserManagement : IUserManagement
    {
        private MasterDbContext _masterDbContext;
        private ApplicationDbContext _applicationDbContext;
        private readonly IConnectionManager _connectionManager;
        private readonly IEmailManager _emailManager;
        public UserManagement(MasterDbContext masterDbContext, ApplicationDbContext applicationDbContext, IEmailManager emailManager, IConnectionManager connectionManager)
        {
            _masterDbContext = masterDbContext;
            _applicationDbContext = applicationDbContext;
            _emailManager = emailManager;
            _connectionManager = connectionManager;
        }
        public static PasswordHasher PasswordHasher
        {
            get
            {
                return new PasswordHasher();
            }
        }
        #region Query
        public DataQueryResponse<List<UserResponseQueryModel>> GetAllUser(DataQueryRequest<UserRequestQueryModel> dataQuery)
        {
            var response = new DataQueryResponse<List<UserResponseQueryModel>>();

            var tblRole = _applicationDbContext.TblRoles.ToList();
            var SystemLookup = _masterDbContext.TblOptionLookups.ToList();
            var tblUserRole = _applicationDbContext.TblUserRoles.ToList();

            var labId = _connectionManager.GetLabId();
            var getUserIdsByLab = _masterDbContext.TblLabUsers.Where(f => f.LabId == Convert.ToInt32(labId)).Select(s => s.UserId).ToList();
            //var lookupIdsForCheck = SystemLookup.Where(_ => _.UserType.ToUpper().Trim() == "ADMIN").Select(s => s.Id).ToList();

            var userId = _connectionManager.UserId;
            var facilityIds = _applicationDbContext.TblFacilityUsers.Where(x => x.UserId == userId).Select(s => s.FacilityId).ToList();


            var adminTypeId = (_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == userId))?.AdminType;
            var adminType = (SystemLookup.FirstOrDefault(f => f.Id == int.Parse(adminTypeId)))?.UserType.Trim().ToUpper();

            var users = new List<string>();
            #region=================================================================================
            //if (adminType == "FACILITY")
            //{
            //    users = _applicationDbContext.TblFacilityUsers.Where(f => f.FacilityId == facilityId).Select(s => s.UserId).ToList();
            //    users = _masterDbContext.TblUsers.Where(f => users.Contains(f.Id) && getUserIdsByLab.Contains(f.Id)).Select(s => s.Id).ToList();
            //}
            //else
            //{
            //    users = _masterDbContext.TblUsers.Where(f => getUserIdsByLab.Contains(f.Id)).Select(s => s.Id).ToList();
            //}

            //var tblUser = _masterDbContext.TblUsers.Where(u => users.Contains(u.Id)).ToList();

            #endregion=================================================================================

            var adminuserIds = SystemLookup.Where(f => f.UserType.Trim().ToUpper() == "ADMIN").Select(s => s.Id).ToList();

            var tblUser = _masterDbContext.TblUsers.Where(f => adminuserIds.Contains(Convert.ToInt32(f.AdminType))).ToList();
            //var demoLabUserIds = _applicationDbContext.TblUserRoles.Select(s => s.UserId).ToList();

            var dataSource = tblUser.Select(s => new UserResponseQueryModel()
            {
                Id = s.Id,
                FirstName = s.FirstName,
                LastName = s.LastName,
                AdminEmail = s.Email,
                AdminTypeId = Convert.ToInt32(s.AdminType),
                AdminType = (Convert.ToInt32(s.AdminType) != 0 && s.AdminType != null) ? SystemLookup.FirstOrDefault(f => f.Id == Convert.ToInt32(s.AdminType)).Name : null,
                UserGroupId = tblUserRole.Where(f => f.UserId == s.Id).Select(s => s.RoleId).FirstOrDefault(),
                UserGroup = tblRole.Where(f => f.Id == tblUserRole.Where(f => f.UserId == s.Id).Select(s => s.RoleId).FirstOrDefault()).Select(s => s.Name).FirstOrDefault(),
                CreatedDate = s.CreateDate,
                Status = s.IsActive
            }).OrderByDescending(o => o.CreatedDate).ToList();
            #region Filter
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.Id))
            {
                dataSource = dataSource.Where(f => f.Id != null && f.Id == dataQuery.RequestModel?.Id).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.FirstName))
            {
                dataSource = dataSource.Where(f => f.FirstName != null && f.FirstName.ToLower().Contains(dataQuery.RequestModel?.FirstName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.LastName))
            {
                dataSource = dataSource.Where(f => f.LastName != null && f.LastName.ToLower().Contains(dataQuery.RequestModel?.LastName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.AdminEmail))
            {
                dataSource = dataSource.Where(f => f.AdminEmail != null && f.AdminEmail.ToLower().Contains(dataQuery.RequestModel?.AdminEmail.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.AdminType))
            {
                dataSource = dataSource.Where(f => f.AdminType != null && f.AdminType.ToLower().Contains(dataQuery.RequestModel?.AdminType.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.UserGroup))
            {
                dataSource = dataSource.Where(f => f.UserGroup != null && f.UserGroup.ToLower().Contains(dataQuery.RequestModel?.UserGroup.ToLower())).ToList();
            }
            if (dataQuery.RequestModel?.Status != null)
            {
                dataSource = dataSource.Where(f => f.Status.Equals(dataQuery.RequestModel?.Status)).ToList();
            }


            if (!string.IsNullOrEmpty(dataQuery.SortColumn) && dataQuery.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{dataQuery.SortColumn} {dataQuery.SortDirection}").ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"id desc").ToList();
            }


            response.Total = dataSource.Count;
            if (dataQuery.PageIndex > 0 && dataQuery.PageSize > 0)
            {
                dataSource = dataSource.Skip((dataQuery.PageIndex - 1) * dataQuery.PageSize).Take(dataQuery.PageSize).ToList();
            }
            #endregion
            response.Result = dataSource;
            return response;
        }
        public DataQueryResponse<List<FacilityUserResponseQueryModel>> GetAllFacilityUser(DataQueryRequest<FacilityUserRequestQueryModel> dataQuery)
        {
            var response = new DataQueryResponse<List<FacilityUserResponseQueryModel>>();

            var SystemLookup = _masterDbContext.TblOptionLookups.ToList();
            var lookupIdsForCheck = SystemLookup.Where(_ => _.UserType.ToUpper().Trim() == "FACILITY").Select(s => s.Id).ToList();
            var facilityUser = _applicationDbContext.TblFacilityUsers.ToList();



            var adminType = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == _connectionManager.UserId)?.AdminType;
            var userType = SystemLookup.FirstOrDefault(f => f.Id == Convert.ToInt32(adminType)).UserType;
            var user = new List<TblUser>();
            if (userType == "FACILITY")
            {
                var facility = facilityUser.Where(f => f.UserId == _connectionManager.UserId).Select(s => s.FacilityId).ToList();
                var facilityUsers = facilityUser.Where(f => facility.Contains(f.FacilityId)).Select(s => s.UserId).ToList();
                user = _masterDbContext.TblUsers.Where(f => facilityUsers.Contains(f.Id) && f.IsDeleted == false).ToList();
            }
            else
            {
                var labId = _connectionManager.GetLabId();
                var userIdsAgainstLab = _masterDbContext.TblLabUsers.Where(x => x.LabId == Convert.ToInt32(labId)).Select(s => s.UserId).ToList();

                var tblOptionLookupFacilityValues = SystemLookup.Where(_ => _.UserType.ToUpper().Trim() == "FACILITY").Select(s => s.Id).ToList();
                user = _masterDbContext.TblUsers.Where(f => userIdsAgainstLab.Contains(f.Id) && tblOptionLookupFacilityValues.Contains(Convert.ToInt32(f.AdminType))).ToList();
            }

            var userAdditional = _masterDbContext.TblUserAdditionalInfos.ToList();
            var tblUserRole = _applicationDbContext.TblUserRoles.ToList();
            var tblRoles = _applicationDbContext.TblRoles.ToList();

            var dataSource = (from U in user
                              join FU in facilityUser on U.Id equals FU.UserId
                              into UFU
                              from CD1 in UFU.DefaultIfEmpty()
                              join UAD in userAdditional on U.Id equals UAD.UserId
                              into DS1
                              from CD2 in DS1.DefaultIfEmpty()
                              select new { UserInfo = U, FacilityUserInfo = CD1, UserAdditionalInfo = CD2 }).Select(s => new FacilityUserResponseQueryModel()
                              {
                                  Id = s.UserInfo != null ? s.UserInfo.Id : null,
                                  FirstName = s.UserInfo != null ? s.UserInfo.FirstName : null,
                                  LastName = s.UserInfo != null ? s.UserInfo.LastName : null,
                                  Email = s.UserInfo != null ? s.UserInfo.Email : null,
                                  Username = s.UserInfo != null ? s.UserInfo.Username : null,
                                  AdminType = (s.UserInfo != null && s.UserInfo.AdminType != null) ? SystemLookup.FirstOrDefault(f => f.Id == Convert.ToInt32(s.UserInfo.AdminType))?.Name : null,
                                  AdminTypeId = s.UserInfo != null ? Convert.ToInt32(s.UserInfo.AdminType) : 0,
                                  NPINo = s.UserAdditionalInfo != null ? s.UserAdditionalInfo.Npi : null,
                                  CreatedDate = s.UserInfo != null ? s.UserInfo.CreateDate : null,
                                  Status = s.UserInfo != null ? s.UserInfo.IsActive : null,
                                  userGroupId = (int?)(tblUserRole.FirstOrDefault(f => f.UserId == s.UserInfo?.Id)?.RoleId),
                                  userGroup = tblRoles.FirstOrDefault(r => r.Id == tblUserRole.FirstOrDefault(f => f.UserId == s.UserInfo?.Id)?.RoleId)?.Name

                              }).DistinctBy(d => d.Id);



            #region Filter
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.FirstName))
            {
                dataSource = dataSource.Where(f => f.FirstName != null && f.FirstName.ToLower().Contains(dataQuery.RequestModel?.FirstName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.LastName))
            {
                dataSource = dataSource.Where(f => f.LastName != null && f.LastName.ToLower().Contains(dataQuery.RequestModel?.LastName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.Email))
            {
                dataSource = dataSource.Where(f => f.Email != null && f.Email.ToLower().Contains(dataQuery.RequestModel?.Email.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.AdminType))
            {
                dataSource = dataSource.Where(f => f.AdminType != null && f.AdminType.ToLower().Contains(dataQuery.RequestModel?.AdminType.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.NPINo))
            {
                dataSource = dataSource.Where(f => f.NPINo != null && f.NPINo.ToLower().Contains(dataQuery.RequestModel?.NPINo.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.Username))
            {
                dataSource = dataSource.Where(f => f.Username != null && f.Username.ToLower().Contains(dataQuery.RequestModel?.Username.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(dataQuery.RequestModel?.userGroup))
            {
                dataSource = dataSource.Where(f => f.userGroup != null && f.userGroup.ToLower().Contains(dataQuery.RequestModel?.userGroup.ToLower())).ToList();
            }
            if (dataQuery.RequestModel?.Status != null)
            {
                dataSource = dataSource.Where(f => f.Status.Equals(dataQuery.RequestModel?.Status)).ToList();
            }


            #endregion

            if (!string.IsNullOrEmpty(dataQuery.SortColumn) && dataQuery.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy(dataQuery.SortColumn + " " + dataQuery.SortDirection).ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"createdDate desc").ToList();
            }
            response.Total = dataSource.Count();
            if (dataQuery.PageIndex > 0 && dataQuery.PageSize > 0)
            {
                dataSource = dataSource.Skip((dataQuery.PageIndex - 1) * dataQuery.PageSize).Take(dataQuery.PageSize).ToList();
            }
            
            response.Result = dataSource.ToList();
            return response;
        }
        public RequestResponse<GetFacilityUserInfoAgainstUserIdResponse> GetFacilityUserAganistUserId(string id)
        {
            var resposne = new RequestResponse<GetFacilityUserInfoAgainstUserIdResponse>();

            //var userTypeEnum = typeof(GlobalUserTypeEnum);
            //var accountTypeEnum = typeof(GlobalAccountTypeEnum);

            var SystemLookup = _masterDbContext.TblOptionLookups.ToList();
            var user = _masterDbContext.TblUsers.Where(f => f.Id == id).ToList();
            var userAdditional = _masterDbContext.TblUserAdditionalInfos.Where(f => f.UserId == user.Select(s => s.Id).FirstOrDefault()).ToList();
            var tblUserRole = _applicationDbContext.TblUserRoles.ToList();
            var tblRoles = _applicationDbContext.TblRoles.ToList();

            var dataSource = (from UserInfo in user
                              join UserAdditional in userAdditional on UserInfo.Id equals UserAdditional.UserId into UserAndUserAdditional
                              from Data in UserAndUserAdditional.DefaultIfEmpty()
                              select new
                              {
                                  U = UserInfo,
                                  UA = Data
                              }).Select(s => new GetFacilityUserInfoAgainstUserIdResponse()
                              {
                                  Id = s.U != null ? s.U.Id : null,
                                  UserTypeId = s.U != null ? Convert.ToInt32(s.U.AdminType) : null,
                                  UserType = (s.U != null && s.U.AdminType != null) ? SystemLookup.FirstOrDefault(f => f.Id == Convert.ToInt32(s.U.AdminType))?.Name : null,
                                  FirstName = s.U != null ? s.U.FirstName : null,
                                  LastName = s.U != null ? s.U.LastName : null,
                                  NPINo = s.UA != null ? s.UA.Npi : null,
                                  StateLicense = s.UA != null ? s.UA.StateLicenseNo : null,
                                  AccountType = s.U != null ? s.U.UserAccountType : null,
                                  //AccountType = UserPlusUserAdditionalInfo == null ? "N/A" : Enum.GetName(accountTypeEnum, Convert.ToInt32(UserPlusUserAdditionalInfo.TblUser?.UserAccountType)),
                                  PhoneNo = s.U != null ? s.U.PhoneNumber : null,
                                  Gender = s.U != null ? s.U.Gender : null,
                                  Username = s.U != null ? s.U.Username : null,
                                  Password = s.U != null ? s.U.PasswordHash : null,
                                  Email = s.U != null ? s.U.Email : null,
                                  UserTitle = s.U != null ? s.U.UserTitle : null,
                                  userGroupId = (int?)(tblUserRole.FirstOrDefault(f => f.UserId == s.U?.Id)?.RoleId),
                                  userGroup = tblRoles.FirstOrDefault(r => r.Id == tblUserRole.FirstOrDefault(f => f.UserId == s.U?.Id)?.RoleId)?.Name,
                                  Facilities = _applicationDbContext.TblFacilities.Where(f => (_applicationDbContext.TblFacilityUsers.Where(f => f.UserId == id).Select(s => s.FacilityId)).Contains(f.FacilityId))
                                  .Select(s => new FacilityInfo() { Id = s.FacilityId, FacilityName = s.FacilityName + " - " + s.Address }).ToList()
                              }).FirstOrDefault();
            resposne.Message = "Request Processed Successfully...";
            resposne.StatusCode = HttpStatusCode.OK;
            resposne.Data = dataSource;
            return resposne;
        }
        #endregion
        #region Commands

        public RequestResponse CreateFacilityProvider(AddProviderRequest req)
        {
            var response = new RequestResponse();

            #region Email OR Username Check
            var isEmailAndUsernameNotUnique = _masterDbContext.TblUsers.Any(x => (x.Email.Trim().ToLower() == req.Email.Trim().ToLower())
                                               && x.IsDeleted.Equals(false));

            if (isEmailAndUsernameNotUnique)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Message = $"Sorry {nameof(req.Email)} : already exist...";
                return response;
            }
            #endregion
            #region Add Case


            var tblFacilityUser = new TrueMed.Domain.Models.Database_Sets.Application.TblFacilityUser();


            using (var transaction = new TransactionScope())
            {
                #region User Save Section
                var userId = Guid.NewGuid().ToString();
                var tblUser = new TrueMed.Sevices.MasterEntities.TblUser()
                {
                    Id = userId,
                    UserType = (int)UserTypeEnum.LabUser,
                    AdminType = 8.ToString(),
                    FirstName = req.FirstName,
                    LastName = req.LastName,
                    UserAccountType = 0,
                    PhoneNumber = "",
                    Gender = req.Gender,
                    UserTitle = "",
                    PasswordHash = "",
                    Username = "",
                    Email = req.Email,
                    IsActive = true

                };
                _masterDbContext.TblUsers.Add(tblUser);
                _masterDbContext.SaveChanges();
                var phyInfo = new DropDownResponseModel();
                phyInfo.Label = $"{tblUser.FirstName}|{tblUser.LastName}|{req.NPI}";
                phyInfo.Value = tblUser.Id;
                response.Data = phyInfo;
                #endregion
                #region Facilities Save Section
                tblFacilityUser.UserId = tblUser.Id;
                if (req.Facilities.Count() == 0)
                {
                    response.StatusCode = HttpStatusCode.BadRequest;
                    response.Message = "Facility Is Required !";
                    return response;
                }
                foreach (var facility in req.Facilities)
                {
                    tblFacilityUser.FacilityId = facility;
                    tblFacilityUser.CreatedTime = DateTimeNow.Get;
                    tblFacilityUser.CreatedBy = _connectionManager.UserId;
                    _applicationDbContext.TblFacilityUsers.Add(tblFacilityUser);
                    _applicationDbContext.SaveChanges();

                }

                #endregion
                #region UserAdditional Info Save Section

                var tblUserAdditionalInfo = new TrueMed.Sevices.MasterEntities.TblUserAdditionalInfo()
                {
                    UserId = tblUser.Id,
                    Npi = req.NPI,
                    StateLicenseNo = ""
                };

                _masterDbContext.TblUserAdditionalInfos.Add(tblUserAdditionalInfo);
                _masterDbContext.SaveChanges();

                #endregion
                #region User Role Save Section

                var RoleInfo = _applicationDbContext.TblRoles.AsNoTracking().FirstOrDefault(x => (x.Name ?? "").ToLower().Trim().Equals("physician"));

                if (RoleInfo != null)
                {
                    var tblUserRole = new TrueMed.Domain.Models.Database_Sets.Application.TblUserRole()
                    {
                        UserId = tblUser.Id,
                        RoleId = RoleInfo.Id,
                        SubRoleType = 1
                    };
                    _applicationDbContext.TblUserRoles.Add(tblUserRole);
                    _applicationDbContext.SaveChanges();
                }

                #endregion
                #region User Assign Lab By Default
                var labId = _connectionManager.GetLabId(_connectionManager.PortalName);
                var tblLabUser = new TblLabUser()
                {
                    LabId = Convert.ToInt32(labId),
                    UserId = tblUser.Id,
                    IsActive = true,
                    IsDefault = true,
                    IsDeleted = false
                };
                _masterDbContext.TblLabUsers.Add(tblLabUser);
                _masterDbContext.SaveChanges();
                #endregion

                try
                {


                    var email = req.Email;

                    if (_emailManager.IsValidEmail(email))
                        _emailManager.SendEmailAsync(new List<string>() { email }, "Password Creation", $"Please click to this Link : https://tmpotruemeditlabportal-dev.azurewebsites.net/Admin/InitializePassword?id={userId} for Password Initialized").GetAwaiter().GetResult();
                }
                catch (Exception ex)
                {

                }
                transaction.Complete();
                response.Message = "Record added Successfully...";
            }



            #endregion
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        public RequestResponse CreateFacilityUser(FacilityUserCreateRequest request)
        {
            var response = new RequestResponse();

            #region Email OR Username Check
            var isEmailAndUsernameNotUnique = _masterDbContext.TblUsers.Any(x => ((GlobalAccountTypeEnum)request.AccountType == GlobalAccountTypeEnum.Email ? x.Email.Trim().ToLower() == request.Email.Trim().ToLower() : x.Username.ToLower().Trim() == request.Username.Trim().ToLower())
                                               && (x.Id != request.Id) && x.IsDeleted.Equals(false));

            if (isEmailAndUsernameNotUnique)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Message = $"Sorry {((GlobalAccountTypeEnum)request.AccountType == GlobalAccountTypeEnum.Email ? nameof(request.Email) : nameof(request.Username))} : already exist...";
                return response;
            }
            #endregion
            #region Update Case
            if (!string.IsNullOrEmpty(request.Id))
            {
                #region User Edit Section
                var existingEntry = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == request.Id);
                if (existingEntry != null)
                {
                    existingEntry.Id = request.Id;
                    existingEntry.UserType = (int)UserTypeEnum.LabUser;
                    existingEntry.FirstName = request.FirstName;
                    existingEntry.LastName = request.LastName;
                    existingEntry.UserAccountType = request.AccountType;
                    existingEntry.PhoneNumber = request.PhoneNo;
                    existingEntry.Gender = request.Gender;
                    existingEntry.UserTitle = request.UserTitle;
                    existingEntry.AdminType = request.AdminTypeId.ToString();

                    if (!string.IsNullOrEmpty(request.Password))
                        PasswordHasher.HashPassword(request.Password);

                    existingEntry.Username = request.Username;
                    existingEntry.Email = request.Email;

                    _masterDbContext.TblUsers.Update(existingEntry);
                    #endregion
                    #region Facilities Edit Section
                    var exsitingUserFacility = _applicationDbContext.TblFacilityUsers.FirstOrDefault(f => f.UserId == request.Id) ?? new();

                    var deleteExistingAssignFacility = _applicationDbContext.TblFacilityUsers.Where(f => f.UserId == request.Id).ToList();
                    _applicationDbContext.TblFacilityUsers.RemoveRange(deleteExistingAssignFacility);
                    _applicationDbContext.SaveChanges();
                    if (request.Facilities.Count() > 0)
                    {
                        foreach (var facility in request.Facilities)
                        {
                            exsitingUserFacility.UserId = request.Id;
                            exsitingUserFacility.FacilityId = facility;

                            _applicationDbContext.TblFacilityUsers.Add(exsitingUserFacility);
                            _applicationDbContext.SaveChanges();
                        }
                    }
                    #endregion
                    #region User Additional Info Edit Section
                    var exsitingUserAdditionalInfo = _masterDbContext.TblUserAdditionalInfos.FirstOrDefault(f => f.UserId == request.Id);
                    if (request.AdminTypeId == 8)
                    {
                        if (exsitingUserAdditionalInfo != null)
                        {
                            exsitingUserAdditionalInfo.UserId = request.Id;
                            exsitingUserAdditionalInfo.Npi = request.NPI;
                            exsitingUserAdditionalInfo.StateLicenseNo = request.StateLicense;

                            _masterDbContext.TblUserAdditionalInfos.Update(exsitingUserAdditionalInfo);
                        }
                        else
                        {
                            exsitingUserAdditionalInfo = new();
                            exsitingUserAdditionalInfo.UserId = request.Id;
                            exsitingUserAdditionalInfo.Npi = request.NPI;
                            exsitingUserAdditionalInfo.StateLicenseNo = request.StateLicense;

                            _masterDbContext.TblUserAdditionalInfos.Add(exsitingUserAdditionalInfo);
                        }


                    }
                    else
                    {
                        //var userAdditionalInfo = _masterDbContext.TblUserAdditionalInfos.Where(f => f.UserId == request.Id).ToList();
                        string sql = $"DELETE FROM TblUserAdditionalInfo WHERE UserId = '{request.Id}'";
                        //if (userAdditionalInfo !=null)
                        //{
                        _masterDbContext.Database.ExecuteSqlRaw(sql);
                        //}
                    }
                    _masterDbContext.SaveChanges();
                    #endregion
                    #region User Role Edit Section
                    _applicationDbContext.ChangeTracker.AutoDetectChangesEnabled = false;
                    var userExistingRole = _applicationDbContext.TblUserRoles.FirstOrDefault(f => f.UserId == existingEntry.Id);
                    if (userExistingRole != null)
                    {
                        userExistingRole.UserId = existingEntry.Id;
                        userExistingRole.RoleId = request.userGroupId;
                        userExistingRole.SubRoleType = 1;
                        _applicationDbContext.TblUserRoles.Remove(userExistingRole);
                        userExistingRole = new();
                        userExistingRole.UserId = existingEntry.Id;
                        userExistingRole.RoleId = request.userGroupId;
                        userExistingRole.SubRoleType = 1;

                        _applicationDbContext.TblUserRoles.Add(userExistingRole);
                        _applicationDbContext.SaveChanges();


                    }
                    else
                    {
                        userExistingRole = new();
                        userExistingRole.UserId = existingEntry.Id;
                        userExistingRole.RoleId = request.userGroupId;
                        userExistingRole.SubRoleType = 1;

                        _applicationDbContext.TblUserRoles.Add(userExistingRole);
                        _applicationDbContext.SaveChanges();
                    }


                    #endregion
                    response.Message = "Record Updated successfully...";

                }

            }
            #endregion
            #region Add Case
            else
            {

                var tblFacilityUser = new TrueMed.Domain.Models.Database_Sets.Application.TblFacilityUser();
                if ((GlobalAccountTypeEnum)request.AccountType == GlobalAccountTypeEnum.Email)
                { request.Username = string.Empty; }
                else
                {
                    request.Email = string.Empty;
                    request.Password = request.Password;
                }

                using (var transaction = new TransactionScope())
                {
                    #region User Save Section
                    var userId = Guid.NewGuid().ToString();
                    var tblUser = new TrueMed.Sevices.MasterEntities.TblUser()
                    {
                        Id = userId,
                        UserType = (int)UserTypeEnum.LabUser,
                        AdminType = request.AdminTypeId.ToString(),
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        UserAccountType = request.AccountType,
                        PhoneNumber = request.PhoneNo,
                        Gender = request.Gender,
                        UserTitle = request.UserTitle,
                        PasswordHash = PasswordHasher.HashPassword(request.Password),
                        Username = request.Username,
                        Email = request.Email,
                        IsActive = true

                    };
                    _masterDbContext.TblUsers.Add(tblUser);
                    _masterDbContext.SaveChanges();
                    response.Data = tblUser.Id;
                    #endregion
                    #region Facilities Save Section
                    tblFacilityUser.UserId = tblUser.Id;
                    if (request.Facilities.Count() == 0)
                    {
                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.Message = "Facility Is Required !";
                        return response;
                    }
                    foreach (var facility in request.Facilities)
                    {
                        tblFacilityUser.FacilityId = facility;
                        tblFacilityUser.CreatedTime = DateTimeNow.Get;

                        _applicationDbContext.TblFacilityUsers.Add(tblFacilityUser);
                        _applicationDbContext.SaveChanges();

                    }

                    #endregion
                    #region UserAdditional Info Save Section
                    if (request.AdminTypeId == 8)
                    {
                        var tblUserAdditionalInfo = new TrueMed.Sevices.MasterEntities.TblUserAdditionalInfo()
                        {
                            UserId = tblUser.Id,
                            Npi = request.NPI,
                            StateLicenseNo = request.StateLicense
                        };

                        _masterDbContext.TblUserAdditionalInfos.Add(tblUserAdditionalInfo);
                        _masterDbContext.SaveChanges();
                    }
                    #endregion
                    #region User Role Save Section
                    var tblUserRole = new TrueMed.Domain.Models.Database_Sets.Application.TblUserRole()
                    {
                        UserId = tblUser.Id,
                        RoleId = request.userGroupId,
                        SubRoleType = 1
                    };
                    _applicationDbContext.TblUserRoles.Add(tblUserRole);
                    _applicationDbContext.SaveChanges();
                    #endregion
                    #region User Assign Lab By Default
                    var labId = _connectionManager.GetLabId(_connectionManager.PortalName);
                    var tblLabUser = new TblLabUser()
                    {
                        LabId = Convert.ToInt32(labId),
                        UserId = tblUser.Id,
                        IsActive = true,
                        IsDefault = true,
                        IsDeleted = false
                    };
                    _masterDbContext.TblLabUsers.Add(tblLabUser);
                    _masterDbContext.SaveChanges();
                    #endregion

                    if (string.IsNullOrEmpty(request.Id))
                    {
                        var email = string.IsNullOrEmpty(request.Email) ? request.Username : request.Email;

                        if (_emailManager.IsValidEmail(email))
                            _emailManager.SendEmailAsync(new List<string>() { email }, "Password Creation", $"Please click to this Link : https://tmpotruemeditlabportal-dev.azurewebsites.net/Admin/InitializePassword?id={userId} for Password Initialized").GetAwaiter().GetResult();
                    }
                    transaction.Complete();
                    response.Message = "Record added Successfully...";
                }


            }
            #endregion
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }

        public RequestResponse FacilityUserStatusChange(string userId, bool status)
        {
            var response = new RequestResponse();

            var existingUser = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == userId);
            if (existingUser == null)
            {
                response.StatusCode = HttpStatusCode.NoContent;
                response.Message = "User is not exist...";
                return response;
            }
            existingUser.IsActive = status;
            _masterDbContext.TblUsers.Update(existingUser);
            var ack = _masterDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "Status Changed...";
                response.StatusCode = HttpStatusCode.OK;
            }
            return response;
        }
        public RequestResponse UserStatusChange(string userId, bool status)
        {
            var response = new RequestResponse();

            var existingUser = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == userId);
            if (existingUser == null)
            {
                response.StatusCode = HttpStatusCode.NoContent;
                response.Message = "User is not exist...";
                return response;
            }
            existingUser.IsActive = status;
            _masterDbContext.TblUsers.Update(existingUser);
            var ack = _masterDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "Status Changed...";
                response.StatusCode = HttpStatusCode.OK;
            }
            return response;
        }

        public RequestResponse RemoveFacilityUser(string Id)
        {
            var response = new RequestResponse();

            var existingUser = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == Id);
            if (existingUser == null)
            {
                response.StatusCode = HttpStatusCode.NoContent;
                response.Message = "User is not exist...";
                return response;
            }
            existingUser.IsDeleted = true;
            _masterDbContext.TblUsers.Update(existingUser);
            var ack = _masterDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "User Deleted...";
                response.StatusCode = HttpStatusCode.OK;
            }
            return response;
        }

        public RequestResponse UserRemove(string Id)
        {
            var response = new RequestResponse();

            var existingUser = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == Id);
            if (existingUser == null)
            {
                response.StatusCode = HttpStatusCode.NoContent;
                response.Message = "User is not exist...";
                return response;
            }
            existingUser.IsDeleted = true;
            _masterDbContext.TblUsers.Update(existingUser);
            var ack = _masterDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "User Deleted...";
                response.StatusCode = HttpStatusCode.OK;
            }
            return response;
        }
        #endregion
    }
}
