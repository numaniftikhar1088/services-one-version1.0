using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation
{
    public class ControlManagement<TDbContext> : IControlManagement<TDbContext> where TDbContext
        : DbContext
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _dbContext;

        public ControlManagement(
            IConnectionManager connectionManager,
            TDbContext dbContext
            )
        {
            this._connectionManager = connectionManager;
            this._dbContext = ApplicationDbContext.Create(dbContext.Database.GetConnectionString());
        }

        public IQueryable<ControlModel> GetAllControls()
        {
            return _dbContext.TblControls.Select(x => new ControlModel
            {
                Id = x.Id,
                IsSystemDefined = x.IsSystemControl,
                IsRequired = x.IsSystemRequired,
                IsVisible = x.IsActive ?? false,
                Label = x.ControlName,
                Name = x.ControlKey,
                Type = (FieldType)x.TypeOfControl,
                Order = x.SortOrder,
                OptionsString = x.Options ?? ""
            });
        }

        public async Task<bool> IsControlExistsByNameAsync(string name)
        {
            return await _dbContext
                .TblControls
                .AnyAsync(x => x.ControlName.Trim().ToLower() == name.Trim().ToLower());
        }

        public async Task<bool> IsControlExistsByIdAsync(int id)
        {
            return await _dbContext
                 .TblControls
                .AnyAsync(x => x.Id == id);
        }

        public async Task<int?> GetControlIdByNameAsync(string name)
        {
            return await _dbContext
                .TblControls
                .Where(x => x.ControlName.Trim().ToLower() == name.Trim().ToLower())
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> SaveOrUpdateControlAsync(ControlViewModel ControlModel, bool isUserDefined)
        {
            var isUpdating = ControlModel is UpdateControlViewModel;
            if (isUpdating)
            {
                if (!await IsControlExistsByIdAsync((int)ControlModel.Id))
                    return false;
            }

            var ControlObj = await _dbContext
                .TblControls
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == ControlModel.Id);
            if (ControlObj == null)
            {
                ControlObj = new TrueMed.Domain.Models.Database_Sets.Application.TblControl();
                ControlObj.CreatedBy = _connectionManager.UserId;
                ControlObj.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                ControlObj.UpdatedBy = _connectionManager.UserId;
                ControlObj.UpdatedDate = DateTimeNow.Get;
            }

            ControlObj.ControlKey = ControlModel.Name;
            ControlObj.ControlName = ControlModel.Label;
            ControlObj.DefaultValue = ControlModel.DefaultValue;
            ControlObj.TypeOfControl = (int)ControlModel.Type;
            ControlObj.IsActive = ControlModel.IsVisible;
            ControlObj.IsSystemRequired = ControlModel.IsRequired ?? false;
            ControlObj.SortOrder = ControlModel.Order ?? 0;
            ControlObj.Options =  ControlModel.GetOptionsSearialized();
            ControlObj.IsSystemControl = (!isUserDefined);

            if (isUpdating)
                _dbContext.Update(ControlObj).State = EntityState.Modified;
            else
                _dbContext.Update(ControlObj).State = EntityState.Added;

            var isAffected = await _dbContext.SaveChangesAsync() > 0;
            ControlModel.Id = ControlObj.Id;
            return isAffected;
        }
    }
}
