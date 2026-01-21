using Azure.Security.KeyVault.Secrets;
using Dapper;
using Microsoft.AspNet.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Dynamic;
using System.Security.Principal;
using TrueMed.Business.Models.Identity.Request;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Models.Response;
using TrueMed.Domain.Repositories.Connection.Interface;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.UserManagement.Domain.Helpers;
using IdentityResult = TrueMed.Domain.Model.Identity.IdentityResult;
using TblLabUser = TrueMed.Sevices.MasterEntities.TblLabUser;
using TblRequestToken = TrueMed.Sevices.MasterEntities.TblRequestToken;
using TblUser = TrueMed.Sevices.MasterEntities.TblUser;
using TblUserAdditionalInfo = TrueMed.Sevices.MasterEntities.TblUserAdditionalInfo;


namespace TrueMed.Domain.Repositories.Identity.Implementation
{
    public partial class UserManagement : IUserManagement
    {
        public const string _secretKey = "7A24432646294A404E635266546A576E";
        private readonly IConnectionManager _connectionManager;
        private readonly ICacheManager _cacheManager;

        private readonly IDbConnection _masterConnection;
        private readonly IDbConnection _appConnection;
        private MasterDbContext _dbContext;
        private ApplicationDbContext _appDbContext;

        public UserManagement(IConnectionManager connectionManager, ICacheManager cacheManager)
        {
            this._connectionManager = connectionManager;
            _masterConnection = new SqlConnection(DBConString.MasterConnection);
            //_appConnection = new SqlConnection(DBConString.GetCurrentTenantConnection(_connectionManager.PortalName));

            _dbContext = connectionManager.GetService<MasterDbContext>();
            _cacheManager = cacheManager;

            var cacheResponse = _cacheManager.Get<KeyVaultSecret>("DemoApp");
            var demoConnectionString = string.Empty;
            if (cacheResponse.IsSuccess)
            {
                demoConnectionString = cacheResponse.Value?.Value;
                _appDbContext = new ApplicationDbContext(SqlServerDbContextOptionsExtensions
                .UseSqlServer(new DbContextOptionsBuilder<ApplicationDbContext>(),
                demoConnectionString).Options);
            }

        }


     


        public static PasswordHasher PasswordHasher
        {
            get
            {
                return new PasswordHasher();
            }
        }

        public DbContext DbContext => _dbContext;

        public bool AddUserInLabs(string userId, params int[] labIds)
        {
            foreach (var labId in labIds)
            {
                _dbContext.TblLabUsers.Add(new TblLabUser
                {
                    UserId = userId,
                    IsActive = true,
                    IsDefault = false,
                    LabId = labId,
                    IsDeleted = false
                });
            }
            return _dbContext.SaveChanges() > 0;

        }

        public bool SignIn(string username, string[] roles, ICollection<string> claims)
        {
            WindowsIdentity windowsIdentity = WindowsIdentity.GetCurrent();
            GenericIdentity genericIdentity = new GenericIdentity(username, windowsIdentity.AuthenticationType);
            foreach (var claim in claims)
            {
                genericIdentity.AddClaim(new System.Security.Claims.Claim(claim, claim));
            }

            Thread.CurrentPrincipal = new GenericPrincipal(genericIdentity, roles);
            return Thread.CurrentPrincipal.Identity.IsAuthenticated;
        }

        public async Task<ApplicationUser?> GetUserByNameAndPasswordAsync(string name, string password)
        {
            var user = await _dbContext.TblUsers.FirstOrDefaultAsync(x => x.Username.Equals(name.Replace(" ", "+")) || x.Email.Equals(name.Replace(" ", "+")));
            if (user == null)
                return null;
            else if (PasswordHasher.VerifyHashedPassword(user.PasswordHash, password) != Microsoft.AspNet.Identity.PasswordVerificationResult.Success)
            {
                return null;
            }
            else
                return user.InitializeUser();
        }

        public ApplicationUser GetUserByUsername(string username)
        {

            var user = _dbContext.TblUsers.FirstOrDefault(x => x.Username == username);
            if (user == null)
                return null;
            return user.InitializeUser();

        }

