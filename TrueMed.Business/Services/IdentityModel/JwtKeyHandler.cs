using Microsoft.EntityFrameworkCore;
using Microsoft.FeatureManagement;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using TrueMed.Business.Interface;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Token;

namespace TrueMed.Business.Services.IdentityModel
{
    public class JwtHandler
    {
        private readonly ILaboratoryManagement _laboratoryManagement;
        private readonly IUserManagement _userManagement;
        private readonly IConnectionManager _connectionManager;
        private readonly IFeatureManager _featureManager;
        public JwtHandler(ILaboratoryManagement laboratoryManagement, IUserManagement userManagement, IConnectionManager connectionManager, ILookupManager lookupManager, IFeatureManager featureManager)
        {
            _laboratoryManagement = laboratoryManagement;
            _userManagement = userManagement;
            _connectionManager = connectionManager;
            _featureManager=featureManager;
        }

        public const string KEY = "MHgCAQEEIQDSgI2jKL/AYQohSZrSPF7mW7BOU5RNWH5PSV92pLs5hKAKBggqhkjO,PQMBB6FEA0IABCD+YU0xfYKW2h3VclgDM/s8aMYtIxeos3EhuHiy2QN6TOyZB+5gjEFhD5UuuVTbRdhoKLI/b1qbEwpqV7lGlMQ=";
        public const string ISSUER = "https://truemedit.com";
        public const string AUDIENCE = "https://truemedit.com";

        public async Task<ClaimsIdentity?> GetIdentity(IUserManagement userManager, string username, string password)
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



            var request = _connectionManager.Request;
           var baseURL = request.Headers.Referer.ToString();
            // var baseURL = new Uri(ss).GetLeftPart(UriPartial.Authority); //= $"{request.Scheme}://{request.Host.Value}";


           

            var userIdentity = await GetIdentity(userManager, user.UserName, user.Password);
            var response = new TokenResponse();
            var userId = string.Empty;
            if (userIdentity != null)
            {
                userId = userIdentity.FindFirst(ClaimTypes.NameIdentifier).Value;
                
            
                var authTenantInfo = await _laboratoryManagement.GetLabBriefInfoByUserIdAsync(userId);
                var userInfoById = _userManagement.GetUserById(userId);
                var getLoggedInUserInfo = _userManagement.GetLoggedInUserInfo(userId);
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
                        InfomationOfLoggedUser = getLoggedInUserInfo
                    };
                    if (!string.IsNullOrEmpty(baseURL))
                    {
                        var turi = new Uri(authTenant.URL);
                        var buri = new Uri(baseURL);
                        if (Uri.Compare(buri, turi, UriComponents.StrongAuthority, UriFormat.SafeUnescaped, StringComparison.OrdinalIgnoreCase) == 0)
                            authTenant.IsSelected = true;
                    }
                    response.AuthTenants.Add(authTenant);
                }

                
                var issuer = JwtHandler.ISSUER;
                var audience = JwtHandler.AUDIENCE;
                var key = Encoding.ASCII.GetBytes
                (JwtHandler.KEY);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = userIdentity,
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
                response.UserId = userId;
                response.Username = string.IsNullOrEmpty(userInfoById?.Username) ? userInfoById?.Email : userInfoById?.Username;
                response.ExpiresIn = (int)tokenDescriptor.Expires.Value.Subtract(DateTime.UtcNow).TotalSeconds;
                response.Expires = tokenDescriptor.Expires.Value;
                return response;
            }
            return null;
        }
        public async Task<object?> GenerateTokenV1(IUserManagement userManager, UserValidationViewModel user)
        {



            var request = _connectionManager.Request;
            var baseURL = request.Headers.Referer.ToString();
            // var baseURL = new Uri(ss).GetLeftPart(UriPartial.Authority); //= $"{request.Scheme}://{request.Host.Value}";




            var userIdentity = await GetIdentity(userManager, user.UserName, user.Password);




            var response = new TokenResponse();
            var userId = string.Empty;
            
            
            
            
            
            if (userIdentity != null)
            {
                userId = userIdentity.FindFirst(ClaimTypes.NameIdentifier).Value;


                var authTenantInfo = await _laboratoryManagement.GetLabBriefInfoByUserIdAsync(userId);
                var userInfoById = _userManagement.GetUserById(userId);
                var getLoggedInUserInfo = _userManagement.GetLoggedInUserInfo(userId);
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
                        InfomationOfLoggedUser = getLoggedInUserInfo
                    };
                    if (!string.IsNullOrEmpty(baseURL))
                    {
                        var turi = new Uri(authTenant.URL);
                        var buri = new Uri(baseURL);
                        if (Uri.Compare(buri, turi, UriComponents.StrongAuthority, UriFormat.SafeUnescaped, StringComparison.OrdinalIgnoreCase) == 0)
                            authTenant.IsSelected = true;
                    }
                    response.AuthTenants.Add(authTenant);
                }


                var issuer = JwtHandler.ISSUER;
                var audience = JwtHandler.AUDIENCE;
                var key = Encoding.ASCII.GetBytes
                (JwtHandler.KEY);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = userIdentity,
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
                response.UserId = userId;
                response.Username = string.IsNullOrEmpty(userInfoById?.Username) ? userInfoById?.Email : userInfoById?.Username;
                response.ExpiresIn = (int)tokenDescriptor.Expires.Value.Subtract(DateTime.UtcNow).TotalSeconds;
                response.Expires = tokenDescriptor.Expires.Value;
                return response;
            }
            return null;
        }
        public class UserValidationViewModel
        {
            public string? UserName { get; set; }
            public string? Password { get; set; }
        }
    }
}
