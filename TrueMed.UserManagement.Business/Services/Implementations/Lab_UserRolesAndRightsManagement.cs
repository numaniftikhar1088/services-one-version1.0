using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;

using TrueMed.UserManagement.Business.Services.Interfaces;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;

namespace TrueMed.UserManagement.Business.Services.Implementations
{
    public class Lab_UserRolesAndRightsManagement : ILab_UserRolesAndRightsManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ILookupManager _lookupManager;

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly MasterDbContext _masterDbContext;

        public Lab_UserRolesAndRightsManagement(IConnectionManager connectionManager, ILookupManager lookupManager, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _lookupManager = lookupManager;

            _applicationDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            _masterDbContext = masterDbContext;
        }

        #region Queries
        public async Task<RequestResponse<List<GetModuleWithPageResponse>>> GetModuleAndClaimsByRoleIdAsync(int? roleId)
        {
            var response = new RequestResponse<List<GetModuleWithPageResponse>>();

            if (roleId > 0 && roleId != null)
            {
                var ClaimsIdsAgainstRoleFromLabSide = _applicationDbContext.TblRoleClaims.Where(f => f.RoleId == roleId).Select(s => s.ClaimId).ToList();
                var AllowedModules = _applicationDbContext.TblModules.AsNoTracking().Select(x => x.ModuleId).ToList();
                var AllowedPages = _applicationDbContext.TblPages.AsNoTracking().Select(x => x.Id).ToList();
                var claimsIdsFromMasterDb = _masterDbContext.TblClaims.Select(s => s.Id).ToList();

                var systemClaimsIds = claimsIdsFromMasterDb.Where(f => ClaimsIdsAgainstRoleFromLabSide.Contains(f)).ToList();
                var additionalClaimIds = claimsIdsFromMasterDb.Where(f => !ClaimsIdsAgainstRoleFromLabSide.Contains(f)).ToList();

                var moduleWithPages = await _masterDbContext.TblModules
                    .Include(x => x.Pages).ToListAsync();

                var returnRespone = new List<GetModuleWithPageResponse>();

                foreach (var modulesWithPage in moduleWithPages)
                {
                    if (!AllowedModules.Contains(modulesWithPage.Id))
                        continue;

                    var moduleWithPageObj = new GetModuleWithPageResponse();
                    moduleWithPageObj.Module = modulesWithPage.Name;




                    foreach (var page in modulesWithPage.Pages)
                    {


                            var pageObj = new Page();
                            pageObj.PageId = page.Id;
                            pageObj.PageName = page.Name;

                            if (systemClaimsIds.Contains(page.Id))
                            {
                                pageObj.IsSelected = true;
                                pageObj.IsSystemField = true;
                            }
                            if (additionalClaimIds.Contains(page.Id))
                            {
                                pageObj.IsSelected = false;
                                pageObj.IsSystemField = false;
                            }
                            moduleWithPageObj.Pages.Add(pageObj);
                      



                        //foreach (var claim in page.Claims)
                        //{
                        //    var pageObj = new Page();
                        //    pageObj.PageId = claim.Id;
                        //    pageObj.PageName = claim.Name;

                        //    if (systemClaimsIds.Contains(claim.Id))
                        //    {
                        //        pageObj.IsSelected = true;
                        //        pageObj.IsSystemField = true;
                        //    }
                        //    if (additionalClaimIds.Contains(claim.Id))
                        //    {
                        //        pageObj.IsSelected = false;
                        //        pageObj.IsSystemField = false;
                        //    }
                        //    moduleWithPageObj.Pages.Add(pageObj);
                        //}
                    }
                    returnRespone.Add(moduleWithPageObj);
                }
                response.Data = returnRespone;
            }

            response.Message = "Request Proccessed Successfully...";
            response.StatusCode = HttpStatusCode.OK;


            return response;
        }
        public async Task<RequestResponse<List<GetModuleWithPageResponse>>> GetModuleAndClaimsByUserIdAsync(string? userId)
        {
            var response = new RequestResponse<List<GetModuleWithPageResponse>>();

            var getUserRoleId = _applicationDbContext.TblUserRoles.FirstOrDefault(f => f.UserId == userId)?.RoleId;
            if (getUserRoleId > 0)
            {
                var ClaimsIdsAgainstRoleFromLabSide = _applicationDbContext.TblRoleClaims.Where(f => f.RoleId == getUserRoleId).Select(s => s.ClaimId).ToList();
                var claimsIdsFromMasterDb = _masterDbContext.TblClaims.Select(s => s.Id).ToList();

                var systemClaimsIds = claimsIdsFromMasterDb.Where(f => ClaimsIdsAgainstRoleFromLabSide.Contains(f)).ToList();
                var additionalClaimIds = claimsIdsFromMasterDb.Where(f => !ClaimsIdsAgainstRoleFromLabSide.Contains(f)).ToList();

                var moduleWithPages = await _masterDbContext.TblModules
                    .Include(x => x.Pages)
                    .ThenInclude(i => i.Claims).ToListAsync();

                var getExistingUserClaimslst = _applicationDbContext.TblUserClaims.Where(f => f.UserId == userId).ToList();

                var returnRespone = new List<GetModuleWithPageResponse>();

                foreach (var modulesWithPage in moduleWithPages)
                {
                    var moduleWithPageObj = new GetModuleWithPageResponse();
                    moduleWithPageObj.Module = modulesWithPage.Name;

                    foreach (var page in modulesWithPage.Pages)
                    {
                    
                            var pageObj = new Page();
                            pageObj.PageId = page.Id;
                            pageObj.PageName = page.Name;

                            var getExistingUserClaims =  getExistingUserClaimslst.FirstOrDefault(f =>  f.PageId == page.Id);
                            if (getExistingUserClaims != null)
                                pageObj.IsSelected = getExistingUserClaims.IsChecked;
                            else
                                pageObj.IsSelected = false;

                            moduleWithPageObj.Pages.Add(pageObj);
                        


                        //foreach (var claim in page.Claims)
                        //{
                        //    var pageObj = new Page();
                        //    pageObj.PageId = claim.Id;
                        //    pageObj.PageName = claim.Name;

                        //    var getExistingUserClaims = await _applicationDbContext.TblUserClaims.FirstOrDefaultAsync(f => f.UserId == userId && f.ClaimId == claim.Id);
                        //    if (getExistingUserClaims != null)
                        //        pageObj.IsSelected = getExistingUserClaims.IsChecked;
                        //    else
                        //        pageObj.IsSelected = false;

                        //    moduleWithPageObj.Pages.Add(pageObj);
                        //}
                    }
                    returnRespone.Add(moduleWithPageObj);
                }
                response.Data = returnRespone;
            }

            response.Message = "Request Proccessed Successfully...";
            response.StatusCode = HttpStatusCode.OK;


            return response;
        }

