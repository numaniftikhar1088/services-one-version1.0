using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Middlewares.Models;

namespace TrueMed.Business.Middlewares
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task Invoke(HttpContext httpContext)
        {
            var _masterDbContext = httpContext.RequestServices.GetRequiredService<MasterDbContext>();
            var _cacheStorage = httpContext.RequestServices.GetRequiredService<ICacheManager>();

            var token = httpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);

            var loggedInUserId = jwtSecurityToken.Payload.FirstOrDefault(x => x.Key.Trim().ToLower().Equals("nameid")).Value.ToString();

            var permissionList = new List<PermissionModel>();

            var permissionsFromCache = await _cacheStorage.GetAsync<List<PermissionModel>>("REDIS_PERMISSIONS");
            if (!permissionsFromCache.IsSuccess)
            {
                var tblUserPermissions = await _masterDbContext.TblUserPermissions.ToListAsync();
                if (tblUserPermissions != null)
                {
                    var userIds = tblUserPermissions.DistinctBy(d => d.UserId).Select(s => s.UserId).ToList();
                    foreach (var userId in userIds)
                    {
                        var tblApplicationLinks = await _masterDbContext.TblApplicationLinks.ToListAsync();

                        var permissionIds = tblUserPermissions.Where(f => f.UserId == userId).Select(s => s.PermissionId).ToList();
                        var permissions = tblApplicationLinks.Where(f => permissionIds.Contains(f.Id)).ToList();

                        var perModel = new PermissionModel();
                        perModel.UserId = userId;
                        foreach (var permission in permissions)
                        {
                            var appLink = new ApplicationLink();
                            appLink.PermissionLink = permission.PermissionLink;
                            appLink.IsPublic = permission.IsPublic;
                            perModel.Links.Add(appLink);
                        }
                        permissionList.Add(perModel);
                    }
                    await _cacheStorage.SetAsync<List<PermissionModel>>("REDIS_PERMISSIONS", permissionList);
                }
            }
            else { permissionList = permissionsFromCache.Value; }

            var getLoggedUserPermissions = permissionList.FirstOrDefault(x => x.UserId == loggedInUserId);

            var isCanAccessLink = getLoggedUserPermissions.Links
                .Any(a => a.PermissionLink.Trim().ToLower() == httpContext.Request.Path.ToString().Trim().ToLower() || a.IsPublic == true);

            if (isCanAccessLink)
            {
                await _next(httpContext);
                return;
            }
            httpContext.Response.StatusCode = 401;
            await httpContext.Response.WriteAsJsonAsync("Access Denied !. Please Contact With Admin.Thanks");
        }
    }
}
