using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.Business.Services.LaboratoryModel;
using TrueMed.Business.Services.UserManagement;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Helpers.MailClient;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Models.Identity;
using TrueMed.UserManagement.Business.Services.Identity;
using TrueMed.UserManagement.Business.Services.Implementations;
using TrueMed.UserManagement.Domain.Models.Account.Request;
using TrueMed_Project_One_Service.Helpers;
using TrueMed.Domain.Models.Response;
namespace TrueMed_Project_One_Service.Controllers
{
    [Authorize]
    [HandleException]
    [ApiController]
    [ActionFilterCustom(Order = int.MinValue)]
    [Route("api/Account")]
    public class AccountController : ControllerBase
    {
        private readonly IUserManagement _userManager;
        private readonly ILabRoleManagement _roleManager;
        private readonly IOptions<MailSettings> _mailSettings;
        private readonly ILaboratoryManagement _laboratoryManagement;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        APIResponseViewModel _aPIResponseViewModel;
        private IUserManagement _userManagement;
        private readonly IConnectionManager _connectionManager;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IServiceProvider _serviceProvider;
        private readonly IEmailManager _emailManager;
        private readonly ITokenHelper _tokenHelper;
        public JwtHandler JwtHandler { get; }

        public AccountController(IConnectionManager connectionManager,
            IWebHostEnvironment hostEnvironment, IServiceProvider serviceProvider,
            JwtHandler jwtKeyHandler, IUserManagement userManager,
            ILabRoleManagement roleManager, IOptions<MailSettings> mailSettings,
            ILaboratoryManagement laboratoryManagement,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            IUserManagement userManagement,
            IEmailManager emailManager,
            ITokenHelper tokenHelper
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            this._mailSettings = mailSettings;
            this._laboratoryManagement = laboratoryManagement;
            this._configuration = configuration;
            this._httpContextAccessor = httpContextAccessor;
            _userManagement = userManagement;
            //_menuManager = new MenuManager(connectionManager);
            _aPIResponseViewModel = new APIResponseViewModel();
            //_laboratoryManager = new TrueMed.Domain.Repositories.Lab.Implementation.LaboratoryManager(connectionManager);
            _connectionManager = connectionManager;
            _hostEnvironment = hostEnvironment;
            this._serviceProvider = serviceProvider;
            JwtHandler = jwtKeyHandler;
            _emailManager = emailManager;
            _tokenHelper = tokenHelper;
        }








        [HttpPost]
        [AllowAnonymous]
        [Route("/Token")]
        public async Task<IActionResult> Token(JwtHandler.UserValidationViewModel user)
        {
            if (user == null || string.IsNullOrWhiteSpace(user.UserName) || string.IsNullOrWhiteSpace(user.Password))
                return Unauthorized("please provide username & password.");

            var userIdentity = await JwtHandler.GenerateToken(_userManager, user); 
            if (userIdentity != null)
            {
                return Ok(userIdentity);
            }
            return Unauthorized();
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("v1/Token")]
        public async Task<IActionResult> TokenV1(JwtHandler.UserValidationViewModel user)
        {
            if (user == null || string.IsNullOrWhiteSpace(user.UserName) || string.IsNullOrWhiteSpace(user.Password))
                return Unauthorized("please provide username & password.");

            var userIdentity = await _tokenHelper.GenerateToken(_userManager, user);
            if (userIdentity != null)
            {

                return Ok(userIdentity);
            }
            return Unauthorized();
        }
        [HttpPost]
        [Route("SelectedLab/Token")]
        public async Task<IActionResult> SelectedTenantToken(int labId)
        {
            if (labId== 0)
                return Unauthorized("please select Lab");

            var userIdentity = await _tokenHelper.SelectedTenantToken(_userManager,labId);
            if (userIdentity != null)
            {

                return Ok(userIdentity);
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("User/getMenu")]
        public async Task<IActionResult> GetUserMenu()
        {
           

            var userIdentity = await _tokenHelper.GetMenuForUser(_userManager);
            if (userIdentity != null)
            {

                return Ok(userIdentity);
            }
            return Unauthorized();
        }


        [HttpPost("SaveEncodedText")]
        public async Task<RequestResponse<object>> SaveEncodedText(EncodedTextRequest encodedTextRequest)
        {
            return _userManagement.SaveEncodedText(encodedTextRequest);
        }
        [AllowAnonymous]
        [HttpGet("GetEncodedText")]
        public async Task<ActionResult<RequestResponse<EncodedTextResponse>>> GetEncodedText([FromQuery] string key)
        {
            return _userManagement.GetEncodedText(key);
        }







        [HttpPost("{labId}/MakeDefault")]
        public IActionResult MakeUserLab_Default(int labId)
        {
            var identityResult = LaboratoryUserManager.MakeLabDefaultAgainstUserById(_connectionManager.UserId, labId, _connectionManager);
            return _aPIResponseViewModel.Create(identityResult);
        }

        //<!--(begin:: User Management Module)-->
        #region User Management Module
        //[ClaimsAuthorize(ClaimTypes.Actor, "User Management")]
        [HttpPost]
        [Route("Master/Users")]
        public IActionResult GetUsersForMasterPortal(DataQueryViewModel<UserQueryViewModel> userQueryViewModel)
        {
            var users = DataTables.GetAllUsers(null, userQueryViewModel,
                _connectionManager, User.GetUserId());
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, users);
        }

