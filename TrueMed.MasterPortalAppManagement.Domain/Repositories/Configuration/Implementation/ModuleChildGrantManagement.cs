using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation
{
    public class ModuleChildGrantManagement<TDbContext> : IModuleChildGrantManagement<TDbContext> where TDbContext
        : DbContext
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _dbContext;

        public ModuleChildGrantManagement(
            IConnectionManager connectionManager,
            TDbContext dbContext
            )
        {
            this._connectionManager = connectionManager;
            this._dbContext = ApplicationDbContext.Create(dbContext.Database.GetConnectionString());

        }

        public async Task<bool> DenyControlInModuleById(int moduleId, int controlId)
        {
            if (await IsControlDeniedInModuleById(moduleId, controlId))
                return false;
            _dbContext.TblModuleDeniedControls.Add(new TblModuleDeniedControl
            {
                ControlId = controlId,
                CreateBy = _connectionManager.UserId,
                CreateDate = DateTimeNow.Get,
                ModuleId = moduleId,
            });
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> DenySectionInModuleById(int moduleId, int sectionId)
        {
            if (await IsSectionDeniedInModuleById(moduleId, sectionId))
                return false;
            _dbContext.TblModuleDeniedSections.Add(new TblModuleDeniedSection
            {
                SectionId = sectionId,
                CreateBy = _connectionManager.UserId,
                CreateDate = DateTimeNow.Get,
                ModuleId = moduleId,
            });
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public IQueryable<ModuleDeniedControlsModel> GetAllDeniedControls()
        {
            return _dbContext.TblModuleDeniedControls
                   .GroupBy(x => x.ModuleId)
                   .Select(x => new ModuleDeniedControlsModel
                   {
                       ModuleId = x.Key,
                       ControlIds = x.Select(_ => _.ControlId)
                   });
        }

        public IQueryable<ModuleDeniedSectionsModel> GetAllDeniedSections()
        {
            return _dbContext.TblModuleDeniedSections.GroupBy(x => x.ModuleId)
                   .Select(x => new ModuleDeniedSectionsModel
                   {
                       ModuleId = x.Key,
                       SectionIds = x.Select(_ => _.SectionId)
                   });
        }

        public async Task<bool> GrantControlInModuleById(int moduleId, int controlId)
        {
            if (!await IsControlDeniedInModuleById(moduleId, controlId))
                return false;
            return await _dbContext
                 .TblModuleDeniedControls
                 .Where(x => x.ModuleId == moduleId && x.ControlId == controlId)
                 .ExecuteDeleteAsync() > 0;
        }

        public async Task<bool> GrantSectionInModuleById(int moduleId, int sectionId)
        {
            if (!await IsSectionDeniedInModuleById(moduleId, sectionId))
                return false;
            return await _dbContext
                 .TblModuleDeniedSections
                 .Where(x => x.ModuleId == moduleId && x.SectionId == sectionId)
                 .ExecuteDeleteAsync() > 0;
        }

        public async Task<bool> IsControlDeniedInModuleById(int moduleId, int controlId)
        {
            return await _dbContext
                 .TblModuleDeniedControls
                 .AnyAsync(x => x.ModuleId == moduleId &&
                 x.ControlId == controlId);
        }

        public async Task<bool> IsSectionDeniedInModuleById(int moduleId, int sectionId)
        {
            return await _dbContext
                 .TblModuleDeniedSections
                 .AnyAsync(x => x.ModuleId == moduleId &&
                 x.SectionId == sectionId);
        }
    }

}
