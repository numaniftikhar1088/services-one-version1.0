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
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation
{
    public class ModuleSectionsManagement<TDbContext> : IModuleSectionsManagement<TDbContext> where TDbContext : DbContext
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IModuleManagement _moduleManagement;
        public ModuleSectionsManagement(
            IConnectionManager connectionManager,
            TDbContext dbContext
            )
        {
            this._connectionManager = connectionManager;
            this._dbContext = ApplicationDbContext.Create(dbContext.Database.GetConnectionString());
            _moduleManagement = connectionManager.GetService<IModuleManagement>();
        }

        public IQueryable<ModuleSectionsModel> GetAllModuleSections()
        {
            return _dbContext
                .TblModuleSections.
                GroupBy(x => x.ModuleId)
                .Select(x => new ModuleSectionsModel
                {
                    ModuleId = x.Key,
                    SectionIds = x.Select(_ => _.SectionId)
                });
        }

        public async Task<bool> IsSectionExistsInModuleByNameAsync(
            string moduleName,
            string sectionName)
        {
            var moduleId = await _moduleManagement.GetModuleIdByNameAsync(moduleName);
            return await _dbContext
                .TblModuleSections
                .AnyAsync(x =>
                x.Section.SectionName.Trim().ToLower() == sectionName.Trim().ToLower() &&
                x.ModuleId == moduleId
                );
        }

        public async Task<bool> IsSectionExistsInModuleByIdAsync(int moduleId, int sectionId)
        {
            return await _dbContext
                 .TblModuleSections
                .AnyAsync(x =>
                x.ModuleId == moduleId &&
                 x.SectionId == sectionId);
        }

        public async Task<int?> GetModuleIdBySectionNameAsync(string name)
        {
            return await _dbContext.TblModuleSections
                .Where(x => x.Section.SectionName.Trim().ToLower() == name.Trim().ToLower())
                .Select(x => x.SectionId)
                .FirstOrDefaultAsync();
        }

        public async Task<int?> GetModuleIdBySectionIdAsync(int id)
        {
            return await _dbContext
                .TblModuleSections
                .Where(x =>
                x.SectionId == id)
                .Select(x => x.SectionId)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> AddSectionInModuleByIdAsync(int moduleId, int sectionId)
        {
            if (await IsSectionExistsInModuleByIdAsync(moduleId, sectionId))
                return false;
            _dbContext.TblModuleSections.Add(new TrueMed.Domain.Models.Database_Sets.Application.TblModuleSection
            {
                ModuleId = moduleId,
                SectionId = sectionId,
                CreateDate = DateTimeNow.Get,
                CreateBy = _connectionManager.UserId
            });
            var isAffected = await _dbContext.SaveChangesAsync() > 0;
            return isAffected;
        }

        public async Task<string?> GetModuleNameBySectionIdAsync(int id)
        {
            var module = _connectionManager.GetService<IModuleManagement>();
            var moduleId = await _dbContext
               .TblModuleSections
               .Where(x => x.SectionId == id)
               .Select(x => x.ModuleId)
               .FirstOrDefaultAsync();
            if (moduleId != 0)
                return await module.GetModuleNameByIdAsync(moduleId);
            return "";
        }

        public async Task<string?> GetModuleNameBySectionNameAsync(string name)
        {
            var module = _connectionManager.GetService<IModuleManagement>();
            var moduleId = await _dbContext
               .TblModuleSections
               .Where(x => x.Section.SectionName.ToLower().Trim() == name.ToLower().Trim())
               .Select(x => x.ModuleId)
               .FirstOrDefaultAsync();
            if (moduleId != 0)
                return await module.GetModuleNameByIdAsync(moduleId);
            return "";
        }

    }
}