        public ApplicationUser GetUserByEmail(string email)
        {
            var user = _dbContext.TblUsers.FirstOrDefault(x => x.Email == email);
            if (user == null)
                return null;
            return user.InitializeUser();

        }

        public ApplicationUser GetUserById(string userId)
        {
            var user = _dbContext.TblUsers.FirstOrDefault(x => x.Id == userId);
            if (user == null)
                return null;
            return user.InitializeUser();

        }

        public string GetUserIdByEmail(string email)
        {
            var user = _dbContext.TblUsers.Where(w=> w.IsDeleted.Equals(false)).Select(x => new { x.Id, x.Email }).FirstOrDefault(x => x.Email == email);
            if (user != null)
                return user.Id;
            else
                return string.Empty;
        }

        public string GetUserIdByUsername(string username)
        {
            var user = _dbContext.TblUsers.Select(x => new { x.Id, x.Username }).FirstOrDefault(x => x.Username == username);
            if (user != null)
                return user.Id;
            else
                return string.Empty;

        }

        public IdentityResult RegisterUser(ApplicationUser user, string? password)
        {
            var identityResult = new IdentityResult(Status.Failed, $"One or more validation errors.");

            if (string.IsNullOrWhiteSpace(user.Email) && string.IsNullOrWhiteSpace(user.Username))
            {
                identityResult.AddError(nameof(user.Email), Validator.Required);
            }

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                var isExists = this.IsEmailAlreadySigned(user.Email);
                if (isExists)
                    identityResult.AddError(nameof(user.Email), Validator.AlreadyFound);
            }
            if (!string.IsNullOrWhiteSpace(user.Username))
            {
                var isExist = this.IsUsernameAlreadySigned(user.Username);
                if (isExist)
                    identityResult.AddError(nameof(user.Username), Validator.AlreadyFound);
            }

            if (identityResult.HasErrors)
                return identityResult;

            var userModel = new TblUser()
            {
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Username = user.Username,
                Email = user.Email,
                CreateDate = DateTime.UtcNow,
                PhoneNumber = user.Phone,
                MobileNumber = user.Mobile,
                Id = user.Id,
                UserType = (int)user.UserType,
                ProfileImage = user.ProfileImageUrl,
                DateOfBirth = user.DateOfBirth,
                PasswordHash = string.IsNullOrWhiteSpace(password) ? "" : PasswordHasher.HashPassword(password),
                AdminType = user.AdminType,
                UserAccountType = user.UserAccountType,
                IsActive = user.isActive == null ? true : user.isActive
            };

            if (user.Address != null)
            {
                userModel.Address1 = user.Address.Address1;
                userModel.Address2 = user.Address.Address2;
                userModel.City = user.Address.City;
                userModel.ZipCode = user.Address.ZipCode;
                userModel.State = user.Address.State;
            }
            //var userId = userModel.Id;
            //var labId = _connectionManager.GetLabId(_connectionManager.PortalName);

            //var tblLabUser = new TblLabUser()
            //{
            //    LabId = Convert.ToInt32(labId),
            //    UserId = userId,
            //    IsActive = true,
            //    IsDefault = true,
            //    IsDeleted = false
            //};

            //_dbContext.TblLabUsers.Add(tblLabUser);
            _dbContext.TblUsers.Add(userModel);
            var isAffected = _dbContext.SaveChanges();
            if (isAffected > 0)
            {
                identityResult.UpdateIdentifier(userModel.Id);
                identityResult.MakeSuccessed("User registered successfully");
            }

            return identityResult;
        }

        public UserType? GetUserTypeById(string userId)
        {
            return _dbContext.TblUsers.Where(x => x.Id == userId)
                 .Select(x => (UserType)x.UserType)
                 .FirstOrDefault();
        }

