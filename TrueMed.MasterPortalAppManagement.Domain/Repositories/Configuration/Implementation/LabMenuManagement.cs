using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation
{
    public class LabMenuManagement : ILabMenuManagement
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConnectionManager _connectionManager;

        public LabMenuManagement(ApplicationDbContext applicationDbContext, IConnectionManager connectionManager)
        {
            this._dbContext = applicationDbContext;
            this._connectionManager = connectionManager;
        }

        public IQueryable<LabMenuModel> GetAllMenus()
        {
            return _dbContext.Set<TblPage>().Select(x => new LabMenuModel
            {
                Id = x.Id,
                CreateBy = x.CreateBy,
                CreateDate = x.CreateDate
            });
        }

        public async Task<bool> UpdateMenusAsync(int[] menus)
        {
            await _dbContext.TblPages.ExecuteDeleteAsync();
            await _dbContext.TblPages.AddRangeAsync(menus.Select(pageId => new TblPage
            {
                CreateBy = _connectionManager.UserId,
                CreateDate = DateTimeNow.Get,
                Id = pageId
            }));
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
