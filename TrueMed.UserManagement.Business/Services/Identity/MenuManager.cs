using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Menu.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Interface;

namespace TrueMed.UserManagement.Business.Services.Identity
{
    public static class MenuManager
    {
        public static ICollection<MenuModel> GenerateMenuesTree(ICollection<MenuModel> claimMenueViewModel)
        {
            return _generateMenuesTree(claimMenueViewModel, null);
        }

        private static List<MenuModel> _generateMenuesTree(
            ICollection<MenuModel> claimMenueViewModel,
            int? parentId)
        {
            return claimMenueViewModel
                .Where(x => x.ParentId == parentId)
                .Select(x => new MenuModel
                {
                    Id = x.Id,
                    CreateBy = x.CreateBy,
                    CreateDate = x.CreateDate,
                    IsActive = x.IsActive,
                    MenuLink = x.MenuLink,
                    Name = x.Name,
                    Order = x.Order,
                    ParentId = x.ParentId,
                    Icon = x.Icon,
                    Claims = x.Claims,
                    ModuleId = x.Id,
                    Menus = _generateMenuesTree(claimMenueViewModel, x.Id)
                }).OrderBy(x => x.Order).ToList();
        }

        public static async Task<List<ModuleWithMenus>> GetMenusAsync(IConnectionManager connectionManager)
        {
            var menuManagement = connectionManager.GetService<IMenuManagement>();
            var labModuleManagement = connectionManager
                .GetService<ILabModuleManagement>();
            var labMenusManagement = connectionManager.GetService<ILabMenuManagement>();
            var roleManagement = connectionManager.GetService<ILabRoleManagement>();

            var labModules = await labModuleManagement
                .GetAllModules()
                .Select(x => x.Id)
                .ToListAsync();

            var labMenus = await labMenusManagement
    .GetAllMenus()
    .Select(x => x.Id)
    .ToListAsync();

            var claims = await roleManagement.GetClaimsIdsByUserIdAsync(connectionManager.UserId);

            var menus = await menuManagement
                .GetAllMenus()
                .Where(x => claims.Contains(x.Id)
                //.Where(x => labMenus.Contains(x.Id) 
                //&& x.Claims.Any(_ => claims.Contains(_.Id)))
                ).ToListAsync();

            //)
            //    .Select(x => x.Id)
            //    .ToArrayAsync();


            var menuIds = menus.Select(x => x.Id)
                .ToList();

            var menusNoYetFoundParents = menus.Where(_ => _.ParentId != null
                && !menuIds.Contains(_.ParentId ?? 0)).Select(x => x.ParentId).ToList();

            var moduleIds = menus.Select(x => x.ModuleId)
                .Where(x => labModules.Contains(x))
                .Distinct().ToArray();

            if (menusNoYetFoundParents.Any())
            {
                menus.AddRange(
                    await menuManagement.GetAllMenus()
                    .Where(x => menusNoYetFoundParents.Contains(x.Id)).ToListAsync());
            }

            var modules = (await menuManagement
                .GetModulesByIdsAsync(moduleIds))
                .Select(x => new ModuleWithMenus
                {
                    Menus = GenerateMenuesTree(menus.Where(_ => _.ModuleId == x.ModuleId).ToList()),
                    ModuleId = x.ModuleId,
                    ModuleName = x.ModuleName,
                    Icon = x.Icon,
                    Order = x.Order
                }).OrderBy(x => x.Order).ToList();


            return modules;
        }
    }
}