        public IdentityResult UpdateUser(ApplicationUser user, string? password)
        {
            var existsUser = _dbContext.TblUsers.FirstOrDefault(x => x.Id == user.Id);

            if (existsUser == null)
                return new IdentityResult(Status.DataNotFound,
                    "User does not exists in System", "Id");

            existsUser.FirstName = user.FirstName;
            existsUser.MiddleName = user.MiddleName;
            existsUser.LastName = user.LastName;
            existsUser.UpdatedDate = DateTimeNow.Get;
            existsUser.PhoneNumber = user.Phone;
            existsUser.MobileNumber = user.Mobile;
            existsUser.UserType = (int)user.UserType;
            existsUser.Email = user.Email;
            //existsUser.Username = user.Username;
            existsUser.DateOfBirth = user.DateOfBirth;
            existsUser.AdminType = user.AdminType;

            if (!string.IsNullOrEmpty(existsUser.ProfileImage))
            {
                existsUser.ProfileImage = user.ProfileImageUrl;
            }

            if (user.Address != null)
            {
                existsUser.Address1 = user.Address.Address1;
                existsUser.Address2 = user.Address.Address2;
                existsUser.City = user.Address.City;
                existsUser.ZipCode = user.Address.ZipCode;
                existsUser.State = user.Address.State;
            }
            //existsUser.PasswordHash = string.IsNullOrWhiteSpace(password) ? "" : PasswordHasher.HashPassword(password);
            var ack = _dbContext.SaveChanges();
            if (ack > 0)
            {
                var existingLabs = _dbContext.TblLabUsers.Where(f => f.UserId == user.Id).ToList();
                if (existingLabs != null && existingLabs.Count > 0)
                    _dbContext.TblLabUsers.RemoveRange(existingLabs);

                foreach (var LabId in user.LabIds)
                {
                    var isLabExist = _dbContext.TblLabs.Any(a => a.LabId == LabId);
                    if (isLabExist)
                    {
                        var labUser = new TblLabUser()
                        {
                            LabId = LabId,
                            IsActive = true,
                            IsDefault = false,
                            UserId = user.Id,
                            IsDeleted = false
                        };
                        _dbContext.TblLabUsers.Add(labUser);
                    }
                    else
                    { return new IdentityResult(Status.DataNotFound, "Lab is not exist..."); }
                    _dbContext.SaveChanges();
                }
            }
            return new IdentityResult(Status.Success, "");
        }

        public IQueryable<Models.Identity.Response.UserReponseViewModel> GetAllUsers(int? labId, params string[] exceptUserIds)
        {

            var users = (from user in _dbContext.TblUsers
                         join additionInfo in _dbContext.TblUserAdditionalInfos
                         on user.Id equals additionInfo.UserId
                         into r1
                         from UserAndAdditionalInfo in r1.DefaultIfEmpty()
                         select new { pri = user, refer = UserAndAdditionalInfo })
                         .Select(x =>
                 new Models.Identity.Response.UserReponseViewModel
                 {
                     Id = x.pri.Id,
                     CreateDate = x.pri.CreateDate,
                     Email = x.pri.Email,
                     FirstName = x.pri.FirstName,
                     LastName = x.pri.LastName,
                     MiddleName = x.pri.MiddleName,
                     IsActive = x.pri.IsActive ?? true,
                     UserType = (UserType)x.pri.UserType,
                     UserName = x.pri.Username,
                     Mobile = x.pri.MobileNumber,
                     Phone = x.pri.PhoneNumber,
                     ProfileImage = x.pri.ProfileImage,
                     Gender = x.pri.Gender,
                     IsDirector = x.pri.IsDirector,
                     DateOfBirth = x.pri.DateOfBirth,
                     TwoFactorAuth = false,
                     AddressView = new AddressViewModel()
                     {
                         Address1 = x.pri.Address1,
                         Address2 = x.pri.Address2,
                         City = x.pri.City,
                         State = x.pri.State,
                         ZipCode = x.pri.ZipCode
                     },
                     AdditionalInfo = new Models.Identity.Response.UserReponseViewModel.UserAdditionalInfo
                     {
                         IsReferenceLab = x.refer.IsReferenceLabUser,
                         NPI = x.refer.Npi,
                         ReferenceLabName = x.refer.ReferenceLabName,
                         StateLicenseNumber = x.refer.StateLicenseNo
                     },
                     LabIds = _dbContext.TblLabUsers.Where(f => f.UserId == x.pri.Id).Select(s => s.LabId).ToArray()
                 });
            if (exceptUserIds != null && exceptUserIds.Length > 0)
            {
                users = users.Where(x => !exceptUserIds.Contains(x.Id));
            }

            if (labId != null)
            {

                users = users.Where(y => _dbContext.TblLabUsers.Any(x => x.LabId == labId && x.UserId == y.Id));
            }



            return users;
        }

