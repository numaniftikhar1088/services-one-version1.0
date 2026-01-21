using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface
{
    public interface IModuleManagement
    {
        IQueryable<ModuleModel> GetAllModules();
        Task<int?> GetModuleIdByNameAsync(string name);
        Task<string?> GetModuleNameByIdAsync(int id);
        Task<bool> IsModuleExistsByIdAsync(int id);
        Task<bool> IsModuleExistsByNameAsync(string name);
        Task<bool> SaveOrUpdateModuleAsync(ModuleViewModel ModuleModel);
    }
}
