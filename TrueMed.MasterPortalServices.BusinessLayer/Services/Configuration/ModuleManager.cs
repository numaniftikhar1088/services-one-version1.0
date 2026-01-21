using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.Menu.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Interface;
using TrueMed.UserManagement.Business.Services.Identity;
using TrueMed.Business.TenantDbContext;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Configuration
{

    public class ModuleManager : ControlsManager
    {
        public ModuleManager(IConnectionManager connectionManager, string? labKey = null) : base(connectionManager, labKey)
        {
        }

        public async
         Task<ModuleDetailedViewModel?> GetModule_DetailedByNameAsync(string name)
        {
            using (TransactionScope transactionScope = new TransactionScope(
                TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                var module = await _moduleManagement
                .GetAllModules()
                .Where(x => x.Name.ToLower().Trim() == name.ToLower().Trim())
                .Select(x => new ModuleDetailedViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Order = x.Order
                }).FirstOrDefaultAsync();

                if (module == null)
                    return null;

                (await GetAllSectionsByModuleNameAsync(name))?.ForEach(x =>
                {
                    module.Sections.Add(_Mapper.Converstion<SectionModel, SectionDetailedViewModel>(x));
                });

                foreach (var item in module.Sections)
                {
                    item.Controls.AddRange(await GetAllControlsBySectionIdAndModuleNameAsync(item.Id, name));
                }
                return module;
            }
        }
    }

    public static partial class ModuleManagerExtention
    {
        public static async
            Task<DataReponseViewModel<MasterPortalAppManagement
            .Domain.Models
                .Configuration
                .Response
                .ModuleViewModel>> SearchModulesAsync(DataQueryViewModel<ModuleQueryViewModel> dataQueryViewModel, IConnectionManager connectionManager)
        {
            var moduleManagement = connectionManager.GetService<IModuleManagement>();

            var modules = moduleManagement.GetAllModules().OrderByDescending(o => o.Id).Select(x => new MasterPortalAppManagement.Domain.Models.Configuration.Response.ModuleViewModel
            {
                Id = x.Id,
                Name = x.Name,
                Icon = x.Icon,
                Order = x.Order,
                CreateBy = x.CreateBy,
                CreateDate = x.CreateDate
            });

            if (dataQueryViewModel.QueryModel != null)
            {
                var queryModel = dataQueryViewModel.QueryModel;
                if (!string.IsNullOrEmpty(queryModel.Name))
                {
                    modules = modules.Where(x => x.Name !=null && x.Name.Trim().ToLower().Contains(queryModel.Name.Trim().ToLower()));
                }
            }

            return new DataReponseViewModel<MasterPortalAppManagement.Domain.Models.Configuration.Response.ModuleViewModel>()
            {
                Total = modules.Count(),
                Data = await modules
                .Skip((dataQueryViewModel.PageNumber - 1) * dataQueryViewModel.PageSize)
                .Take(dataQueryViewModel.PageSize).ToListAsync()
            };
        }

        public static async Task<IdentityResult> UpdateModuleVisibilityAsync(string labKey,
            ModuleVisibilityViewModel[] modules, IConnectionManager connectionManager)
        {
            var moduleManagement = connectionManager.GetService<IModuleManagement>();
            var menuManagement = connectionManager.GetService<IMenuManagement>();
            var secretManagement = connectionManager.GetService<ISecretManagement>();

            var moduleIds = modules
                    .Where(x => x.ItemType == ItemType.Module
                ).Select(x => x.Id).ToArray();

            var menuIds = modules
                    .Where(x => x.ItemType == ItemType.Menu
                ).Select(x => x.Id).ToArray();

            var identityResult = IdentityResult.FailedResult();

            if (moduleIds.Length > 0 && !moduleManagement.GetAllModules().Any(x => moduleIds.Contains(x.Id)))
            {
                identityResult.AddError("moduleIds", Domain.Model.Identity.Validator.InvalidValue);
            }

            if (menuIds.Length > 0 && !menuManagement.GetAllMenus().Any(x => menuIds.Contains(x.Id)))
            {
                identityResult.AddError("menuIds", Domain.Model.Identity.Validator.InvalidValue);
            }

            if (identityResult.HasErrors)
                return identityResult;


            var secretValue = secretManagement.GetSecret(labKey);
            if (secretValue == null)
                connectionManager.Throw_Invalid_X_Portal_Key_Error(secretValue.Value);

            using (TransactionScope transactionScope = new TransactionScope(
                TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                var labModuleManagement = new LabModuleManagement(ApplicationDbContext.Create(secretValue.Value), connectionManager);
                var labMenuManagement = new LabMenuManagement(ApplicationDbContext.Create(secretValue.Value), connectionManager);

                await labModuleManagement.UpdateModulesAsync(moduleIds);

                await labMenuManagement.UpdateMenusAsync(menuIds);

                transactionScope.Complete();
            }
            return identityResult.MakeSuccessed();
        }

        public static List<LabMenuViewModel> GenerateMenuesTree(List<LabMenuViewModel> claimMenueViewModel)
        {
            return _generateMenuesTree(claimMenueViewModel, null);
        }

        private static List<LabMenuViewModel> _generateMenuesTree(
            List<LabMenuViewModel> claimMenueViewModel,
            int? parentId)
        {
            return claimMenueViewModel
                .Where(x => x.ParentId == parentId)
                .Select(x => new LabMenuViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    ModuleId = x.ModuleId,
                    ParentId = x.ParentId,
                    IsSelelcted = x.IsSelelcted,
                    Menus = _generateMenuesTree(claimMenueViewModel, x.Id)
                }).ToList();
        }

        public static async
            Task<ICollection<MasterPortalAppManagement.
                Domain.Models.
                Configuration.Response.
                ModuleViewModel>> GetLabModulesAsync(
            string labKey,
            IConnectionManager connectionManager)
        {
            var moduleManagement = connectionManager.GetService<IModuleManagement>();
            var menuManagement = connectionManager.GetService<IMenuManagement>();
            var secretManagement = connectionManager.GetService<ISecretManagement>();

            var secretValue = secretManagement.GetSecret(labKey);
            if (secretValue == null)
                connectionManager.Throw_Invalid_X_Portal_Key_Error(secretValue.Value);

            var labModuleManagement = new LabModuleManagement(ApplicationDbContext.Create(secretValue.Value), connectionManager);
            var labMenuManagement = new LabMenuManagement(ApplicationDbContext.Create(secretValue.Value), connectionManager);

            var labModules = await labModuleManagement
                .GetAllModules()
                .Select(x => x.Id)
                .ToListAsync();

            var labMenus = await labMenuManagement
                .GetAllMenus()
                .Select(x => x.Id)
                .ToListAsync();

            var menus = await menuManagement.GetAllMenus().Select(x => new LabMenuViewModel
            {
                Id = x.Id,
                ModuleId = x.ModuleId,
                Name = x.Name,
                ParentId = x.ParentId
            }).ToListAsync();

            menus.ForEach(x =>
            {
                if (labMenus.Contains(x.Id))
                    x.IsSelelcted = true;
                else
                    x.IsSelelcted = false;
            });

            menus = GenerateMenuesTree(menus);


            var modules = (await moduleManagement
                .GetAllModules().ToListAsync())
                .Select(x =>
                new MasterPortalAppManagement.
                Domain.Models.
                Configuration.Response.
                ModuleViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Order = x.Order,
                    CreateBy = x.CreateBy,
                    CreateDate = x.CreateDate,
                    Childs = menus.Where(_ => _.ModuleId == x.Id).ToList()
                }).ToList();

            modules.ForEach(x =>
            {
                if (labModules.Contains(x.Id))
                    x.IsSelelcted = true;
                else
                    x.IsSelelcted = false;
            });

            return modules;
        }

        public static async Task<CompendiumResult> AddOrUpdateModuleAsync(MasterPortalAppManagement.Domain.Models.Configuration.Request.ModuleViewModel moduleViewModel, IConnectionManager connectionManager)
        {
            var moduleManagement = connectionManager.GetService<IModuleManagement>();
            var identityResult = CompendiumResult.Failed;

            var isUpdating = moduleViewModel is UpdateModuleViewModel;
            if (isUpdating)
            {
                if (!await moduleManagement.IsModuleExistsByIdAsync((int)moduleViewModel.Id))
                    identityResult.AddError(nameof(moduleViewModel.Id), Domain.Model.Identity.Validator.InvalidValue);
            }
            if (identityResult.HasErrors)
                return identityResult;

            var isDone = await moduleManagement.SaveOrUpdateModuleAsync(moduleViewModel);
            identityResult.UpdateIdentifier(moduleViewModel.Id);
            return identityResult.Response(isDone);
        }
    }
}
