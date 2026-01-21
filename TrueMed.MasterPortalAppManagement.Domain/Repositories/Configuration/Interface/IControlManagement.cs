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
    public interface IControlManagement<TDbContext> where TDbContext : DbContext
    {
        IQueryable<ControlModel> GetAllControls();
        Task<int?> GetControlIdByNameAsync(string name);
        Task<bool> IsControlExistsByIdAsync(int id);
        Task<bool> IsControlExistsByNameAsync(string name);
        Task<bool> SaveOrUpdateControlAsync(ControlViewModel ControlModel, bool isUserDefined);
    }
}
