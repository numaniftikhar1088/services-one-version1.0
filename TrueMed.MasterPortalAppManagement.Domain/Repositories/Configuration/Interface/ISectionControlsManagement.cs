using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface
{
    public interface ISectionControlsManagement<TDbContext> where TDbContext : DbContext
    {
        Task<bool> AddControlInSectionByIdAsync(int sectionId, int controlId);
        IQueryable<SectionControlsModel> GetAllSectionControls();
        Task<int?> GetSectionIdByControlIdAsync(int id);
        Task<int?> GetSectionIdByControlNameAsync(string name);
        Task<bool> IsControlExistsInSectionByIdAsync(int sectionId, int controlId);
        Task<bool> IsControlExistsInSectionByNameAsync(string sectionName, string controlName);
    }
}
