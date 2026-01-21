using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation
{
    public class SectionManagement<TDbContext> : ISectionManagement<TDbContext> where TDbContext : DbContext
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _dbContext;

        public SectionManagement(
            IConnectionManager connectionManager,
            TDbContext dbContext
            )
        {
            this._connectionManager = connectionManager;
            this._dbContext = ApplicationDbContext.Create(dbContext.Database.GetConnectionString());
        }

        public IQueryable<SectionModel> GetAllSections()
        {
            return _dbContext.TblSections.AsNoTracking().Select(x => new SectionModel
            {
                Id = x.Id,
                IsSystemDefined = true,
                Name = x.SectionName,
                Order = x.Order ?? 0
            });
        }

        public async Task<bool> IsSectionExistsByNameAsync(string name)
        {
            return await _dbContext.TblSections.AnyAsync(x => x.SectionName.Trim().ToLower() == name.Trim().ToLower());
        }

        public async Task<bool> IsSectionExistsByIdAsync(int id)
        {
            return await _dbContext.TblSections.AnyAsync(x => x.Id == id);
        }

        public async Task<int?> GetSectionIdByNameAsync(string name)
        {
            return await _dbContext
                .TblSections
                .Where(x => x.SectionName.Trim().ToLower() == name.Trim().ToLower())
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> SaveOrUpdateSectionAsync(SectionViewModel sectionModel)
        {
            var isUpdating = sectionModel is UpdateSectionViewModel;
            if (isUpdating)
            {
                if (!await IsSectionExistsByIdAsync((int)sectionModel.Id))
                    return false;
            }

            var sectionObj = await _dbContext.TblSections.FirstOrDefaultAsync(x => x.Id == sectionModel.Id);
            if (sectionObj == null)
            {
                sectionObj = new TrueMed.Domain.Models.Database_Sets.Application.TblSection();
                sectionObj.CreatedBy = _connectionManager.UserId;
                sectionObj.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                sectionObj.UpdatedBy = _connectionManager.UserId;
                sectionObj.UpdatedDate = DateTimeNow.Get;
            }

            sectionObj.SectionName = sectionModel.Name;
            sectionObj.Order = sectionModel.Order;
            
            if (isUpdating)
            {
                _dbContext.Update(sectionObj).State = EntityState.Modified;
            }
            else
            {
                _dbContext.Update(sectionObj).State = EntityState.Added;
            }

            var isAffected = await _dbContext.SaveChangesAsync() > 0;
            sectionModel.Id = sectionObj.Id;
            return isAffected;
        }
    }
}
