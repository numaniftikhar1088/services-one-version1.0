using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.Services.IdentityModel;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Configurations;
using TrueMed.Domain.Models.Token;
using static TrueMed.Business.Services.IdentityModel.JwtHandler;

namespace TrueMed.Business.Services.TokenHelper
{
    public class TokenHelper: ITokenHelper
    {
        private readonly IUserManagement _userManagement;
        private readonly IConnectionManager _connectionManager;
        private readonly ILaboratoryManagement _laboratoryManagement;
        private readonly IConfiguration _configuration;
        private JWTSettings _jwtSettings { get; }
        private readonly ISecretManagement _secretManager;
        public TokenHelper(IOptionsSnapshot<JWTSettings> jwtSettings,
            IUserManagement userManagement,
            IConnectionManager connectionManager,
            ILaboratoryManagement laboratoryManagement,
            ISecretManagement secretManagement,
            IConfiguration configuration
            )
        {
                _userManagement = userManagement;
            _jwtSettings = jwtSettings.Value;
            _connectionManager = connectionManager;
            _laboratoryManagement=laboratoryManagement;
            _secretManager = secretManagement;
            _configuration = configuration;
        }

        public async Task<ClaimsIdentity?> GetUser(IUserManagement userManager, string username, string password)
        {
            var user = await userManager.GetUserByNameAndPasswordAsync(username, password);
            if (user != null)
            {
                var claims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypesCustom.USER_TYPE, Convert.ToString((int)user.UserType)),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim("IsFacilityUser",user.IsFacilityUser.ToString()),
                };
                return await Task.FromResult(new ClaimsIdentity(claims));
            }
            // Account doesn't exists
            return await Task.FromResult<ClaimsIdentity?>(null);
        }

        public async Task<object?> GenerateToken(IUserManagement userManager, UserValidationViewModel user)
        {
            string JWTKEY =_jwtSettings.Key; //"MHgCAQEEIQDSgI2jKL/AYQohSZrSPF7mW7BOU5RNWH5PSV92pLs5hKAKBggqhkjO,PQMBB6FEA0IABCD+YU0xfYKW2h3VclgDM/s8aMYtIxeos3EhuHiy2QN6TOyZB+5gjEFhD5UuuVTbRdhoKLI/b1qbEwpqV7lGlMQ=";
            string ISSUER =_jwtSettings.ISSUER; // "https://truemedit.com";
            string AUDIENCE =_jwtSettings.AUDIENCE; // "https://truemedit.com";
            var response = new TokenResponse();
            var request = _connectionManager.Request;
            var baseURL = request.Headers.Referer.ToString();

           
            var userInfo = await userManager.GetUserByNameAndPasswordAsync(user.UserName, user.Password);
            if (userInfo == null)
                return null;


            var claims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypesCustom.USER_TYPE, Convert.ToString((int)userInfo.UserType)),
                    new Claim(ClaimTypes.NameIdentifier, userInfo.Id),
                  //  new Claim(ClaimTypes.DateOfBirth,userInfo.DateOfBirth)
                   // new Claim("IsFacilityUser",userInfo.IsFacilityUser.ToString()),
                };



            var authTenantInfo = await _laboratoryManagement.GetLabBriefInfoByUserIdAsync(userInfo.Id);
      //      var getLoggedInUserInfo = _userManagement.GetLoggedInUserInfo(userInfo.Id);

            foreach (var item in authTenantInfo)
            {
                var authTenant = new AuthTenant()
                {
                    TenantId = item.Id,
                    Key = item.LabKey,
                    Name = item.LabName,
                    URL = item.LabUrl,
                    Logo = item.Logo,
                    IsDefault = item.IsDefault,
                    IsReferenceLab = item.IsReferenceLab,
                };
                   // InfomationOfLoggedUser = getLoggedInUserInfo
               
                if (!string.IsNullOrEmpty(baseURL))
                {
                    var turi = new Uri(authTenant.URL);
                    var buri = new Uri(baseURL);
                    if (Uri.Compare(buri, turi, UriComponents.StrongAuthority, UriFormat.SafeUnescaped, StringComparison.OrdinalIgnoreCase) == 0)
                        authTenant.IsSelected = true;
                }
                if (authTenantInfo.Count == 1)
                    authTenant.IsSelected = true;
                if (authTenant.IsSelected == true|| Enum.GetName<UserType>((UserType)userInfo.UserType) != UserType.Master.ToString())
                {
                    var tenantUserInfo = new TokenUserHelper(authTenant.Key, _secretManager, _configuration);
                    var userTenantInfo = await tenantUserInfo.GetUserInfoWithClaims(userInfo);
                    authTenant.InfomationOfLoggedUser = userTenantInfo.LoggedInUserInformation;
                    claims.Add(new Claim($"Lab_{authTenant.Key}_Role", userTenantInfo.Role));
                    claims.Add(new Claim(ClaimTypes.System, authTenant.Key));
                }
                response.AuthTenants.Add(authTenant);               
           

                //      var userRole= await tenantUserInfo.GetUserInfo(userId);

            }


            var issuer = JwtHandler.ISSUER;
            var audience = JwtHandler.AUDIENCE;
            var key = Encoding.ASCII.GetBytes
            (JwtHandler.KEY);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTimeNow.Get.AddDays(14),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials
                (new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha512Signature),

            };


            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            response.Token = jwtToken;
            response.UserId = userInfo.Id;
            response.UserType = (UserType)userInfo.UserType;
            response.Username = string.IsNullOrEmpty(userInfo?.Username) ? userInfo?.Email : userInfo?.Username;
            response.ExpiresIn = (int)tokenDescriptor.Expires.Value.Subtract(DateTime.UtcNow).TotalSeconds;
            response.Expires = tokenDescriptor.Expires.Value;






            return response;
        }




       public async Task<object?> SelectedTenantToken(IUserManagement userManager, int labId)
        {
            string JWTKEY = _jwtSettings.Key; //"MHgCAQEEIQDSgI2jKL/AYQohSZrSPF7mW7BOU5RNWH5PSV92pLs5hKAKBggqhkjO,PQMBB6FEA0IABCD+YU0xfYKW2h3VclgDM/s8aMYtIxeos3EhuHiy2QN6TOyZB+5gjEFhD5UuuVTbRdhoKLI/b1qbEwpqV7lGlMQ=";
            string ISSUER = _jwtSettings.ISSUER; // "https://truemedit.com";
            string AUDIENCE = _jwtSettings.AUDIENCE; // "https://truemedit.com";
            var response = new TokenResponse();
            var request = _connectionManager.Request;
            var baseURL = request.Headers.Referer.ToString();


            var userInfo =  userManager.GetUserById(_connectionManager.UserId);
            if (userInfo == null)
                return null;


            var claims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Name, userInfo.Email??userInfo.Username),
                    new Claim(ClaimTypesCustom.USER_TYPE, Convert.ToString((int)userInfo.UserType)),
                    new Claim(ClaimTypes.NameIdentifier, userInfo.Id),
                  //  new Claim(ClaimTypes.DateOfBirth,userInfo.DateOfBirth)
                   // new Claim("IsFacilityUser",userInfo.IsFacilityUser.ToString()),
                };

         //   var selected 

            var authTenantInfo = await _laboratoryManagement.GetLabBriefInfoByUserIdAsync(userInfo.Id);
            //      var getLoggedInUserInfo = _userManagement.GetLoggedInUserInfo(userInfo.Id);

            foreach (var item in authTenantInfo)
            {
                var authTenant = new AuthTenant()
                {
                    TenantId = item.Id,
                    Key = item.LabKey,
                    Name = item.LabName,
                    URL = item.LabUrl,
                    Logo = item.Logo,
                    IsDefault = item.IsDefault,
                    IsReferenceLab = item.IsReferenceLab,
                };
                // InfomationOfLoggedUser = getLoggedInUserInfo

                if (!string.IsNullOrEmpty(baseURL))
                {
                    var turi = new Uri(authTenant.URL);
                    var buri = new Uri(baseURL);
                    if (Uri.Compare(buri, turi, UriComponents.StrongAuthority, UriFormat.SafeUnescaped, StringComparison.OrdinalIgnoreCase) == 0)
                        authTenant.IsSelected = true;
                }
                if (authTenant.TenantId == labId)
                    authTenant.IsSelected = true;
                if (authTenantInfo.Count == 1)
                    authTenant.IsSelected = true;

                if (authTenant.IsSelected == true || Enum.GetName<UserType>((UserType)userInfo.UserType) != UserType.Master.ToString())
                {
                    var tenantUserInfo = new TokenUserHelper(authTenant.Key, _secretManager, _configuration);
                    var userTenantInfo = await tenantUserInfo.GetUserInfoWithClaims(userInfo);
                    authTenant.InfomationOfLoggedUser = userTenantInfo.LoggedInUserInformation;
                    claims.Add(new Claim($"Lab_{authTenant.Key}_Role", userTenantInfo.Role));
                    claims.Add(new Claim(ClaimTypes.System, authTenant.Key));
                }
                response.AuthTenants.Add(authTenant);


                //      var userRole= await tenantUserInfo.GetUserInfo(userId);

            }


            var issuer = JwtHandler.ISSUER;
            var audience = JwtHandler.AUDIENCE;
            var key = Encoding.ASCII.GetBytes
            (JwtHandler.KEY);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTimeNow.Get.AddDays(14),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials
                (new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha512Signature),

            };


            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            response.Token = jwtToken;
            response.UserId = userInfo.Id;
            response.UserType = (UserType)userInfo.UserType;
            response.Username = string.IsNullOrEmpty(userInfo?.Username) ? userInfo?.Email : userInfo?.Username;
            response.ExpiresIn = (int)tokenDescriptor.Expires.Value.Subtract(DateTime.UtcNow).TotalSeconds;
            response.Expires = tokenDescriptor.Expires.Value;






            return response;
        }

        public async Task<object?> GetMenuForUser(IUserManagement userManager)
        {
         
            var Key = _connectionManager.PortalName;
            var userInfo = userManager.GetUserById(_connectionManager.UserId);
            if (userInfo == null)
                return null;

            var tenantUserInfo = new TokenUserHelper(Key, _secretManager, _configuration);
            var userTenantInfo = await tenantUserInfo.GetUserInfoWithClaims(userInfo);


            return userTenantInfo.LoggedInUserInformation.Claims;
        }
    }
}
