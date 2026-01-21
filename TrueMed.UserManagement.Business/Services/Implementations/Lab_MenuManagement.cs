using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Response;
using TrueMed.Business.Interface;
using TrueMed.UserManagement.Business.Services.Interfaces;
using TrueMed.UserManagement.Domain.Enums;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
namespace TrueMed.UserManagement.Business.Services.Implementations
{
    public class Lab_MenuManagement : ILab_MenuManagement
    {
        private readonly IConnectionManager _connectionManager;
        private ApplicationDbContext _appDbContext;
        private MasterDbContext _masterDbContext;
        public Lab_MenuManagement(IConnectionManager connectionManager, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _appDbContext = ApplicationDbContext.Create(connectionManager);
            _masterDbContext = masterDbContext;

        }

        public RequestResponse<ModuleWithClaimsResponse> MenusByUserIdForLabSide()
        {
            var respose = new RequestResponse<ModuleWithClaimsResponse>();
            var claimIds = new List<int>();

            // Check Logged In User Master Or Lab
            var userId = _connectionManager.UserId;
            var getLoggedInUser_UserType = _masterDbContext.TblUsers.Where(f => f.Id == userId).FirstOrDefault()?.UserType;

            if (getLoggedInUser_UserType == (int)UserTypeEnum.Master)
                claimIds = _masterDbContext.TblClaims.Select(s => s.Id).ToList();
            else
                claimIds = _appDbContext.TblUserClaims.Where(f => f.UserId == _connectionManager.UserId && f.IsChecked == true).Select(s => s.ClaimId).ToList();


            var moduleWithPagesAndClaims = _masterDbContext.TblModules
                .Include(x => x.Pages)
                .ThenInclude(i => i.Claims)
                .ToList();

            var returnResponse = new ModuleWithClaimsResponse();
            var moduleWithClaimsObj = new ModuleWithClaimsResponse();

            foreach (var module in moduleWithPagesAndClaims)
            {
                var moduleObj = new Module();
                moduleObj.Id = module.Id;
                moduleObj.Name = module.Name;
                moduleObj.Icon = module.Icon;
                List<int> ChildIds = new List<int>();
                foreach (var page in module.Pages)
                {
                    var pageObj = new Domain.Models.Dtos.Response.Claim();
                    pageObj.Id = page.Id;
                    pageObj.Name = page.Name;
                    pageObj.LinkUrl = page.LinkUrl;
                    pageObj.OrderId = page.OrderId;
                    pageObj.Icon = page.MenuIcon;
                    pageObj.ChildId = page.ChildId;

                   
                    //foreach (var claim in page.Claims)
                    //{
                        
                    //    if (claimIds.Contains(claim.Id))
                    //    {
                    //        if (moduleWithClaimsObj.Modules.Any(a => a.Id == moduleObj.Id))
                    //        {
                    //            var existingModuleEntryForEdit = moduleWithClaimsObj.Modules.FirstOrDefault(f => f.Id == moduleObj.Id);
                    //            var subClaims = _masterDbContext.TblPages.Where(w=> w.IsActive.Equals(true)).FirstOrDefault(a => a.Id == pageObj.ChildId);
                    //            if (subClaims != null)
                    //            {
                    //                var subClaimObj = new Domain.Models.Dtos.Response.SubClaim();
                    //                subClaimObj.Id = subClaims.Id;
                    //                subClaimObj.Name = subClaims.Name;
                    //                subClaimObj.LinkUrl = subClaims.LinkUrl;
                    //                subClaimObj.OrderId = subClaims.OrderId;
                    //                subClaimObj.Icon = subClaims.MenuIcon;

                    //                pageObj.SubClaims.Add(subClaimObj);


                    //                var isSubClaimsExistInClaim = existingModuleEntryForEdit.Claims.FirstOrDefault(a => a.Id == pageObj.ChildId);
                    //                if (isSubClaimsExistInClaim != null)
                    //                {
                    //                    existingModuleEntryForEdit.Claims.Remove(isSubClaimsExistInClaim);
                    //                    existingModuleEntryForEdit.Claims.Add(pageObj);
                    //                }
                    //                else
                    //                {
                    //                    existingModuleEntryForEdit.Claims.Add(pageObj);
                    //                }

                    //            }
                    //            else
                    //            {
                    //                var subClaimsList = existingModuleEntryForEdit.Claims.SelectMany(sc => sc.SubClaims).ToList();
                    //                if (!subClaimsList.Any(sc => sc.Id == pageObj.Id))
                    //                    existingModuleEntryForEdit.Claims.Add(pageObj);

                    //            }

                    //            var moduleIndex = moduleWithClaimsObj.Modules.IndexOf(existingModuleEntryForEdit);
                    //            if (moduleIndex > -1)
                    //                moduleWithClaimsObj.Modules.RemoveAt(moduleIndex);

                    //            moduleWithClaimsObj.Modules.Add(existingModuleEntryForEdit);

                    //        }
                    //        else
                    //        {
                    //            var subClaims = _masterDbContext.TblPages.FirstOrDefault(a => a.Id == pageObj.ChildId);
                    //            if (subClaims != null)
                    //            {
                    //                var subClaimObj = new Domain.Models.Dtos.Response.SubClaim();
                    //                subClaimObj.Id = subClaims.Id;
                    //                subClaimObj.Name = subClaims.Name;
                    //                subClaimObj.LinkUrl = subClaims.LinkUrl;
                    //                subClaimObj.OrderId = subClaims.OrderId;
                    //                subClaimObj.Icon = subClaims.MenuIcon;

                    //                pageObj.SubClaims.Add(subClaimObj);
                    //            }
                                
                    //        }
                    //    }
                        
                        
                    //}
                    moduleObj.Claims.Add(pageObj);

                }
                //var child = moduleObj.Claims.Where(x => x.Id == page.ChildId).FirstOrDefault();
                //if (child != null)
                //{
                //    moduleObj.Claims.Remove(child);
                //}

                moduleWithClaimsObj.Modules.Add(moduleObj);
            }
            respose.Data = moduleWithClaimsObj;
            respose.Message = "Request Processd Successfully";
            respose.StatusCode = HttpStatusCode.OK;
            return respose;
        }
    }
}
