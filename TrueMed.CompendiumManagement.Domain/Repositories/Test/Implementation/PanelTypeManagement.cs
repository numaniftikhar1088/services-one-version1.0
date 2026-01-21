using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Implementation
{
    public class PanelTypeManagement : IPanelTypeManagement
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly IConnectionManager _connectionManager;

        public PanelTypeManagement(
            IConnectionManager connectionManager,
             ApplicationDbContext applicationDbContext
            )
        {
            this._applicationDbContext = applicationDbContext;
            this._connectionManager = connectionManager;
        }

        public IQueryable<PanelTypeModel> GetAllPanelTypes()
        {
            return _applicationDbContext.TblPanelTypes.Select(x => new PanelTypeModel
            {
                Id = x.PanelTypeId,
                Name = x.PanelType,
                CreateBy = x.CreatedBy,
                CreateDate = x.CreatedDate,
                IsActive = x.PanelTypeStatus
            }).OrderByDescending(x => x.CreateDate);
        }

        public async Task<bool> SaveOrUpdatePanelTypeAsync
            (Models.Test.Request.PanelTypeViewModel panelTypeSetupView)
        {

            var isUpdating = panelTypeSetupView is Models.Test.Request.UpdatePanelTypeViewModel;
            if (isUpdating && !await IsPanelTypeExistsByIdAsync((int)panelTypeSetupView.Id))
            {
                return false;
            }

            //name should be valid..
            if (!await IsPanelTypeNameValidAsync(new KeyValuePairViewModel<int?>
            {
                Id = panelTypeSetupView.Id,
                KeyValue = panelTypeSetupView.Name
            }))
                return false;

            var PanelType = await _applicationDbContext.TblPanelTypes
                .FirstOrDefaultAsync(x => x.PanelTypeId == panelTypeSetupView.Id);
            if (PanelType == null)
            {
                PanelType = new TblPanelType();
                PanelType.CreatedBy = _connectionManager.UserId;
                PanelType.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                PanelType.UpdatedBy = _connectionManager.UserId;
                PanelType.UpdatedDate = DateTimeNow.Get;
            }

            PanelType.PanelType = panelTypeSetupView.Name;
            PanelType.PanelTypeStatus = panelTypeSetupView.IsActive;

            if (isUpdating)
                _applicationDbContext.Update(PanelType).State = EntityState.Modified;
            else
                _applicationDbContext.Update(PanelType).State = EntityState.Added;

            var isAffected = await _applicationDbContext.SaveChangesAsync() > 0;
            panelTypeSetupView.Id = PanelType.PanelTypeId;
            return isAffected;
        }

        public async Task<bool> IsPanelTypeExistsByNameAsync(string name)
        {
            return await _applicationDbContext.TblPanelTypes.AnyAsync(x => x.PanelType.ToLower() == name.ToLower());
        }

        public async Task<bool> IsPanelTypeExistsByIdAsync(int id)
        {
            return await _applicationDbContext.TblPanelTypes.AnyAsync(x => x.PanelTypeId == id);
        }

        public async Task<int?> GetPanelTypeIdByNameAsync(string name)
        {
            return await _applicationDbContext.TblPanelTypes
                .Where(x => x.PanelType.ToLower() == name.ToLower())
                .Select(x => x.PanelTypeId).FirstOrDefaultAsync();
        }

        public async Task<bool> IsPanelTypeNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            if (uniqueKeyValidation.Id != null && await GetPanelTypeIdByNameAsync(uniqueKeyValidation.KeyValue) == (int)uniqueKeyValidation.Id)
            {
                return true;
            }
            else
            {
                return !await IsPanelTypeExistsByNameAsync(uniqueKeyValidation.KeyValue);
            }
        }

        public async Task<bool> DeletePanelTypeByIdAsync(int PanelTypeId)
        {
            return await _applicationDbContext
                .TblPanelTypes
                .Where(x => x.PanelTypeId == PanelTypeId)
                 .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsDeleted, true)) > 0;
        }

        public async Task<bool> PanelTypeActivationByIdAsync(int id, bool isActive)
        {
            return await _applicationDbContext.TblPanelTypes
                .Where(x => x.PanelTypeId == id)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.PanelTypeStatus, isActive)) > 0;
        }

    }
}
