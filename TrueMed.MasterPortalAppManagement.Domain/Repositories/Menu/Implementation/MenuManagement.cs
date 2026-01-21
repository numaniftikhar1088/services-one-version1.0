using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Identity;
using TrueMed.MasterPortalAppManagement.Domain.Models.Menu.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Menu.Request;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Interface;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Menu.Implementation
{
    public class MenuManagement : IMenuManagement
    {
        private readonly MasterDbContext _masterDbContext;
        private readonly IConnectionManager _connectionManager;
        private readonly IMapper _mapper;

        public MenuManagement(MasterDbContext masterDbContext, IConnectionManager connectionManager)
        {
            this._masterDbContext = masterDbContext;
            this._connectionManager = connectionManager;
            _mapper = connectionManager.GetService<IMapper>();
        }

        public async Task<bool> DeleteMenuByIdMenuAsync(int id)
        {
            return await _masterDbContext.TblPages.ExecuteUpdateAsync(x =>
             x.SetProperty(_ => _.IsActive, false)
             .SetProperty(_ => _.UpdatedBy, _connectionManager.UserId)
             .SetProperty(_ => _.UpdatedDate, DateTimeNow.Get)
             ) > 0;
        }

        public IQueryable<MenuModel> GetAllMenus()
        {
            return _masterDbContext.TblPages.Select(x => new MenuModel
            {
                Id = x.Id,
                IsActive = x.IsActive ?? true,
                MenuLink = x.LinkUrl,
                Name = x.Name,
                Order = x.OrderId ?? 0,
                CreateDate = x.CreatedDate,
                CreateBy = x.CreatedBy,
                Icon = x.MenuIcon,
                ParentId = x.ParentId,
                ModuleId = x.Modules.Select(_ => _.Id).FirstOrDefault(),
                Claims = x.Claims.Select(c => new ClaimModel { Id = c.Id, Name = x.Name })
            });
        }

        public async Task<ICollection<ModuleModel>> GetModulesByIdsAsync(params int[] ids)
        {
            return await _masterDbContext.TblModules.Select(x => new ModuleModel
            {
                ModuleId = x.Id,
                Icon = x.Icon,
                ModuleName = x.Name,
                Order = x.OrderId
            }).Where(x => ids.Contains(x.ModuleId)).ToArrayAsync();
        }

        public async Task<bool> IsMenuExistsByNameAsync(string name)
        {
            return await _masterDbContext.TblPages.AnyAsync(x => x.Name.ToLower().Trim() == name.ToLower().Trim());
        }

        public async Task<bool> IsMenuNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            if (await GetMenuIdByNameAsync(uniqueKeyValidation.KeyValue) == Convert.ToInt32(uniqueKeyValidation.Id))
            {
                return true;
            }
            else
            {
                return !await IsMenuExistsByNameAsync(uniqueKeyValidation.KeyValue);
            }
        }

        public async Task<int?> GetMenuIdByNameAsync(string name)
        {
            return await _masterDbContext.TblPages
                .Where(x => x.Name.ToLower().Trim() == name.ToLower().Trim())
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> MenuActivationByIdAsync(int id, bool isActive)
        {
            return await _masterDbContext.TblPages.ExecuteUpdateAsync(x =>
            x.SetProperty(_ => _.IsActive, isActive)
            .SetProperty(_ => _.UpdatedBy, _connectionManager.UserId)
            .SetProperty(_ => _.UpdatedDate, DateTimeNow.Get)
            ) > 0;
        }

        public async Task<IdentityResult> SaveOrUpdateMenuAsync(MenuViewModel menuViewModel)
        {
            var identityResult = IdentityResult.FailedResult();
            var isUpdating = menuViewModel is UpdateMenuViewModel;
            if (isUpdating)
            {
                if (!await IsMenuNameValidAsync(new KeyValuePairViewModel<int?>
                {
                    Id = menuViewModel.Id,
                    KeyValue = menuViewModel.Name
                }))
                {
                    identityResult.AddError(nameof(menuViewModel.Name), Validator.InvalidValue);
                }
            }

            if (identityResult.HasErrors)
                return identityResult;

            var menuObj = await _masterDbContext.TblPages.FirstOrDefaultAsync(x => x.Id == menuViewModel.Id);
            if (menuObj == null)
            {
                menuObj = new Sevices.MasterEntities.TblPage();
                menuObj.CreatedBy = _connectionManager.UserId;
                menuObj.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                menuObj.UpdatedBy = _connectionManager.UserId;
                menuObj.UpdatedDate = DateTimeNow.Get;
            }

            _mapper.Map(menuViewModel, menuObj);

            var isAffected = await _masterDbContext.SaveChangesAsync() > 0;
            menuViewModel.Id = menuObj.Id;
            identityResult.UpdateIdentifier(menuObj.Id);
            return identityResult.CreateResponse(isAffected);
        }

    }
}
