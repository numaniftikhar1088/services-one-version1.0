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
    public interface ISectionManagement<TDbContext> where TDbContext : DbContext
    {
        IQueryable<SectionModel> GetAllSections();
        Task<int?> GetSectionIdByNameAsync(string name);
        Task<bool> IsSectionExistsByIdAsync(int id);
        Task<bool> IsSectionExistsByNameAsync(string name);
        Task<bool> SaveOrUpdateSectionAsync(SectionViewModel sectionModel);
    }
}