        [HttpPost]
        [Route("Users/Brief")]
        public IActionResult GetUsersBriefInfo(DataQueryViewModel<UserBrief_QueryViewModel> userQueryViewModel)
        {
            var users = DataTables.GetUsersBriefInfo(null, userQueryViewModel,
                           _userManager, User.GetUserId());
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, users);
        }

        [HttpGet]
        [Route("MyBriefInfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = User.GetUserId();
            var info = _userManagement.GetUserBriefInfoById(userId);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, info);
        }

        [HttpPost]
        [Route("Master/User/Register")]
        //[ClaimsAuthorize(ClaimTypes.Actor, "User Management")]
        public async Task<IActionResult> RegisterAdminUser(RegisterMasterUserViewModel registerAdminUserViewModel)
        {
            //**Register User With Transaction Scope**//
            var identityResult = Membership.RegisterMasterUser(registerAdminUserViewModel, _connectionManager);
            if (identityResult.IsSuccess)
            {
                //**Email part is independent compoment, we don't care to be successfull, user have a chocie to reset in exceptional case.**//
                try
                {
                    await _emailManager.SendEmailAsync(new List<string>() { identityResult.User.Email }, "Activation Account", $"Please Click this URL <br/><b>https://admin.truemedlims.com/InitializePassword/{identityResult.User.Id}</b>");
                }
                catch { }
            }
            return _aPIResponseViewModel.Create(Request, identityResult.Status == Status.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest, identityResult.User, identityResult.Message, identityResult.Errors);
        }

        [HttpPost]
        [Route("Master/User/Update")]
        //[ClaimsAuthorize(ClaimTypes.Actor, "User Management")]
        public IActionResult UpdateAdminUser(UpdateMasterUserViewModel registerAdminUserViewModel)
        {
            //**Register User With Transaction Scope**//
            var identityResult = Membership.UpdateMasterUser(registerAdminUserViewModel, _connectionManager);
            return _aPIResponseViewModel.Create(Request, identityResult.Status == Status.Success ? HttpStatusCode.OK : HttpStatusCode.BadRequest, identityResult, identityResult.Message, identityResult.Errors);
        }

        [HttpPost]
        [Route("User/{userId}/Reset")]
        //[ClaimsAuthorize(ClaimTypes.Actor, "User Management")]
        public IActionResult ResetAdminUser(string? userId, [FromBody] string clientDomain)
        {
            var user = _userManager.GetUserById(userId);
            if (user == null)
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.BadRequest, "user not found");

