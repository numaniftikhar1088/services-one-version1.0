using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface
{
    public interface IModuleChildGrantManagement<TDbContext> where TDbContext : DbContext
    {
        public Task<bool> IsControlDeniedInModuleById(int moduleId, int controlId);
        public Task<bool> IsSectionDeniedInModuleById(int moduleId, int sectionId);
        public Task<bool> DenySectionInModuleById(int moduleId, int sectionId);
        public Task<bool> DenyControlInModuleById(int moduleId, int controlId);
        public Task<bool> GrantControlInModuleById(int moduleId, int controlId);
        public Task<bool> GrantSectionInModuleById(int moduleId, int sectionId);
        public IQueryable<ModuleDeniedControlsModel> GetAllDeniedControls();
        public IQueryable<ModuleDeniedSectionsModel> GetAllDeniedSections();
    }
}