        #endregion

        #region Commands
        public async Task<RequestResponse> AddOREditRoleClaims(AddOREditClaimRequest request)
        {
            var response = new RequestResponse();

            var userOldClaims = await _applicationDbContext.TblUserClaims.AsNoTracking().Where(f => f.UserId == request.UserId).ToListAsync();
            if (userOldClaims.Count() > 0)
                _applicationDbContext.RemoveRange(userOldClaims);

            foreach (var claim in request.Claims)
            {
                #region Remove User Favourite Icon
                var GetfavMenuForRemove = _applicationDbContext.TblUserfavouriteMenus.FirstOrDefault(f => f.UserId == request.UserId && f.FavouriteMenuId == claim.ClaimsId);
                if (GetfavMenuForRemove != null)
                {
                    _applicationDbContext.TblUserfavouriteMenus.Remove(GetfavMenuForRemove);
                }
                #endregion

                var newclaim = new TblUserClaim();
                newclaim.UserId = request.UserId;
                newclaim.ClaimId = claim.ClaimsId;
                newclaim.PageId = claim.ClaimsId;
                newclaim.IsChecked = claim.IsChecked;

                await _applicationDbContext.AddAsync(newclaim);
                await _applicationDbContext.SaveChangesAsync();
            }
            response.Message = "Saved Successfully...";
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        #endregion

        #region Lookups
        public async Task<List<CommonLookupResponse>> GetUserRoles_Lookup_Async()
        {
            return await _lookupManager.Lab_SideRoles_Lookup();
        }
        #endregion
    }
}