            Membership.SendAccountActivationEmail(_connectionManager, clientDomain, "Master Portal", user, true);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK,
                null, "User account reset successfully");
        }

        [HttpGet]
        [Route("UserById/{userId}")]
        public async Task<IActionResult> GetUserById(string? userId)
        {
            var user = await _userManagement.GetAllUsers(null).FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.BadRequest, "user not found");
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, user);
        }

        [HttpGet]
        [Route("UserByEmail/{email}")]
        //[ClaimsAuthorize(ClaimTypes.Actor, "User Management")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _userManagement.GetAllUsers(null).FirstOrDefaultAsync(x => x.Email.Equals(email));
            if (user == null)
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.BadRequest, "user not found");

            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, user);
        }

        [HttpDelete]
        [Route("{labKey}/User/{userId}/Delete")]
        public IActionResult DeleteUser(string userId, string labKey)
        {
            var identityResult = Membership.DeleteUserByLabKey(labKey, userId, _connectionManager);
            return _aPIResponseViewModel.Create(identityResult);
        }
        [HttpDelete]
        [Route("User/{userId}/Delete")]
        public IActionResult DeleteMasterUser(string userId)
        {
            var identityResult = Membership.DeleteUser(userId, _connectionManager);
            return _aPIResponseViewModel.Create(identityResult);
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("IsEmailAlreadySigned")]
        public IActionResult IsEmailAlreadySigned(string emailId)
        {
            return Ok(_userManager.IsEmailAlreadySigned(emailId));
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("IsUserEmailValid")]
        public IActionResult IsUserEmailValid(KeyValuePairViewModel<string?> uniqueKeyValidation)
        {
            return Ok(_userManager.IsUserEmailValid(uniqueKeyValidation));
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("IsUserNameValid")]
        public IActionResult IsUserNameValid(KeyValuePairViewModel<string?> uniqueKeyValidation)
        {
            return Ok(_userManager.IsUserNameValid(uniqueKeyValidation));
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("IsUsernameAlreadySigned")]
        public IActionResult IsUsernameAlreadySigned(string userName)
        {
            return Ok(_userManager.IsUsernameAlreadySigned(userName));
        }

        #endregion User Management ModuleMO
        ////<!--(end::User Management Module)-->

        [AllowAnonymous]
        [HttpPost]
        [Route("ValidateTicket")]
        public IActionResult ValidateTicket([FromBody] TicketValidationViewModel ticketValidationViewModel)
        {
            var ticketUser = _userManager.ValidateRequestTicket(ticketValidationViewModel.Ticket.Replace(" ", "+")
                , ticketValidationViewModel.TicketType);
            return _aPIResponseViewModel.Create(Request, ticketUser != null ? HttpStatusCode.OK : HttpStatusCode.BadRequest, ticketUser, ticketUser == null ? "Invalid/Expired" : "Ticket Found.");
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("SetNewPassword")]
        public IActionResult SetNewPassword([FromBody] SetNewPasswordViewModel passwordViewModel)
        {
            var identityResult = Membership.SetNewPassword(_userManager, passwordViewModel);
            return _aPIResponseViewModel.Create(Request, identityResult.IsSuccess ? HttpStatusCode.OK : HttpStatusCode.BadRequest, null, identityResult.Message);
        }

        [HttpPost]
        [Route("User/{userId}/SetNewPassword")]
        public async Task<IActionResult> SetNewPasswordByUserId(string userId,
           [FromBody] string newPassword)
        {
            var identityResult = await
                Membership
                .SetNewPasswordByUserIdAsync(_connectionManager, new SetNewPasswordUsingUserIdViewModel
                {
                    NewPassword = newPassword,
                    UserId = userId
                });
            return _aPIResponseViewModel.Create(identityResult);
        }
        [HttpPost]
        [Route("MasterUsers")]
        public IActionResult GetUsers(DataQueryViewModel<UserQueryViewModel> queryModel)
        {
            var users = DataTables.GetAllUsers(_connectionManager.GetLabId(), queryModel, _connectionManager, User.GetUserId());
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, users);
        }
        [HttpGet("ExpressionTest")]
        [AllowAnonymous]
        public ActionResult<string[]> ExpressionTest()
        {
            return _userManagement.GetLabsForExpressionTesting();
        }

    }
}