        public IdentityResult UpdateUserAdditionalInfo(UserAdditionalInfo user)
        {
            var isUserExists = this.IsUserExistsById(user.Id);
            if (!isUserExists)
                return new IdentityResult(Status.DataNotFound, "User does not exists in System", "Email");


            var userAdditionalInfoObj = _dbContext.TblUserAdditionalInfos.FirstOrDefault(x => x.UserId == user.Id);
            if (userAdditionalInfoObj == null)
            {
                userAdditionalInfoObj = new TblUserAdditionalInfo();
                userAdditionalInfoObj.UserId = user.Id;
                _dbContext.TblUserAdditionalInfos.Add(userAdditionalInfoObj);
            }

            userAdditionalInfoObj.IsReferenceLabUser = user.IsReferenceLabUser;
            userAdditionalInfoObj.ReferenceLabName = user.ReferenceLabName;
            userAdditionalInfoObj.Npi = user.NPI;
            userAdditionalInfoObj.StateLicenseNo = user.StateLicenseNo;

            _dbContext.SaveChanges();

            var identityResult = new IdentityResult(Status.Success, "Success");
            identityResult.UpdateIdentifier(userAdditionalInfoObj.UserId);
            return identityResult;

        }

        public bool Validate(string username, string password)
        {
            var sqlUsernameParam = new SqlParameter("@Username", username);
            var sqlPasswordParam = new SqlParameter("@PasswordHash", PasswordHasher.HashPassword(password));
            using (SqlConnection connection = new SqlConnection(_dbContext.Database.GetConnectionString()))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand("EXEC sp_ValidateUser", connection))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.Add(sqlUsernameParam);
                    command.Parameters.Add(sqlPasswordParam);
                    var userExists = (int)command.ExecuteScalar();
                    return userExists > 0;
                }
            }

        }

        public IdentityResult SetNewPassword(ApplicationUser user, string password, SecurityQuestions? securityQuestions = null)
        {
            var userIdentity = _dbContext.TblUsers.FirstOrDefault(x => x.Id == user.Id);
            if (userIdentity == null)
                return new IdentityResult(Status.DataNotFound, "User does not exists in System", "Email");

            if (securityQuestions != null)
            {
                userIdentity.SecurityQuestion1 = securityQuestions.QuestionNo1;
                userIdentity.SecurityQuestion2 = securityQuestions.QuestionNo2;
                userIdentity.SecurityAnswer1 = securityQuestions.AnswerNo1;
                userIdentity.SecurityAnswer2 = securityQuestions.AnswerNo2;
            }

            userIdentity.PasswordHash = PasswordHasher.HashPassword(password);
            var isAffected = _dbContext.SaveChanges() > 0;
            return new IdentityResult(isAffected ? Model.Identity.Status.Success : Status.Failed, isAffected ? "Password Successfully Added" : "Something went wrong", "Email");

        }

        public ApplicationUser? ValidateRequestTicket(string ticket, TicketType ticketType)
        {
            ticket = Encryption.DecryptString(_secretKey, ticket);
            var ticketToken = _dbContext.TblRequestTokens.OrderBy(x => x.Type).FirstOrDefault(x => x.Token == ticket && x.Type == (int)ticketType && x.IsValid == true);
            if (ticketToken != null)
            {
                if (ticketToken.ExpireyDate != null)
                {
                    if (ticketToken.ExpireyDate >= DateTime.UtcNow)
                    {
                        return GetUserById(ticketToken.UserId);
                    }
                    else
                    {
                        //expired not valid
                        return null;
                    }
                }
                else
                {
                    //valid because not expired date given
                    return GetUserById(ticketToken.UserId);
                }
            }
            else
            {
                //not found
                return null;
            }

        }

        public string GenerateRequestTicket(string userId, TicketType ticketType, TimeSpan? timeSpan)
        {
            var plainTicketText = StringGenerator.Random(100) + Guid.NewGuid().ToString().Replace("-", "wq109");
            var token = Encryption.EncryptString(_secretKey, plainTicketText);
            var tokenRequest = new TblRequestToken()
            {
                CreateDate = DateTime.UtcNow,
                Token = plainTicketText,
                UserId = userId,
                Type = (int)ticketType,
                IsValid = true
            };
            if (timeSpan != null)
            {
                tokenRequest.ExpireyDate = DateTime.UtcNow.Add(timeSpan.Value);
            }
            _dbContext.TblRequestTokens.Add(tokenRequest);
            _dbContext.SaveChanges();
            return token;

        }

        public bool RemoveRequestTicket(string ticket, string userId)
        {

            var token = Encryption.DecryptString(_secretKey, ticket);
            var tokenTicket = _dbContext.TblRequestTokens.FirstOrDefault(x => x.Token == token && x.UserId == userId);
            if (tokenTicket != null)
            {
                tokenTicket.IsValid = false;
            }
            return _dbContext.SaveChanges() > 0;

        }

        public UserAdditionalInfo GetUserAdditionalInfoById(string userId)
        {
            var user = _dbContext.TblUserAdditionalInfos.FirstOrDefault(x => x.UserId == userId);
            if (user == null)
                return null;
            UserAdditionalInfo userAdditionalInfo = new UserAdditionalInfo
            {
                IsReferenceLabUser = user.IsReferenceLabUser ?? false,
                ReferenceLabName = user.ReferenceLabName,
                NPI = user.Npi,
                StateLicenseNo = user.StateLicenseNo,
                Id = user.UserId
            };
            return userAdditionalInfo;

        }

        public bool IsUserEmailValid(KeyValuePairViewModel<string?> uniqueKeyValidation)
        {
            if (GetUserIdByEmail(uniqueKeyValidation.KeyValue).Equals((string)uniqueKeyValidation.Id, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
            else
            {
                return !IsEmailAlreadySigned(uniqueKeyValidation.KeyValue);
            }
        }

        public bool IsUserExistsById(string id)
        {
            return _dbContext.TblUsers.Any(x => x.Id == id);
        }

        public bool DeleteUserById(string userId, int labId)
        {
            return _dbContext.Database.ExecuteSqlRaw("EXEC SP_DELETE_USER_BY_ID @UserId  = {0}, @LabId = {1}", userId, labId) == 1;
        }
        public IdentityResult DeleteUser(string id)
        {
            var response = new RequestResponse();

            if (id == "")
            {
                return new IdentityResult(Status.Failed, "Request Faild !");
                //response.Message = "Request Failed !";
                //response.StatusCode = (System.Net.HttpStatusCode)Status.Failed;
                //return response;

            }
            var getRecordForSoftDelete = _dbContext.TblUsers.Find(id);
            if (getRecordForSoftDelete != null)
            {
                //getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                //getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _dbContext.Update(getRecordForSoftDelete);
                response.Message = "Record Deleted...";
            }
            else
            {
                //response.Error = $"Record is not exist against ID : {id} in our system...";
                return new IdentityResult(Status.Failed, "Request Faild !");
                //response.StatusCode = (System.Net.HttpStatusCode)Status.Failed;
                //response.Message = "Request Failed !";
                //return response;
            }
            var status = Status.Failed;
            var ack = _dbContext.SaveChanges();
            if (ack > 0)
            {
                status = Status.Success;

            }
            return new IdentityResult(status, response.Message);
        }
        public void Dispose()
        {
            _dbContext.Dispose();
        }

        public void InitDbContext(DbContext dbContext)
        {
            _dbContext = (MasterDbContext)dbContext;
        }

        public bool IsUserNameValid(KeyValuePairViewModel<string?> uniqueKeyValidation)
        {
            if (GetUserIdByUsername(uniqueKeyValidation.KeyValue).Equals((string)uniqueKeyValidation.Id, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
            else
            {
                return !IsUsernameAlreadySigned(uniqueKeyValidation.KeyValue);
            }
        }

        public bool IsEmailAlreadySigned(string email)
        {
            return _dbContext.TblUsers.Any(x => x.Email.ToLower() == email.ToLower());
        }

        public bool IsUsernameAlreadySigned(string userName)
        {
            return _dbContext.TblUsers.Any(x => x.Username.ToLower() == userName.ToLower());
        }

        public ApplicationUserBase GetUserBriefInfoById(string userId)
        {
            return GetUserById(userId);
        }

        public bool ActivationUserById(string userId, bool isActive)
        {
            return _dbContext.Database.ExecuteSqlRaw("EXEC SP_ActivationUserById @UserId  = {0}, @IsActive = {1}", userId, isActive) == 1;
        }

        public bool BulkUsersActivation(BulkUserActivation bulkUserActivationModel)
        {
            foreach (var userId in bulkUserActivationModel.UserIds)
            {
                ActivationUserById(userId, bulkUserActivationModel.IsActive ?? false);
            }
            return true;
        }

        public async Task<bool> SetNewPasswordByUserIdAsync(string userId, string newPassword)
        {
            return await _dbContext.TblUsers.Where(x => x.Id == userId)
                .ExecuteUpdateAsync(x => x
                .SetProperty(_ => _.PasswordHash, PasswordHasher.HashPassword(newPassword))
                .SetProperty(_ => _.UpdatedBy, _connectionManager.UserId)
                .SetProperty(_ => _.UpdatedDate, DateTimeNow.Get)) > 0;
        }

        public List<ModuleWithClaims> GetClaimsByUserId(string userId)
        {
            var response = new List<ModuleWithClaims>();

            // Get All Claim Ids 
            var claimsIds = _dbContext.TblClaims.Select(s => s.Id).ToList();

            // User Check Facility OR Admin User
            var userInfo = _dbContext.TblUsers.FirstOrDefault(f => f.Id == userId);
            var userType = userInfo.AdminType != null ? int.Parse(userInfo.AdminType) : 0;
            var user = (_dbContext.TblOptionLookups.FirstOrDefault(f => f.Id == userType))?.UserType.Trim().ToUpper();
            //if (user == "FACILITY")===================
            //{
                // Get Claims Only User Based
                var getClaimIdsByUser = _appDbContext.TblUserClaims.Where(f => f.UserId == userId && f.IsChecked == true).Select(s => s.ClaimId).ToList();

                // Filtered User Claims in All Claim List 
                claimsIds = claimsIds.Where(f => getClaimIdsByUser.Contains(f)).ToList();
            //}============================================
            // Get Page Ids By Claim Ids
            var pageIds = _masterConnection.Query<PageClaims>("SELECT * FROM [dbo].[tblPageClaims]").Where(f => claimsIds.Contains(f.ClaimId)).Select(s => s.PageId).ToList();

            // Get Module Ids By Page Id
            var moduleIds = _masterConnection.Query<ModulePage>("SELECT * FROM [dbo].[tblModulePages]").Where(f => pageIds.Contains(f.PageId)).Select(s => s.ModuleId).ToList();

            // Get Modules By ModuleIds
            var modules = _dbContext.TblModules.Where(f => moduleIds.Contains(f.Id)).OrderBy(o => o.OrderId).ToList();

            var moduleWithClaimList = new List<ModuleWithClaims>();
            foreach (var module in modules)
            {
                var moduleWithClaimObj = new ModuleWithClaims();
                moduleWithClaimObj.ModuleId = module.Id;
                moduleWithClaimObj.Module = module.Name;
                moduleWithClaimObj.ModuleIcon = module.Icon;
                // Get PageIds By Module Id
                var getpageIds = _masterConnection.Query<ModulePage>($"SELECT * FROM [dbo].[tblModulePages] WHERE ModuleId = {module.Id}").Select(s => s.PageId).ToList();

                foreach (var getpageId in getpageIds)
                {
                    var claimObj = new Menu();
                    if (pageIds.Contains(getpageId))
                    {
                        var page = _dbContext.TblPages.FirstOrDefault(f => f.Id == getpageId);
                        if (page != null)
                        {
                            claimObj.Id = page.Id;
                            claimObj.Name = page.Name;
                            claimObj.ICon = page.MenuIcon;
                            claimObj.ChildId = page.ChildId;
                            claimObj.LinkUrl = page.LinkUrl;
                            claimObj.OrderBy = page.OrderId;

                            if (claimObj.ChildId != null)
                            {
                                var childPage = _dbContext.TblPages.FirstOrDefault(f => f.Id == claimObj.ChildId);
                                if (childPage != null)
                                {
                                    var subClaimObj = new SubMenu();
                                    subClaimObj.Id = childPage.Id;
                                    subClaimObj.OrderBy = childPage.OrderId;
                                    subClaimObj.LinkUrl = childPage.LinkUrl;
                                    subClaimObj.ICon = childPage.MenuIcon;
                                    subClaimObj.Name = childPage.Name;

                                    claimObj.SubClaims.Add(subClaimObj);
                                }
                                moduleWithClaimObj.Claims.Add(claimObj);
                            }
                            else
                            {
                                if (!moduleWithClaimObj.Claims.SelectMany(s => s.SubClaims).Any(a => a.Id == claimObj.Id))
                                    moduleWithClaimObj.Claims.Add(claimObj);
                            }
                        }
                    }
                }
                moduleWithClaimList.Add(moduleWithClaimObj);

            }
            response = moduleWithClaimList;
            return response;
        }
        public LoggedInUserInformation GetLoggedInUserInfo(string userId)
        {
            var LoggedInUserInfoObj = new LoggedInUserInformation();

            // Get User Information
            var userInfo = _dbContext.TblUsers.FirstOrDefault(f => f.Id == userId);

            // Check UserType Facility OR Admin
            int adminType = userInfo.AdminType != null ? int.Parse(userInfo.AdminType) : 0;
            string userType = _dbContext.TblOptionLookups.FirstOrDefault(f => f.Id == adminType)?.UserType.Trim().ToUpper();

            var facilityIds = new List<int>();
            var facilityInfoObj = new FacilityInformation();

            LoggedInUserInfoObj.AdminType = userType;
            LoggedInUserInfoObj.UserType = Enum.GetName<UserType>((UserType)userInfo.UserType);
            Console.WriteLine($"AdminType : {LoggedInUserInfoObj.AdminType} And UserType : {LoggedInUserInfoObj.UserType}");

            switch (userType)
            {
                case "FACILITY":
                    facilityIds = _appDbContext.TblFacilityUsers.Where(f => f.UserId == userInfo.Id).Select(s => s.FacilityId).ToList();
                    var query = _appDbContext.TblFacilityUsers.Where(f => f.UserId == userInfo.Id).Select(s => s.FacilityId).ToQueryString() ?? "";
                    var f = string.Join(",", facilityIds).ToString();
                    Console.WriteLine($"Facilities Ids : {f}");
                    Console.WriteLine($"Query : {query}");
                    if (facilityIds.Count == 1)
                        facilityInfoObj.DirectGoToFacility = true;
                    foreach (var facilityId in facilityIds)
                    {

                        facilityInfoObj = new FacilityInformation();
                        // Get Facility Information By Facility Id
                        var facility = _appDbContext.TblFacilities.FirstOrDefault(f => f.FacilityId == facilityId);
                        //var facility = _appConnection.QueryFirstOrDefault<TrueMed.Sevices.AppEntities.TblFacility>($"SELECT * FROM TBLFACILITY WHERE FacilityId = '{facilityId}'");
                        //Console.WriteLine($"FId : {facility.FacilityId}");
                        if (facility != null)
                        {
                            facilityInfoObj.FacilityId = facility.FacilityId;
                            facilityInfoObj.FacilityName = facility.FacilityName;
                            LoggedInUserInfoObj.Facilities.Add(facilityInfoObj);
                        }

                        facilityInfoObj.FacilityClaims = GetClaimsByUserId(userInfo.Id);
                    }
                    break;

                default:
                    LoggedInUserInfoObj.Claims = GetClaimsByUserId(userInfo.Id);
                    break;
            }
            return LoggedInUserInfoObj;
        }
        public string[] GetFacilityUserIds(int facilityId)
        {
            var userIds = _appDbContext.TblFacilityUsers.Where(f => f.FacilityId == facilityId).Select(s => s.UserId).ToArray();
            return userIds;
        }
        public string[] GetLabsForExpressionTesting()
        {
            var labs = _dbContext.TblLabs.Select(s => s.LaboratoryName).ToArray();
            return labs;
        }
      
      
    }
}
