using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Implementation
{
    public class PanelManagement : IPanelManagement
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly IConnectionManager _connectionManager;

        public PanelManagement(
            IConnectionManager connectionManager,
            ApplicationDbContext applicationDbContext
            )
        {
            this._applicationDbContext = applicationDbContext;
            this._connectionManager = connectionManager;
        }

        public IQueryable<PanelModel> GetAllPanels()
        {
            //return _applicationDbContext.TblCompendiumPanels.Select(x => new PanelModel
            //{
            //    Id = x.Id,
            //    Name = x.PanelName,
            //    //DisplayName = x.PanelDisplayName,
            //    CreateBy = x.CreatedBy,
            //    CreateDate = x.CreatedDate,
            //    IsActive = x.IsActive,
            //    //PanelType = x.PanelTypeId,
            //    RequisitionType = x.ReqTypeId,
            //    TmitCode = x.Tmitcode,
            //    Department = x.Department,

            //}).OrderByDescending(x => x.CreateDate);
            return _applicationDbContext.TblCompendiumPanels
                .Join(_applicationDbContext.TblDepartments,
                prip => prip.Department,
                refer => refer.DepartmentName, (pri, refer) => new PanelModel
                {
                    Id = pri.Id,
                    Name = pri.PanelName,
                    CreateBy = pri.CreatedBy,
                    CreateDate = pri.CreatedDate,
                    Department = pri.Department,
                    DepartmentName = refer.DepartmentName,
                    IsActive = pri.IsActive,
                    RequisitionType = pri.ReqTypeId,
                    TmitCode = pri.Tmitcode,
                });
        }

        public async Task<bool> SaveOrUpdatePanelAsync
            (Models.Test.Request.PanelViewModel panelSetupView)
        {

            var isUpdating = panelSetupView is Models.Test.Request.UpdatePanelViewModel;
            if (isUpdating && !await IsPanelExistsByIdAsync((int)panelSetupView.Id))
            {
                return false;
            }

            //name should be valid..
            if (!await IsPanelNameValidAsync(new KeyValuePairViewModel<int?>
            {
                Id = panelSetupView.Id,
                KeyValue = panelSetupView.Name
            }))
                return false;

            var panel = await _applicationDbContext.TblCompendiumPanels
                 .FirstOrDefaultAsync(x => x.Id == panelSetupView.Id);
            if (panel == null)
            {
                panel = new TblCompendiumPanel();
                panel.CreatedBy = _connectionManager.UserId;
                panel.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                panel.UpdatedBy = _connectionManager.UserId;
                panel.UpdatedDate = DateTimeNow.Get;
            }

            panel.PanelName = panelSetupView.Name;
            panel.ReqTypeId = panelSetupView.RequisitionType;
            //panel.PanelTypeId = panelSetupView.PanelType;
            panel.Tmitcode = panelSetupView.TMIT_Code;
            //panel.PanelDisplayName = panelSetupView.DisplayName;
            panel.IsActive = panelSetupView.IsActive;

            if (isUpdating)
                _applicationDbContext.Update(panel).State = EntityState.Modified;
            else
                _applicationDbContext.Update(panel).State = EntityState.Added;

            var isAffected = await _applicationDbContext.SaveChangesAsync() > 0;
            panelSetupView.Id = panel.Id;
            return isAffected;
        }

        public async Task<bool> SaveOrUpdateCompendiumPanelAsync
           (Models.Test.Request.PanelViewModel panelSetupView)
        {

            var isUpdating = panelSetupView is Models.Test.Request.UpdatePanelViewModel;
            if (isUpdating && !await IsPanelExistsByIdAsync((int)panelSetupView.Id))
            {
                return false;
            }

            //name should be valid..
            if (!await IsPanelNameValidAsync(new KeyValuePairViewModel<int?>
            {
                Id = panelSetupView.Id,
                KeyValue = panelSetupView.Name
            }))
                return false;

            var panel = await _applicationDbContext.TblCompendiumPanels
                 .FirstOrDefaultAsync(x => x.Id == panelSetupView.Id);
            if (panel == null)
            {
                panel = new TblCompendiumPanel();
                panel.CreatedBy = _connectionManager.UserId;
                panel.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                panel.UpdatedBy = _connectionManager.UserId;
                panel.UpdatedDate = DateTimeNow.Get;
            }

            panel.PanelName = panelSetupView.Name;
            panel.ReqTypeId = panelSetupView.RequisitionType;
            //panel.PanelTypeId = panelSetupView.PanelType;
            panel.Tmitcode = panelSetupView.TMIT_Code;
            //panel.PanelDisplayName = panelSetupView.DisplayName;
            panel.IsActive = panelSetupView.IsActive;

            if (isUpdating)
                _applicationDbContext.Update(panel).State = EntityState.Modified;
            else
                _applicationDbContext.Update(panel).State = EntityState.Added;

            var isAffected = await _applicationDbContext.SaveChangesAsync() > 0;
            panelSetupView.Id = panel.Id;
            return isAffected;
        }

        public async Task<bool> IsPanelExistsByNameAsync(string name)
        {
            return await _applicationDbContext.TblCompendiumPanels.AnyAsync(x => x.PanelName.ToLower() == name.ToLower());
        }

        public async Task<bool> IsPanelExistsByIdAsync(int id)
        {
            return await _applicationDbContext.TblCompendiumPanels.AnyAsync(x => x.Id == id);
        }

        public async Task<int?> GetPanelIdByNameAsync(string name)
        {
            return await _applicationDbContext.TblCompendiumPanels
                .Where(x => x.PanelName.ToLower() == name.ToLower())
                .Select(x => x.Id).FirstOrDefaultAsync();
        }

        public async Task<bool> IsPanelNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            if (uniqueKeyValidation.Id != null && await GetPanelIdByNameAsync(uniqueKeyValidation.KeyValue) == (int)uniqueKeyValidation.Id)
            {
                return true;
            }
            else
            {
                return !await IsPanelExistsByNameAsync(uniqueKeyValidation.KeyValue);
            }
        }

        public async Task<bool> DeletePanelByIdAsync(int panelId)
        {
            return await _applicationDbContext
                .TblCompendiumPanels
                .Where(x => x.Id == panelId)
                 .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsDeleted, true)) > 0;
        }

        public async Task<bool> PanelActivationByIdAsync(int id, bool isActive)
        {
            return await _applicationDbContext.TblCompendiumPanels
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsActive, isActive)) > 0;
        }
    }
}
