using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface
{
    public interface IModuleSectionsManagement<TDbContext> where TDbContext : DbContext
    {
        Task<bool> AddSectionInModuleByIdAsync(int moduleId, int sectionId);
        IQueryable<ModuleSectionsModel> GetAllModuleSections();
        Task<int?> GetModuleIdBySectionIdAsync(int id);
        Task<string?> GetModuleNameBySectionIdAsync(int id);
        Task<int?> GetModuleIdBySectionNameAsync(string name);
        Task<string?> GetModuleNameBySectionNameAsync(string name);
        Task<bool> IsSectionExistsInModuleByIdAsync(int moduleId, int sectionId);
        Task<bool> IsSectionExistsInModuleByNameAsync(string moduleName, string sectionName);
    }
}
