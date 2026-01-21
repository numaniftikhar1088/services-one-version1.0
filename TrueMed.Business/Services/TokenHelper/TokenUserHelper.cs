using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Business.MasterDBContext;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Response;
using TrueMed.Business.Implementation;
using Dapper;
using Microsoft.Data.SqlClient;
using TrueMed.Domain.Models.Menus;
using Microsoft.Extensions.Configuration;

namespace TrueMed.Business.Services.TokenHelper
{
    public class TokenUserHelper
    {



        private readonly ApplicationDbContext _applicationDbContext;
        private readonly MasterDbContext _masterDbContext;
        private readonly ISecretManagement _secretManagement;
        private readonly ApplicationUser _applicationUser;
        private readonly IDapperManager _dapperManager;
   
        public TokenUserHelper(string PortalKey,ISecretManagement secretManagement, IConfiguration configuration)
        {
            _secretManagement = secretManagement;
            _applicationDbContext = ApplicationDbContext.Create(_secretManagement.GetSecret(PortalKey).Value);
            _dapperManager =new DapperManager(configuration.GetConnectionString("MasterDBConnectionString"));
        }



        public async Task<string> GetUserInfo(string userId)
        {

            string userType = "";
            var userinfo = await _applicationDbContext.TblUserRoles.Join(_applicationDbContext.TblRoles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => new
                {
                    r.Name,
                    ur.UserId
                }
                ).Where(x=>x.UserId==userId).FirstOrDefaultAsync();

            return  userinfo.Name;
        }

        public async Task<LoggedInRoleWithInformation> GetUserInfoWithClaims(ApplicationUser userInfo)
        {

            var resp = new LoggedInRoleWithInformation();
            var userInformation = new LoggedInUserInformation();

            // Check UserType Facility OR Admin
           // int adminTypeValue = userInfo.UserType != null ? int.Parse(userInfo.AdminType) : 0;
            userInformation.UserType = Enum.GetName<UserType>((UserType)userInfo.UserType);

            var userRoleInfo = _applicationDbContext.TblUserRoles.AsNoTracking().FirstOrDefault(x => x.UserId == userInfo.Id);

            resp.Role = _applicationDbContext.TblRoles.AsNoTracking().FirstOrDefault(x => x.Id == userRoleInfo.RoleId)?.Name;


            var userRights= _applicationDbContext.TblUserClaims.Where(f => f.UserId == userInfo.Id && f.IsChecked == true).Select(s => s.PageId).ToList();
            userInformation.AdminType = Enum.GetName<AdminTypeEnum>((AdminTypeEnum)userRoleInfo.SubRoleType);
            userInformation.Facilities = new List<FacilityInformation>();
            userInformation.Claims = new List<ModuleWithClaims>();
            var AllowedModules = _applicationDbContext.TblModules.AsNoTracking().Select(x => x.ModuleId).ToList();
            var AllowedPages = _applicationDbContext.TblPages.AsNoTracking().Select(x => x.Id).ToList();
            var pager = _applicationDbContext.TblPages.ToList();
            var sql = $"SELECT * FROM [dbo].[view_MenuTable]  WHERE ModuleId IN ({string.Join(",", AllowedModules)}) and PageId IN ({string.Join(",", AllowedPages)})";
            var AllMenus =await _dapperManager.SQL_Execute<MasterMenuViewModel>(sql);

            if (userInfo.UserType == UserType.Master)
            {
                userInformation.Claims = GetUserMenu(AllMenus, new List<int?>(), true);

            }
            else {
                if ((AdminTypeEnum)userRoleInfo.SubRoleType == AdminTypeEnum.Facility)
                {

                    var UserAssignedFacilities = _applicationDbContext.TblFacilityUsers.Join(
                        _applicationDbContext.TblFacilities,
                        fu => fu.FacilityId,
                        f => f.FacilityId,
                        (fu, f) => new
                        {
                            fu,
                            f
                        }

                        ).Where(x => x.fu.UserId == userInfo.Id).Select(x => x.f).ToList();




                    foreach (var facility in UserAssignedFacilities)
                    {
                        var facilityInfoObj = new FacilityInformation();
                        facilityInfoObj.DirectGoToFacility = false;
                        facilityInfoObj.FacilityId = facility.FacilityId;
                        facilityInfoObj.FacilityName = facility.FacilityName;
                        facilityInfoObj.FacilityClaims = new List<ModuleWithClaims>();
                        facilityInfoObj.FacilityClaims = GetUserMenu(AllMenus, userRights);
                        userInformation.Facilities.Add(facilityInfoObj);
                    }
                }
                else if ((AdminTypeEnum)userRoleInfo.SubRoleType == AdminTypeEnum.Admin)
                {
                    userInformation.Claims = new List<ModuleWithClaims>();
                    userInformation.Claims = GetUserMenu(AllMenus, userRights);
                }
            }



            resp.LoggedInUserInformation = userInformation;

            return resp;
        }

        private List<ModuleWithClaims> GetUserMenu(IReadOnlyList<MasterMenuViewModel> allMenus, List<int?> userRights,bool isMasterUser=false)
        {

            List<ModuleWithClaims> userMenu = new List<ModuleWithClaims>();
            allMenus=allMenus.OrderBy(x=>x.ModuleOrderId).ThenBy(x=>x.PageOrderId).ToList();

            var allModulesIds= allMenus.Where(x => x.ModuleId != null).Select(x=>x.ModuleId).Distinct().ToList();
            var AllChild = allMenus.Where(x => x.ChildID != null).Select(x => x.ChildID).Distinct().ToList();


            foreach (var moduleId in allModulesIds)
            {
                var module = allMenus.FirstOrDefault(x => x.ModuleId == moduleId);
                if (module == null)
                    continue;

                ModuleWithClaims a = new ModuleWithClaims();
                a.ModuleId = module.ModuleId;
                a.ModuleIcon = module.ModuleIcon;
                a.Module = module.ModuleName;
                a.Claims = new List<Menu>();
                var allPagesOfModule = allMenus.Where(x => x.ModuleId == moduleId).OrderBy(x => x.PageOrderId).ToList();
                if (allPagesOfModule.Count == 0)
                    continue;


                foreach (var page in allPagesOfModule)
                {
                    if (!isMasterUser)
                    {
                        if (!userRights.Any(x => x == page.PageId))
                            continue;
                    }

                    if (AllChild.Any(x => x == page.PageId))
                        continue;

                    Menu m = new Menu();
                    m.ICon = page.MenuIcon;
                    m.OrderBy = page.PageOrderId;
                    m.Id = page.PageId;
                    m.LinkUrl = page.LinkUrl;
                    m.Name = page.PageName;
                    m.SubClaims = new List<SubMenu>();
                    if (page.ChildID != null &&userRights.Any(x => x == page.PageId))
                    {
                        SubMenu subMenu = new SubMenu();
                        var subPage = allMenus.FirstOrDefault(x => x.PageId == page.ChildID);
                        if (subPage != null)
                        {
                           subMenu.ICon = subPage.MenuIcon;
                            subMenu.OrderBy = subPage.PageOrderId;
                            subMenu.Id = subPage.PageId;
                            subMenu.LinkUrl = subPage.LinkUrl;
                            subMenu.Name = "Add";
                            m.SubClaims.Add(subMenu);
                        }
                    }



                    a.Claims.Add(m);

                }


                if (a.Claims.Count == 0)
                    continue;
                userMenu.Add(a);

            }
          return userMenu;
        }
    }
}
