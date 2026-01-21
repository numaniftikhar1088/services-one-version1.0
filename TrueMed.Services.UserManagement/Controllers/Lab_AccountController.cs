using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Models.Identity;
using TrueMed.UserManagement.Business.Services.Identity;
using TrueMed.UserManagement.Business.Services.Implementations;
using TrueMed.UserManagement.Business.Services.Interfaces;
using TrueMed.UserManagement.Domain.Models.Account.Request;
using TrueMed.UserManagement.Domain.Models.Account.Response;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;
using TrueMed.UserManagement.Domain.Models.QueryModels.Request;
using TrueMed.UserManagement.Domain.Models.QueryModels.Request.Base;
using TrueMed.UserManagement.Domain.Repositories.Identity.Interface;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.UserManagement.Controllers
{
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/Account")]
    [ApiController]
    public partial class Lab_AccountController : ControllerBase
    {
        private readonly IConnectionManager _connectionManager;
        private readonly TrueMed.Business.Interface.IUserManagement _userManagement;
        private readonly ILabRoleManagement _roleManagement;
        private readonly ILabMenuManagement _labMenuManagement;
        private readonly ILookupManager _lookupManager;
        private readonly ILab_MenuManagement _menuManagement;
        private readonly TrueMed.UserManagement.Business.Services.Interfaces.IUserManagement _userManagementService;
        private readonly APIResponseViewModel _aPIResponseViewModel;

        public Lab_AccountController(
            IConnectionManager connectionManager,
            TrueMed.Business.Interface.IUserManagement userManagement,
            ILabRoleManagement roleManagement,
            ILabMenuManagement labMenuManagement,
            ILookupManager lookupManager,
            ILab_MenuManagement menuManagement,
            TrueMed.UserManagement.Business.Services.Interfaces.IUserManagement userManagementService
            )
        {
            this._connectionManager = connectionManager;
            this._userManagement = userManagement;
            this._roleManagement = roleManagement;
            _labMenuManagement = labMenuManagement;
            _aPIResponseViewModel = new APIResponseViewModel();
            _userManagementService = userManagementService;
            _lookupManager = lookupManager;
            _menuManagement = menuManagement;
        }


        [HttpPost]
        [Route("User/Register")]
        //[ClaimsAuthorize(ClaimTypes.Actor, "User Management")]
        public async Task<IActionResult> RegisterUser(LabUserViewModel registerUserViewModel)
        {
            registerUserViewModel.Id = string.Empty;
            //**Register User With Transaction Scope**//
            var identityResult = await Membership.RegisterOrUpdateLabUserAsync(registerUserViewModel, _connectionManager);
            if (identityResult.IsSuccess)
            {
                //**Email part is independent compoment, we don't care to be successfull, user have a chocie to reset in exceptional case.**//
                try
                {
                    Membership.SendAccountActivationEmail(_connectionManager, _connectionManager.GetLabDomainUrl(), _connectionManager.PortalName, identityResult.User);
                }
                catch { }
            }
            return _aPIResponseViewModel.Create(Request, identityResult.Status == Status.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest, null, identityResult.Message, identityResult.Errors);
        }

        [HttpPost]
        [Route("User/Update")]
        public async Task<IActionResult> UpdateUser(UpdateLabUserViewModel updateUserViewModel)
        {
            //**Update User With Transaction Scope**//
            var identityResult = await Membership.RegisterOrUpdateLabUserAsync(updateUserViewModel, _connectionManager);
            return _aPIResponseViewModel.Create(Request, identityResult.IsSuccess ? HttpStatusCode.OK : HttpStatusCode.BadRequest, null, identityResult.Message, identityResult.Errors);
        }

        [HttpPost]
        [Route("User/Admin/Register")]
        //[ClaimsAuthorize(ClaimTypes.Actor, "User Management")]
        public async Task<IActionResult> RegisterAdminUser(LabAdminUserViewModel registerUserViewModel)
        {
            //**Register User With Transaction Scope**//
            var identityResult = await Membership.RegisterOrUpdateLabUserAsync(new LabUserViewModel
            {
                ActivationType = AccountActivationType.Email,
                FirstName = registerUserViewModel.FirstName,
                LastName = registerUserViewModel.LastName,
                Email = registerUserViewModel.AdminEmail,
                RoleId = registerUserViewModel.UserGroupId,
                RoleType = Roles.Admin,
                SubRoleType = registerUserViewModel.AdminType,
                AdminType = registerUserViewModel.AdminType.ToString()
            }, _connectionManager);
            return _aPIResponseViewModel.Create(identityResult);
        }

        [HttpPut]
        [Route("User/Admin/Update")]
        //[ClaimsAuthorize(ClaimTypes.Actor, "User Management")]
        public async Task<IActionResult> UpdateAdminUser(UpdateLabAdminUserViewModel registerUserViewModel)
        {
            //**Register User With Transaction Scope**//
            var identityResult = await Membership.RegisterOrUpdateLabUserAsync(new UpdateLabUserViewModel
            {
                Id = registerUserViewModel.Id,
                ActivationType = AccountActivationType.Email,
                FirstName = registerUserViewModel.FirstName,
                LastName = registerUserViewModel.LastName,
                Email = registerUserViewModel.AdminEmail,
                RoleId = registerUserViewModel.UserGroupId,
                RoleType = Roles.Admin,
                SubRoleType = registerUserViewModel.AdminType,
                AdminType = registerUserViewModel.AdminType.ToString()
            }, _connectionManager);
            if (identityResult.IsSuccess)
            {
                //**Email part is independent compoment, we don't care to be successfull, user have a chocie to reset in exceptional case.**//
                try
                {
                    Membership.SendAccountActivationEmail(_connectionManager, _connectionManager.GetLabDomainUrl(), _connectionManager.PortalName, identityResult.User);
                }
                catch { }
            }
            return _aPIResponseViewModel.Create(identityResult);
        }

        [HttpPost]
        [Route("Users")]
        public IActionResult GetUsers(DataQueryViewModel<UserQueryViewModel> queryModel)
        {
            var users = DataTables.GetAllUsers(_connectionManager.GetLabId(), queryModel, _connectionManager, User.GetUserId());
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, users);
        }

        [HttpGet]
        [Route("UserInfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = User.GetUserId();
            UserInfoViewModel userInfoViewModel = new UserInfoViewModel();
            userInfoViewModel.User = _userManagement.GetUserBriefInfoById(userId);
            userInfoViewModel.RoleAndClaims = new RoleAndClaimsViewModel
            {
                Role = await _roleManagement.GetRoleByUserIdAsync(userId),
                Claims = await _roleManagement.GetClaimsNamesByUserIdAsync(userId)
            };
            //userInfoViewModel.PageAccess = await _menuManagement.GetPageWithClaimAsync(userId, (int)_connectionManager.GetLabId());
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, userInfoViewModel);
        }

        [HttpPost("User/{userId}/Activation")]
        public IActionResult UserActivation(string userId, [FromBody] bool isActive)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, _userManagement.ActivationUserById(userId, isActive));
        }

        [HttpPost("Users/BulkActivation")]
        public IActionResult BulkUserActivation(BulkUserActivation bulkUserActivation)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, _userManagement.BulkUsersActivation(bulkUserActivation));
        }

        [HttpGet("User/Menus")]
        public async Task<IActionResult> GetUserMenus()
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await MenuManager.GetMenusAsync(_connectionManager));
        }
        [HttpGet("User/GetMenus")]
        public IActionResult MenusByUserIdForLabSide()
        {
            var result = _menuManagement.MenusByUserIdForLabSide();
            return Ok(result);
        }
        [HttpPost("AddFavouriteMenus")]
        public async Task<RequestResponse> AddUserFavouriteMenu(AddUserFavouriteIconVM addUserFavouriteIcon)
        {
            return await _labMenuManagement.AddUserFavouriteMenuAsync(addUserFavouriteIcon);
        }
        [HttpPost("RemoveFavouriteMenus")]
        public async Task<RequestResponse> RemoveFavouriteMenus(RemoveUserFavouriteIconVM removeUserFavouriteIcon)
        {
            return await _labMenuManagement.RemoveUserFavouriteMenuAsync(removeUserFavouriteIcon);
        }
        [HttpPost("GetAllUser")]
        public IActionResult GetAllUser(DataQueryRequest<UserRequestQueryModel> dataQuery)
        {
            var result = _userManagementService.GetAllUser(dataQuery);
            return Ok(result);
        }
        [HttpPost("GetAllFacilityUser")]
        public IActionResult GetAllFacilityUser(DataQueryRequest<FacilityUserRequestQueryModel> dataQuery)
        {
            var result = _userManagementService.GetAllFacilityUser(dataQuery);
            return Ok(result);
        }
        [HttpGet("GetFacilityUserAganistUserId/{id}")]
        public IActionResult GetFacilityUserAganistUserId(string id)
        {
            var result = _userManagementService.GetFacilityUserAganistUserId(id);
            return Ok(result);
        }
        [HttpPost("CreateFacilityUser")]
        public IActionResult CreateFacilityUser(FacilityUserCreateRequest request)
        {
            var result = _userManagementService.CreateFacilityUser(request);
            return Ok(result);
        }
        [HttpPost("CreateFacilityProvider")]
        public IActionResult CreateFacilityProvider(AddProviderRequest request)
        {
            var result = _userManagementService.CreateFacilityProvider(request);
            return Ok(result);
        }
        [HttpGet("GetUserFavouriteMenu")]
        public async Task<IActionResult> GetUserFavouriteMenu()
        {
            var result = await _labMenuManagement.GetUserFavouriteMenuAsync();
            return Ok(result);
        }
        [HttpPost("FacilityUserStatusChange")]
        public IActionResult FacilityUserStatusChange([FromQuery] string userId, [FromQuery] bool status)
        {
            var result = _userManagementService.FacilityUserStatusChange(userId, status);
            return Ok(result);
        }
        [HttpPost("UserStatusChange")]
        public IActionResult UserStatusChange([FromQuery] string userId, [FromQuery] bool status)
        {
            var result = _userManagementService.UserStatusChange(userId, status);
            return Ok(result);
        }
        [HttpPost("RemoveFacilityUser")]
        public IActionResult RemoveFacilityUser([FromQuery] string Id)
        {
            var result = _userManagementService.RemoveFacilityUser(Id);
            return Ok(result);
        }
        [HttpPost("UserRemove")]
        public IActionResult UserRemove([FromQuery] string Id)
        {
            var result = _userManagementService.UserRemove(Id);
            return Ok(result);
        }




        #region Lookups Section Start
        [HttpGet("OptionsLookup")]
        public async Task<IActionResult> OptionsLookup([FromQuery] string? userType)
        {
            var result = await _lookupManager.OptionsLookup(userType);
            return Ok(result);
        }
        [HttpGet("Lab_SideRoles_Lookup")]
        public async Task<IActionResult> Lab_SideRoles_Lookup()
        {
            var result = await _lookupManager.Lab_SideRoles_Lookup();
            return Ok(result);
        }
        #endregion Lookups Section End

    }
}
