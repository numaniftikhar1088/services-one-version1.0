using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation
{
    public class LabModuleManagement : ILabModuleManagement
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConnectionManager _connectionManager;

        public LabModuleManagement(ApplicationDbContext dbContext, IConnectionManager connectionManager)
        {
            this._dbContext = dbContext;
            this._connectionManager = connectionManager;
        }

        public IQueryable<LabModuleModel> GetAllModules()
        {
            return _dbContext.Set<TblModule>().Select(x => new LabModuleModel
            {
                Id = x.ModuleId,
                CreateBy = x.CreateBy,
                CreateDate = x.CreateDate
            });
        }

        public async Task<bool> UpdateModulesAsync(int[] modules)
        {
            await _dbContext.TblModules.ExecuteDeleteAsync();
            await _dbContext.TblModules.AddRangeAsync(modules.Select(moduleId => new TblModule
            {
                CreateBy = _connectionManager.UserId,
                CreateDate = DateTimeNow.Get,
                ModuleId = moduleId
            }));
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
