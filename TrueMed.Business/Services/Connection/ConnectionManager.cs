using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.Security.Claims;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
namespace TrueMed.Business.Services.Connection
{
    public class ConnectionManager : IConnectionManager
    {
        public const string X_PORTAL_KEY = "X-PORTAL-KEY";
        public const string MASTER_PORTAL_KEY = "MasterApp";
        private ILaboratoryManagement _laboratoryManagement => GetService<ILaboratoryManagement>();
        private ISecretManagement _secretManagement => GetService<ISecretManagement>();

        public ConnectionManager(IHttpContextAccessor httpContextAccessor)
        {

            _httpContext = httpContextAccessor.HttpContext;
            if (_httpContext.Request.Path.HasValue
                && _httpContext.Request.Path.Value.ToLower().Contains("/token"))
            {
                PortalName = MASTER_PORTAL_KEY;
            }
            if (_httpContext.Request.Headers.TryGetValue("Facility", out var facility))
            {
                FacilityId = int.Parse(facility);
            }
            else
            {
                FacilityId = 0;
            }
            if (_httpContext.Request.Headers.TryGetValue("Lab", out var Lab))
            {
                LabId = Convert.ToInt32(Lab);
            }
            else
            {
                LabId = 0;
            }
            if (_httpContext.Request.Headers.TryGetValue(X_PORTAL_KEY, out var xPortalKey))
            {
                PortalName = xPortalKey;
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                if (!_httpContext.Request.Path.Value.ToLower().Contains("/token")) {
                    if (identity != null)
                    {
                        var tokenPortalKey = identity.FindFirst(ClaimTypes.System)?.Value;
                        if (!string.IsNullOrEmpty(tokenPortalKey))
                        {
                            if (!(PortalName ?? "").ToLower().Trim().Equals(tokenPortalKey.ToLower().Trim()))
                                throw new  UnauthorizedAccessException("Cross Tenant Access detected!!!. Please get new Token and try again");
                    }
                    }
                }

            }
            else if(IsMasterUser)
            {
                PortalName = MASTER_PORTAL_KEY;
            }
            else
            {
                PortalName = MASTER_PORTAL_KEY;
            }

            Configuration = _httpContext.RequestServices.GetService<IConfiguration>();

        }
        public SqlConnection CreateConnection() { return new SqlConnection(CONNECTION_STRING); }
        public Uri Uri => new Uri(UriHelper.GetDisplayUrl(Request));
        public string PortalName
        {
            get;
        }
        public int FacilityId { get; set; }
        public int LabId { get; set; }
        public bool IsPortalExist => !string.IsNullOrWhiteSpace(PortalName);
        public string X_Portal_Key_Value
        {
            get
            {
                _httpContext.Request.Headers.TryGetValue(X_PORTAL_KEY, out var xPortalKey);
                return xPortalKey;
            }
        }
        public string CONNECTION_STRING
        {
            get
            {
                return _secretManagement.GetSecret(PortalName).Value;
            }
            
        }
        public bool IsTestingEnvironment
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(Request.Headers["IsTestingEnvironment"]))
                {
                    return Request.Headers["IsTestingEnvironment"] == "1";
                }
                return false;
            }
        }
        public Uri ClientDomain
        {
            get
            {
                var url = new Uri(Uri.AbsoluteUri.Replace(Uri.PathAndQuery, ""));
                return url;
            }
        }
        private HttpContext _httpContext;
        public HttpContext HttpContext { get => _httpContext; }
        public HttpRequest Request => _httpContext.Request;
        public bool IsMasterUser
        {
            get
            {
                var claim = _httpContext.User.FindFirst(ClaimTypesCustom.USER_TYPE);
                if (claim != null)
                {
                    return (UserType)Convert.ToInt16(claim.Value) == UserType.Master;
                }
                else
                {
                    return false;
                }
            }
        }
        public bool IsFacilityUser
        {
            get
            {
                var masterDbContext = GetService<MasterDbContext>();
                var getAdminTypeId = masterDbContext.TblUsers.FirstOrDefault(f => f.Id == UserId)?.AdminType;
                var userType = masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == Convert.ToInt32(getAdminTypeId))?.UserType;
                if (userType.Trim().ToUpper() == "FACILITY" && !string.IsNullOrEmpty(userType))
                    return true;
                else
                    return false;
            }
        }
        public string GetLabDomainUrl()
        {
            return _laboratoryManagement.GetLabDomainUrlByKey(X_Portal_Key_Value);
        }
        public string UserId => _httpContext.User.GetUserId();
        public bool HasLabAccess(string? labKey = "")
        {
            var portalKey = string.IsNullOrEmpty(labKey) ? X_Portal_Key_Value : labKey;
            if ((!PortalName.Equals(MASTER_PORTAL_KEY, StringComparison.OrdinalIgnoreCase)
                && string.IsNullOrWhiteSpace(labKey)
                ) || !string.IsNullOrWhiteSpace(labKey)
                )
            {
                if (IsMasterUser)
                {
                    return _laboratoryManagement.IsLabExistsByKey(portalKey);
                }
                else
                {
                    return _laboratoryManagement.IsUserExistsInLabByKey(portalKey, UserId);
                }
            }
            return false;
        }
        public IConfiguration Configuration { get; }
        public T GetService<T>()
        {
            return _httpContext.RequestServices.GetRequiredService<T>();
        }
        public int? GetLabId(string labKey = "")
        {
            labKey = string.IsNullOrWhiteSpace(labKey) ? X_Portal_Key_Value : labKey;
            return _laboratoryManagement.GetLabIdByKey(labKey);
        }

        public void EnsureLabByKey(string labKey)
        {
            if (!_laboratoryManagement.IsLabExistsByKey(labKey))
            {
                throw new InvalidOperationException("Inavlid lab key", new X_Portal_Key_EXCEPTION());
            }
        }

        public void Throw_Invalid_X_Portal_Key_Error(string labKey)
        {
            throw new InvalidOperationException("Inavlid lab key", new X_Portal_Key_EXCEPTION());
        }
        public bool GetFacilityUserORNot()
        {
            return IsFacilityUser;
        }

    }
}
