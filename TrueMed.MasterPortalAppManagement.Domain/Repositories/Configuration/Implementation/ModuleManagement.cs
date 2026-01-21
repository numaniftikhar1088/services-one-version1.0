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
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation
{
    public class ModuleManagement : IModuleManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly MasterDbContext _dbContext;
        private readonly IMapper _mapper;

        public ModuleManagement(
            IConnectionManager connectionManager,
            MasterDbContext masterDbContext)
        {
            this._connectionManager = connectionManager;
            this._dbContext = masterDbContext;
            _mapper = _connectionManager.GetService<IMapper>();
        }


        public IQueryable<ModuleModel> GetAllModules()
        {
            return _dbContext.Set<TblModule>().Select(x => new ModuleModel
            {
                Id = x.Id,
                Name = x.Name,
                Icon = x.Icon,
                Order = x.OrderId ?? 0,
                CreateBy = x.CreateBy,
                CreateDate = x.CreateDate
            });
        }

        public async Task<bool> IsModuleExistsByNameAsync(string name)
        {
            return await _dbContext
                .Set<TblModule>()
                .AnyAsync(x => x.Name.Trim().ToLower() == name.Trim().ToLower());
        }

        public async Task<bool> IsModuleExistsByIdAsync(int id)
        {
            return await _dbContext
                 .Set<TblModule>()
                .AnyAsync(x => x.Id == id);
        }

        public async Task<int?> GetModuleIdByNameAsync(string name)
        {
            return await _dbContext
                .Set<TblModule>()
                .Where(x => x.Name.Trim().ToLower() == name.Trim().ToLower())
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<string?> GetModuleNameByIdAsync(int id)
        {
            return await _dbContext
                .Set<TblModule>()
                .Where(x => x.Id == id)
                .Select(x => x.Name)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> SaveOrUpdateModuleAsync(ModuleViewModel ModuleModel)
        {
            if (ModuleModel.Id > 0)
            {
                if (!await IsModuleExistsByIdAsync((int)ModuleModel.Id))
                    return false;
            }

            var ModuleObj = await _dbContext
                .Set<TblModule>()
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == ModuleModel.Id);

            var createBy = ModuleObj?.CreateBy;
            var createDate = ModuleObj?.CreateDate;

            _mapper.Map(ModuleModel, ModuleObj);

            if (ModuleModel.Id > 0)
            {
                ModuleObj.CreateBy = createBy;
                ModuleObj.CreateDate = createDate;

                ModuleObj.UpdateBy = _connectionManager.UserId;
                ModuleObj.UpdateDate = DateTimeNow.Get;

                _dbContext.Update(ModuleObj).State = EntityState.Modified;
            }
            else
            {
                ModuleObj.CreateBy = _connectionManager.UserId;
                ModuleObj.CreateDate = DateTimeNow.Get;

                _dbContext.Update(ModuleObj).State = EntityState.Added;
            }

            var isAffected = await _dbContext.SaveChangesAsync() > 0;
            ModuleModel.Id = ModuleObj.Id;
            return isAffected;
        }
    }
}
